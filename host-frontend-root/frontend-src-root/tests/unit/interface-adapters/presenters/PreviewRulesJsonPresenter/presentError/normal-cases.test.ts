/**
 * PreviewRulesJsonPresenter.presentError - 正常系テスト
 * 1. showErrorInViewコールバックがエラーメッセージで呼ばれる
 * 2. onPreviewは呼ばれない
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { InvalidJsonImportError, StorageImportError } from 'src/application-business-rules/errors/ImportRulesJsonErrors';
import { PreviewRulesJsonPresenter } from 'src/interface-adapters/presenters/PreviewRulesJsonPresenter';

describe('PreviewRulesJsonPresenter.presentError - 正常系（コールバック呼び出し）', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'parseエラーでshowErrorInViewが呼ばれる',
      errorData: new ImportRulesJsonErrorOutputData(new InvalidJsonImportError(), 'parse'),
    },
    {
      description: 'storageエラーでshowErrorInViewが呼ばれる',
      errorData: new ImportRulesJsonErrorOutputData(new StorageImportError(new Error('IO error')), 'storage'),
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const mockOnPreview = vi.fn();
      const mockShowErrorInView = vi.fn();

      const presenter = new PreviewRulesJsonPresenter(mockOnPreview, mockShowErrorInView);
      presenter.presentError(testCase.errorData);

      expect(mockShowErrorInView).toHaveBeenCalledTimes(1);
      expect(mockShowErrorInView).toHaveBeenCalledWith(testCase.errorData.message);
      expect(mockOnPreview).not.toHaveBeenCalled();
    });
  });
});
