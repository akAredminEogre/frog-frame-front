/**
 * ConfirmImportPresenter.presentError - 正常系テスト
 * 1. showErrorInViewコールバックがエラーメッセージで呼ばれる
 * 2. onSuccessは呼ばれない
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { StorageImportError } from 'src/application-business-rules/errors/ImportRulesJsonErrors';
import { ConfirmImportPresenter } from 'src/interface-adapters/presenters/ConfirmImportPresenter';

describe('ConfirmImportPresenter.presentError - 正常系（コールバック呼び出し）', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'storageエラーでshowErrorInViewが呼ばれる',
      errorData: new ImportRulesJsonErrorOutputData(
        new StorageImportError(new Error('replaceAll失敗')),
        'storage'
      ),
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const mockOnSuccess = vi.fn();
      const mockShowErrorInView = vi.fn();

      const presenter = new ConfirmImportPresenter(mockOnSuccess, mockShowErrorInView);
      presenter.presentError(testCase.errorData);

      expect(mockShowErrorInView).toHaveBeenCalledTimes(1);
      expect(mockShowErrorInView).toHaveBeenCalledWith(testCase.errorData.message);
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});
