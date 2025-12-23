/**
 * ToggleRuleActiveInteractor.execute - 異常系テスト
 * 1. repository.getByIdでエラーが発生した場合、presentErrorが呼び出される
 * 2. repository.updateでエラーが発生した場合、presentErrorが呼び出される
 * 3. tabsGateway.reloadMatchingTabsでエラーが発生した場合、presentとpresentErrorの両方が呼び出される
 */
import { createMockPresenter } from 'tests/unit/application-business-rules/interactors/ToggleRuleActiveInteractor/mocks/createMockPresenter';
import { createMockRepository } from 'tests/unit/application-business-rules/interactors/ToggleRuleActiveInteractor/mocks/createMockRepository';
import { createMockTabsGateway } from 'tests/unit/application-business-rules/interactors/ToggleRuleActiveInteractor/mocks/createMockTabsGateway';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/ToggleRuleActiveInputData';
import { ToggleRuleActiveErrorOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveErrorOutputData';
import { ToggleRuleActiveOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveOutputData';
import { ToggleRuleActiveInteractor } from 'src/application-business-rules/interactors/ToggleRuleActiveInteractor';
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

  it('tabsGateway.reloadMatchingTabsでエラーが発生した場合、presentが先に呼び出された後presentErrorが呼び出される', async () => {
    const ruleId = 3;
    const rule = new RewriteRule(ruleId, 'old', 'new', 'https://example.com', false, true);
    (mockRepository.getById as ReturnType<typeof vi.fn>).mockResolvedValue(rule);
    (mockRepository.update as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    (mockTabsGateway.reloadMatchingTabs as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('タブの再読み込みに失敗しました')
    );

    const interactor = new ToggleRuleActiveInteractor(
      mockRepository,
      mockTabsGateway,
      mockPresenter
    );
    const inputData = new ToggleRuleActiveInputData(ruleId);

    await interactor.execute(inputData);

    expect(mockPresenter.present).toHaveBeenCalledTimes(1);
    expect(mockPresenter.present).toHaveBeenCalledWith(expect.any(ToggleRuleActiveOutputData));
    const outputData = (mockPresenter.present as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as ToggleRuleActiveOutputData;
    expect(outputData.toggledRule.id).toBe(ruleId);
    expect(outputData.toggledRule.isActive).toBe(false);

    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
    expect(mockPresenter.presentError).toHaveBeenCalledWith(
      expect.any(ToggleRuleActiveErrorOutputData)
    );
    const errorData = (mockPresenter.presentError as ReturnType<typeof vi.fn>).mock
      .calls[0][0] as ToggleRuleActiveErrorOutputData;
    expect(errorData.ruleId).toBe(ruleId);
    expect(errorData.message).toBe('タブの再読み込みに失敗しました');
  });
});
