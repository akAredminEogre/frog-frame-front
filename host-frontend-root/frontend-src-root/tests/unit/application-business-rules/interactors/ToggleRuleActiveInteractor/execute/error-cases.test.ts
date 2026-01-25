/**
 * ToggleRuleActiveInteractor.execute - 異常系テスト
 * 1. repository.getByIdでエラーが発生した場合、presentErrorが呼び出される
 * 2. repository.updateでエラーが発生した場合、presentErrorが呼び出される
 */
import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/mocks/createMockTabsGateway';
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { createMockPresenter } from 'tests/unit/application-business-rules/interactors/ToggleRuleActiveInteractor/mocks/createMockPresenter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/ToggleRuleActiveInputData';
import { ToggleRuleActiveErrorOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveErrorOutputData';
import { ToggleRuleActiveInteractor } from 'src/application-business-rules/interactors/ToggleRuleActiveInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { IToggleRuleActivePresenter } from 'src/application-business-rules/ports/output/IToggleRuleActivePresenter';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('ToggleRuleActiveInteractor.execute - 異常系', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockTabsGateway: ITabsGateway;
  let mockPresenter: IToggleRuleActivePresenter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRepository();
    mockTabsGateway = createMockTabsGateway();
    mockPresenter = createMockPresenter();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'repository.getByIdでエラーが発生した場合、presentErrorが呼び出される',
      input: { ruleId: 1 },
      setupMocks: (repository: IRewriteRuleRepository) => {
        (repository.getById as ReturnType<typeof vi.fn>).mockRejectedValue(
          new Error('ルールが見つかりません')
        );
      },
      expectedErrorMessage: 'ルールが見つかりません',
    },
    {
      description: 'repository.updateでエラーが発生した場合、presentErrorが呼び出される',
      input: { ruleId: 2 },
      setupMocks: (repository: IRewriteRuleRepository) => {
        const rule = new RewriteRule(2, 'old', 'new', 'https://example.com', false, true);
        (repository.getById as ReturnType<typeof vi.fn>).mockResolvedValue(rule);
        (repository.update as ReturnType<typeof vi.fn>).mockRejectedValue(
          new Error('更新に失敗しました')
        );
      },
      expectedErrorMessage: '更新に失敗しました',
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      testCase.setupMocks(mockRepository);

      const interactor = new ToggleRuleActiveInteractor(
        mockRepository,
        mockTabsGateway,
        mockPresenter
      );
      const inputData = new ToggleRuleActiveInputData(testCase.input.ruleId);

      await interactor.execute(inputData);

      expect(mockPresenter.present).not.toHaveBeenCalled();
      expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
      expect(mockPresenter.presentError).toHaveBeenCalledWith(
        expect.any(ToggleRuleActiveErrorOutputData)
      );

      const errorData = (mockPresenter.presentError as ReturnType<typeof vi.fn>).mock
        .calls[0][0] as ToggleRuleActiveErrorOutputData;
      expect(errorData.ruleId).toBe(testCase.input.ruleId);
      expect(errorData.message).toBe(testCase.expectedErrorMessage);
    });
  });
});
