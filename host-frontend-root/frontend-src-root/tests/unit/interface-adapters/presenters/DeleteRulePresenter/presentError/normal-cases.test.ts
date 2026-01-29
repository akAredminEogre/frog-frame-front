/**
 * DeleteRulePresenter.presentError - 正常系テスト（コールバック呼び出し）
 *
 * - エラーデータでshowErrorInViewコールバックが呼び出され、フォーマット済みメッセージが渡される
 * - removeRuleFromViewは呼び出されない（コールバック分離）
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

  type PresentErrorTestCase = {
    description: string;
    input: {
      ruleId: number;
      error: Error | string;
    };
    expectedMessage: string;
  };

  const testCases: Array<PresentErrorTestCase> = [
    {
      description: 'Errorオブジェクト由来のエラーでコールバックが呼び出され、フォーマット済みメッセージが渡される',
      input: {
        ruleId: 1,
        error: new Error('削除に失敗しました'),
      },
      expectedMessage: 'ルール 1 の削除処理中にエラーが発生しました: 削除に失敗しました',
    },
    {
      description: '文字列由来のエラーでコールバックが呼び出され、フォーマット済みメッセージが渡される',
      input: {
        ruleId: 2,
        error: '文字列エラー',
      },
      expectedMessage: 'ルール 2 の削除処理中にエラーが発生しました: 文字列エラー',
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
      expect(mockShowErrorInView).toHaveBeenCalledWith(testCase.expectedMessage);
      expect(mockRemoveRuleFromView).not.toHaveBeenCalled();
    });
  });
});
