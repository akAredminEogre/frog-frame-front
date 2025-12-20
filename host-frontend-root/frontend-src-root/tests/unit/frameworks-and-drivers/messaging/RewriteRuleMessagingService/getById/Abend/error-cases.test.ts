/**
 * RewriteRuleMessagingService.getById - エラーケーステスト
 *
 * 1. 存在しないIDを指定した場合、RewriteRuleNotFoundErrorがスローされる
 * 2. リポジトリがエラーをスローした場合、そのエラーが伝播する
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRuleNotFoundError } from 'src/domain/errors/RewriteRuleNotFoundError';
import { RewriteRuleMessagingService } from 'src/frameworks-and-drivers/messaging/RewriteRuleMessagingService';

describe('RewriteRuleMessagingService.getById - エラーケース', () => {
  let mockRepository: IRewriteRuleRepository;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: '存在しないIDを指定した場合、RewriteRuleNotFoundErrorがスローされる',
      input: {
        id: 999,
      },
      repositoryBehavior: {
        error: new RewriteRuleNotFoundError(999),
      },
      expected: {
        errorType: RewriteRuleNotFoundError,
        errorMessage: 'Rewrite rule with id "999" not found',
      },
    },
    {
      description: 'リポジトリがエラーをスローした場合、そのエラーが伝播する',
      input: {
        id: 1,
      },
      repositoryBehavior: {
        error: new Error('Database connection failed'),
      },
      expected: {
        errorType: Error,
        errorMessage: 'Database connection failed',
      },
    },
  ];

  it.each(testCases)('$description', async ({ input, repositoryBehavior, expected }) => {
    // Arrange
    mockRepository = {
      getById: vi.fn().mockRejectedValue(repositoryBehavior.error),
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      getRulesMatchingUrl: vi.fn(),
    };
    const service = new RewriteRuleMessagingService(mockRepository);

    // Act & Assert
    await expect(service.getById({ id: input.id })).rejects.toThrow(expected.errorType);
    await expect(service.getById({ id: input.id })).rejects.toThrow(expected.errorMessage);
    expect(mockRepository.getById).toHaveBeenCalledWith(input.id);
  });
});
