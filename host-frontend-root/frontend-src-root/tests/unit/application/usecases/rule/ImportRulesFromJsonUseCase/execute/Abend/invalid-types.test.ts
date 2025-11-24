import { createMockRewriteRuleRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/createMockRewriteRuleRepository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ImportRulesFromJsonUseCase } from 'src/application/usecases/rule/ImportRulesFromJsonUseCase';
import { InvalidImportDataError } from 'src/domain/errors/InvalidImportDataError';

/**
 * ImportRulesFromJsonUseCase.execute - フィールドの型不正テスト
 * 1. oldStringが文字列でない場合エラーをthrowする
 * 2. newStringが文字列でない場合エラーをthrowする
 * 3. urlPatternが文字列でない場合エラーをthrowする
 * 4. isRegexがbooleanでない場合エラーをthrowする
 * 5. isActiveがbooleanでない場合エラーをthrowする
 */
describe('ImportRulesFromJsonUseCase.execute - フィールドの型不正', () => {
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
      description: 'oldStringが文字列でない場合エラーをthrowする',
      rule: {
        oldString: 123,
        newString: 'new',
        urlPattern: 'https://example.com',
        isRegex: false,
        isActive: true,
      },
      expectedErrorMessage:
        'Invalid import data: Rule at index 0: Field "oldString" must be a string',
    },
    {
      description: 'newStringが文字列でない場合エラーをthrowする',
      rule: {
        oldString: 'old',
        newString: 456,
        urlPattern: 'https://example.com',
        isRegex: false,
        isActive: true,
      },
      expectedErrorMessage:
        'Invalid import data: Rule at index 0: Field "newString" must be a string',
    },
    {
      description: 'urlPatternが文字列でない場合エラーをthrowする',
      rule: {
        oldString: 'old',
        newString: 'new',
        urlPattern: 789,
        isRegex: false,
        isActive: true,
      },
      expectedErrorMessage:
        'Invalid import data: Rule at index 0: Field "urlPattern" must be a string',
    },
    {
      description: 'isRegexがbooleanでない場合エラーをthrowする',
      rule: {
        oldString: 'old',
        newString: 'new',
        urlPattern: 'https://example.com',
        isRegex: 'true',
        isActive: true,
      },
      expectedErrorMessage:
        'Invalid import data: Rule at index 0: Field "isRegex" must be a boolean',
    },
    {
      description: 'isActiveがbooleanでない場合エラーをthrowする',
      rule: {
        oldString: 'old',
        newString: 'new',
        urlPattern: 'https://example.com',
        isRegex: false,
        isActive: 'true',
      },
      expectedErrorMessage:
        'Invalid import data: Rule at index 0: Field "isActive" must be a boolean',
    },
  ])('$description', async ({ rule, expectedErrorMessage }) => {
    const jsonString = JSON.stringify({
      version: '1.0',
      exportDate: '2025-11-24T00:00:00.000Z',
      rules: [rule],
    });

    await expect(useCase.execute(jsonString)).rejects.toThrow(
      InvalidImportDataError
    );
    await expect(useCase.execute(jsonString)).rejects.toThrow(
      expectedErrorMessage
    );

    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});
