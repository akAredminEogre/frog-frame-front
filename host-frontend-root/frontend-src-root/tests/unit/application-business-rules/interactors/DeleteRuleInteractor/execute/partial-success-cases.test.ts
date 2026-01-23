/**
 * DeleteRuleInteractor.execute - 部分的成功テスト
 * 1. tabsGateway.reloadMatchingTabsでエラーが発生した場合、presentが先に呼び出された後presentErrorが呼び出される
 */
import { createMockTabsGateway } from 'tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway';
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { createMockPresenter } from 'tests/unit/application-business-rules/interactors/DeleteRuleInteractor/mocks/createMockPresenter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DeleteRuleInputData } from 'src/application-business-rules/dto/input/DeleteRuleInputData';
import { DeleteRuleErrorOutputData } from 'src/application-business-rules/dto/output/DeleteRuleErrorOutputData';
import { DeleteRuleOutputData } from 'src/application-business-rules/dto/output/DeleteRuleOutputData';
import { DeleteRuleInteractor } from 'src/application-business-rules/interactors/DeleteRuleInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';
import { IDeleteRulePresenter } from 'src/application-business-rules/ports/output/IDeleteRulePresenter';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('DeleteRuleInteractor.execute - 部分的成功', () => {
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
      description:
        'tabsGateway.reloadMatchingTabsでエラーが発生した場合、presentが先に呼び出された後presentErrorが呼び出される',
      input: { ruleId: 1 },
      expectedErrorMessage: 'タブの再読み込みに失敗しました',
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      const rule = new RewriteRule(
        testCase.input.ruleId,
        'old',
        'new',
        'https://example.com',
        false,
        true
      );
      (mockRepository.getById as ReturnType<typeof vi.fn>).mockResolvedValue(rule);
      (mockRepository.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      (mockTabsGateway.reloadMatchingTabs as ReturnType<typeof vi.fn>).mockRejectedValue(
        new Error(testCase.expectedErrorMessage)
      );

      const interactor = new DeleteRuleInteractor(
        mockRepository,
        mockTabsGateway,
        mockPresenter
      );
      const inputData = new DeleteRuleInputData(testCase.input.ruleId);

      await interactor.execute(inputData);

      expect(mockPresenter.present).toHaveBeenCalledTimes(1);
      expect(mockPresenter.present).toHaveBeenCalledWith(expect.any(DeleteRuleOutputData));
      const outputData = (mockPresenter.present as ReturnType<typeof vi.fn>).mock
        .calls[0][0] as DeleteRuleOutputData;
      expect(outputData.deletedRuleId).toBe(testCase.input.ruleId);

      expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
      expect(mockPresenter.presentError).toHaveBeenCalledWith(
        expect.any(DeleteRuleErrorOutputData)
      );
      const errorData = (mockPresenter.presentError as ReturnType<typeof vi.fn>).mock
        .calls[0][0] as DeleteRuleErrorOutputData;
      expect(errorData.ruleId).toBe(testCase.input.ruleId);
      expect(errorData.message).toBe(testCase.expectedErrorMessage);

      // 呼び出し順序の検証: presentがpresentErrorより先に呼ばれること
      const presentOrder = (mockPresenter.present as ReturnType<typeof vi.fn>).mock
        .invocationCallOrder[0];
      const presentErrorOrder = (mockPresenter.presentError as ReturnType<typeof vi.fn>).mock
        .invocationCallOrder[0];
      expect(presentOrder).toBeLessThan(presentErrorOrder);
    });
  });
});
