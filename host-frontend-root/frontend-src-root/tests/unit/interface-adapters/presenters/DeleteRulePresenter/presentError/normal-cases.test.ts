/**
 * DeleteRulePresenter.presentError - 正常系テスト（コールバック呼び出し）
 * 1. エラーデータでshowErrorInViewコールバックが呼び出され、ruleIdとmessageが正しく渡される
 * 2. removeRuleFromViewは呼び出されない（コールバック分離）
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DeleteRuleErrorOutputData } from 'src/application-business-rules/dto/output/DeleteRuleErrorOutputData';
import { DeleteRulePresenter } from 'src/interface-adapters/presenters/DeleteRulePresenter';

describe('DeleteRulePresenter.presentError - 正常系（コールバック呼び出し）', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'Errorオブジェクト由来のエラーでコールバックが呼び出され、ruleIdとmessageが正しく渡される',
      input: {
        ruleId: 1,
        error: new Error('削除に失敗しました'),
      },
      expected: {
        ruleId: 1,
        message: '削除に失敗しました',
      },
    },
    {
      description: '文字列由来のエラーでコールバックが呼び出され、ruleIdとmessageが正しく渡される',
      input: {
        ruleId: 2,
        error: '文字列エラー',
      },
      expected: {
        ruleId: 2,
        message: '文字列エラー',
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const mockRemoveRuleFromView = vi.fn();
      const mockShowErrorInView = vi.fn();

      const presenter = new DeleteRulePresenter(mockRemoveRuleFromView, mockShowErrorInView);
      const errorData = new DeleteRuleErrorOutputData(
        testCase.input.ruleId,
        testCase.input.error
      );

      presenter.presentError(errorData);

      expect(mockShowErrorInView).toHaveBeenCalledTimes(1);
      expect(mockShowErrorInView).toHaveBeenCalledWith(
        testCase.expected.ruleId,
        testCase.expected.message
      );
      expect(mockRemoveRuleFromView).not.toHaveBeenCalled();
    });
  });
});
