/**
 * DeleteRuleInteractor.execute - 正常系テスト
 * 1. ルールIDを指定して削除が実行される
 */
import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/mocks/createMockTabsGateway';
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { createMockPresenter } from 'tests/unit/application-business-rules/interactors/DeleteRuleInteractor/mocks/createMockPresenter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DeleteRuleInputData } from 'src/application-business-rules/dto/input/DeleteRuleInputData';
import { DeleteRuleOutputData } from 'src/application-business-rules/dto/output/DeleteRuleOutputData';
import { DeleteRuleInteractor } from 'src/application-business-rules/interactors/DeleteRuleInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { IDeleteRulePresenter } from 'src/application-business-rules/ports/output/IDeleteRulePresenter';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('DeleteRuleInteractor.execute - 正常系', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockTabsGateway: ITabsGateway;
  let mockPresenter: IDeleteRulePresenter;

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
      description: 'ルールIDを指定して削除が実行される',
      input: { ruleId: 1 },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      const rule = new RewriteRule(
        testCase.input.ruleId,
        'oldString',
        'newString',
        'https://example.com',
        false,
        true
      );
      (mockRepository.getById as ReturnType<typeof vi.fn>).mockResolvedValue(rule);

      const interactor = new DeleteRuleInteractor(
        mockRepository,
        mockTabsGateway,
        mockPresenter
      );
      const inputData = new DeleteRuleInputData(testCase.input.ruleId);

      await interactor.execute(inputData);

      expect(mockRepository.getById).toHaveBeenCalledTimes(1);
      expect(mockRepository.getById).toHaveBeenCalledWith(testCase.input.ruleId);

      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(testCase.input.ruleId);

      expect(mockPresenter.present).toHaveBeenCalledTimes(1);
      expect(mockPresenter.present).toHaveBeenCalledWith(expect.any(DeleteRuleOutputData));
      const outputData = (mockPresenter.present as ReturnType<typeof vi.fn>).mock
        .calls[0][0] as DeleteRuleOutputData;
      expect(outputData.deletedRuleId).toBe(testCase.input.ruleId);

      expect(mockTabsGateway.reloadMatchingTabs).toHaveBeenCalledTimes(1);
      const reloadedRule = (mockTabsGateway.reloadMatchingTabs as ReturnType<typeof vi.fn>).mock
        .calls[0][0] as RewriteRule;
      expect(reloadedRule.id).toBe(testCase.input.ruleId);

      expect(mockPresenter.presentError).not.toHaveBeenCalled();
    });
  });
});
