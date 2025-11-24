import { createMockRewriteRuleRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/createMockRewriteRuleRepository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ImportRulesFromJsonUseCase } from 'src/application/usecases/rule/ImportRulesFromJsonUseCase';
import { InvalidImportDataError } from 'src/domain/errors/InvalidImportDataError';

/**
 * ImportRulesFromJsonUseCase.execute - 異常系テスト
 * 1. 無効なJSON形式の場合エラーをthrowする
 * 2. versionフィールドが無い場合エラーをthrowする
 * 3. rulesフィールドが無い場合エラーをthrowする
 * 4. rulesが配列でない場合エラーをthrowする
 * 5. JSONがオブジェクトでない場合エラーをthrowする
 */
describe('ImportRulesFromJsonUseCase.execute - 異常系', () => {
  let useCase: ImportRulesFromJsonUseCase;
  let mockRepository: IRewriteRuleRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRewriteRuleRepository();
    vi.mocked(mockRepository.create).mockResolvedValue();
    useCase = new ImportRulesFromJsonUseCase(mockRepository);
  });

  it.each([
    {
      description: '無効なJSON形式の場合エラーをthrowする',
      jsonString: 'invalid json {',
      expectedErrorMessage: 'Invalid import data: Invalid JSON format',
    },
    {
      description: 'versionフィールドが無い場合エラーをthrowする',
      jsonString: JSON.stringify({
        exportDate: '2025-11-24T00:00:00.000Z',
        rules: [],
      }),
      expectedErrorMessage: 'Invalid import data: Missing required field: version',
    },
    {
      description: 'rulesフィールドが無い場合エラーをthrowする',
      jsonString: JSON.stringify({
        version: '1.0',
        exportDate: '2025-11-24T00:00:00.000Z',
      }),
      expectedErrorMessage: 'Invalid import data: Missing required field: rules',
    },
    {
      description: 'rulesが配列でない場合エラーをthrowする',
      jsonString: JSON.stringify({
        version: '1.0',
        exportDate: '2025-11-24T00:00:00.000Z',
        rules: 'not an array',
      }),
      expectedErrorMessage: 'Invalid import data: Field "rules" must be an array',
    },
    {
      description: 'JSONがオブジェクトでない場合エラーをthrowする',
      jsonString: JSON.stringify('just a string'),
      expectedErrorMessage: 'Invalid import data: JSON must be an object',
    },
    {
      description: 'JSONがnullの場合エラーをthrowする',
      jsonString: JSON.stringify(null),
      expectedErrorMessage: 'Invalid import data: JSON must be an object',
    },
  ])('$description', async ({ jsonString, expectedErrorMessage }) => {
    await expect(useCase.execute(jsonString)).rejects.toThrow(
      InvalidImportDataError
    );
    await expect(useCase.execute(jsonString)).rejects.toThrow(
      expectedErrorMessage
    );

    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});
