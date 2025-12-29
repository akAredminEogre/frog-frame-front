/**
 * DeleteRulePresenter.present - 正常系テスト（コールバック呼び出し）
 * 1. deletedRuleIdでremoveRuleFromViewコールバックが呼び出される
 * 2. showErrorInViewは呼び出されない（コールバック分離）
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DeleteRuleOutputData } from 'src/application-business-rules/dto/output/DeleteRuleOutputData';
import { DeleteRulePresenter } from 'src/interface-adapters/presenters/DeleteRulePresenter';

describe('DeleteRulePresenter.present - 正常系（コールバック呼び出し）', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'deletedRuleId=1でremoveRuleFromViewコールバックが呼び出される',
      input: {
        deletedRuleId: 1,
      },
    },
    {
      description: 'deletedRuleId=999でremoveRuleFromViewコールバックが呼び出される',
      input: {
        deletedRuleId: 999,
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const outputData = new DeleteRuleOutputData(testCase.input.deletedRuleId);
      const mockRemoveRuleFromView = vi.fn();
      const mockShowErrorInView = vi.fn();

      const presenter = new DeleteRulePresenter(mockRemoveRuleFromView, mockShowErrorInView);
      presenter.present(outputData);

      expect(mockRemoveRuleFromView).toHaveBeenCalledTimes(1);
      expect(mockRemoveRuleFromView).toHaveBeenCalledWith(testCase.input.deletedRuleId);
      expect(mockShowErrorInView).not.toHaveBeenCalled();
    });
  });
});
