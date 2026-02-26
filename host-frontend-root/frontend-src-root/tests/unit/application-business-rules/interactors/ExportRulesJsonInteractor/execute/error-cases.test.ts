/**
 * ExportRulesJsonInteractor.execute - 異常系テスト
 * 1. repository.getAll()がエラーを投げた場合、presentError()を呼び出す
 */
import { createMockRewriteRuleRepository as createMockRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';
import { createMockPresenter } from 'tests/unit/application-business-rules/interactors/ExportRulesJsonInteractor/mocks/createMockPresenter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ExportRulesJsonInputData } from 'src/application-business-rules/dto/input/ExportRulesJsonInputData';
import { ExportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ExportRulesJsonErrorOutputData';
import { ExportRulesJsonInteractor } from 'src/application-business-rules/interactors/ExportRulesJsonInteractor';
import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { IExportRulesJsonPresenter } from 'src/application-business-rules/ports/output/IExportRulesJsonPresenter';

describe('ExportRulesJsonInteractor.execute - 異常系', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockPresenter: IExportRulesJsonPresenter;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRepository();
    mockPresenter = createMockPresenter();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases: {
    description: string;
    errorMessage: string;
    setupMock: (repository: IRewriteRuleRepository) => void;
  }[] = [
    {
      description: 'repository.getAll()がエラーを投げた場合、presentError()を呼び出す',
      errorMessage: 'ルール一覧の取得に失敗しました',
      setupMock: (repository: IRewriteRuleRepository) => {
        vi.mocked(repository.getAll).mockRejectedValue(
          new Error('ルール一覧の取得に失敗しました')
        );
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      testCase.setupMock(mockRepository);

      const interactor = new ExportRulesJsonInteractor(mockRepository, mockPresenter);
      const inputData = new ExportRulesJsonInputData();

      await interactor.execute(inputData);

      expect(mockPresenter.present).not.toHaveBeenCalled();
      expect(mockPresenter.presentError).toHaveBeenCalledTimes(1);
      expect(mockPresenter.presentError).toHaveBeenCalledWith(
        expect.any(ExportRulesJsonErrorOutputData)
      );

      const errorData = vi.mocked(mockPresenter.presentError).mock.calls[0][0];
      expect(errorData.message).toBe(testCase.errorMessage);
    });
  });
});
