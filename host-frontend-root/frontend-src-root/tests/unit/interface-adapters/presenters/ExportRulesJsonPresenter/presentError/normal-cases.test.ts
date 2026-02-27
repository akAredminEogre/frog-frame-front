/**
 * ExportRulesJsonPresenter.presentError - 正常系テスト（コールバック呼び出し）
 *
 * 1. Errorオブジェクト由来のエラーでコールバックが呼び出され、フォーマット済みメッセージが渡される
 * 2. 文字列由来のエラーでコールバックが呼び出され、フォーマット済みメッセージが渡される
 * - triggerDownloadは呼び出されない（コールバック分離）
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ExportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ExportRulesJsonErrorOutputData';
import { ExportRulesJsonPresenter } from 'src/interface-adapters/presenters/ExportRulesJsonPresenter';

describe('ExportRulesJsonPresenter.presentError - 正常系（コールバック呼び出し）', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  type PresentErrorTestCase = {
    description: string;
    input: {
      error: Error | string;
    };
    expectedMessage: string;
  };

  const testCases: Array<PresentErrorTestCase> = [
    {
      description: 'Errorオブジェクト由来のエラーでコールバックが呼び出され、フォーマット済みメッセージが渡される',
      input: {
        error: new Error('ルール取得に失敗しました'),
      },
      expectedMessage: 'エクスポート処理中にエラーが発生しました: ルール取得に失敗しました',
    },
    {
      description: '文字列由来のエラーでコールバックが呼び出され、フォーマット済みメッセージが渡される',
      input: {
        error: '文字列エラー',
      },
      expectedMessage: 'エクスポート処理中にエラーが発生しました: 文字列エラー',
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const mockTriggerDownload = vi.fn();
      const mockShowErrorInView = vi.fn();

      const presenter = new ExportRulesJsonPresenter(mockTriggerDownload, mockShowErrorInView);
      const errorData = new ExportRulesJsonErrorOutputData(testCase.input.error);

      presenter.presentError(errorData);

      expect(mockShowErrorInView).toHaveBeenCalledTimes(1);
      expect(mockShowErrorInView).toHaveBeenCalledWith(testCase.expectedMessage);
      expect(mockTriggerDownload).not.toHaveBeenCalled();
    });
  });
});
