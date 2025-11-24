import { createMockRewriteRuleRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/createMockRewriteRuleRepository';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ImportRulesFromJsonUseCase } from 'src/application/usecases/rule/ImportRulesFromJsonUseCase';
import { InvalidImportDataError } from 'src/domain/errors/InvalidImportDataError';

/**
 * ImportRulesFromJsonUseCase.execute - ルールの必須フィールド欠如テスト
 * 1. oldStringフィールドが無い場合エラーをthrowする
 * 2. newStringフィールドが無い場合エラーをthrowする
 * 3. urlPatternフィールドが無い場合エラーをthrowする
 * 4. isRegexフィールドが無い場合エラーをthrowする
 * 5. isActiveフィールドが無い場合エラーをthrowする
 * 6. ルールがオブジェクトでない場合エラーをthrowする
 */
describe('ImportRulesFromJsonUseCase.execute - ルールの必須フィールド欠如', () => {
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
      description: 'oldStringフィールドが無い場合エラーをthrowする',
      rule: {
        newString: 'new',
        urlPattern: 'https://example.com',
        isRegex: false,
        isActive: true,
      },
      expectedErrorMessage:
        'Invalid import data: Rule at index 0: Missing required field "oldString"',
    },
    {
      description: 'newStringフィールドが無い場合エラーをthrowする',
      rule: {
        oldString: 'old',
        urlPattern: 'https://example.com',
        isRegex: false,
        isActive: true,
      },
      expectedErrorMessage:
        'Invalid import data: Rule at index 0: Missing required field "newString"',
    },
    {
      description: 'urlPatternフィールドが無い場合エラーをthrowする',
      rule: {
        oldString: 'old',
        newString: 'new',
        isRegex: false,
        isActive: true,
      },
      expectedErrorMessage:
        'Invalid import data: Rule at index 0: Missing required field "urlPattern"',
    },
    {
      description: 'isRegexフィールドが無い場合エラーをthrowする',
      rule: {
        oldString: 'old',
        newString: 'new',
        urlPattern: 'https://example.com',
        isActive: true,
      },
      expectedErrorMessage:
        'Invalid import data: Rule at index 0: Missing required field "isRegex"',
    },
    {
      description: 'isActiveフィールドが無い場合エラーをthrowする',
      rule: {
        oldString: 'old',
        newString: 'new',
        urlPattern: 'https://example.com',
        isRegex: false,
      },
      expectedErrorMessage:
        'Invalid import data: Rule at index 0: Missing required field "isActive"',
    },
    {
      description: 'ルールがオブジェクトでない場合エラーをthrowする',
      rule: 'not an object',
      expectedErrorMessage:
        'Invalid import data: Rule at index 0 must be an object',
    },
    {
      description: 'ルールがnullの場合エラーをthrowする',
      rule: null,
      expectedErrorMessage:
        'Invalid import data: Rule at index 0 must be an object',
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
