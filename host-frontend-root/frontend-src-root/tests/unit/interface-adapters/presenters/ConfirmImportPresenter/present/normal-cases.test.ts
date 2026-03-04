/**
 * ConfirmImportPresenter.present - 正常系テスト
 * 1. importedCountを含むメッセージでonSuccessコールバックが呼ばれる
 * 2. showErrorInViewは呼ばれない
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ImportRulesJsonOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonOutputData';
import { ConfirmImportPresenter } from 'src/interface-adapters/presenters/ConfirmImportPresenter';

describe('ConfirmImportPresenter.present - 正常系（コールバック呼び出し）', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'importedCount=3でonSuccessが件数を含むメッセージで呼ばれる',
      input: { importedCount: 3, previousCount: 5 },
      expectedMessageContains: '3',
    },
    {
      description: 'importedCount=1でonSuccessが件数を含むメッセージで呼ばれる',
      input: { importedCount: 1, previousCount: 0 },
      expectedMessageContains: '1',
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const outputData = new ImportRulesJsonOutputData(
        testCase.input.importedCount,
        testCase.input.previousCount
      );
      const mockOnSuccess = vi.fn();
      const mockShowErrorInView = vi.fn();

      const presenter = new ConfirmImportPresenter(mockOnSuccess, mockShowErrorInView);
      presenter.present(outputData);

      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
      expect(mockOnSuccess).toHaveBeenCalledWith(
        expect.stringContaining(testCase.expectedMessageContains)
      );
      expect(mockShowErrorInView).not.toHaveBeenCalled();
    });
  });
});
