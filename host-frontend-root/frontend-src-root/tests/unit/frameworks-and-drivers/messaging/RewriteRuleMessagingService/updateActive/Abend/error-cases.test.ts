/**
 * RewriteRuleMessagingService.updateActive - エラーケーステスト
 *
 * 1. 存在しないIDを指定した場合、RewriteRuleNotFoundErrorがスローされる
 * 2. リポジトリのgetByIdがエラーをスローした場合、そのエラーが伝播する
 * 3. リポジトリのupdateがエラーをスローした場合、そのエラーが伝播する
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRuleNotFoundError } from 'src/domain/errors/RewriteRuleNotFoundError';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { RewriteRuleMessagingService } from 'src/frameworks-and-drivers/messaging/RewriteRuleMessagingService';

describe('RewriteRuleMessagingService.updateActive - エラーケース', () => {
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
        isActive: true,
      },
      repositoryBehavior: {
        getByIdError: new RewriteRuleNotFoundError(999),
        updateError: null,
        existingRule: null,
      },
      expected: {
        errorType: RewriteRuleNotFoundError,
        errorMessage: 'Rewrite rule with id "999" not found',
      },
    },
    {
      description: 'リポジトリのgetByIdがエラーをスローした場合、そのエラーが伝播する',
      input: {
        id: 1,
        isActive: true,
      },
      repositoryBehavior: {
        getByIdError: new Error('Database connection failed'),
        updateError: null,
        existingRule: null,
      },
      expected: {
        errorType: Error,
        errorMessage: 'Database connection failed',
      },
    },
    {
      description: 'リポジトリのupdateがエラーをスローした場合、そのエラーが伝播する',
      input: {
        id: 1,
        isActive: true,
      },
      repositoryBehavior: {
        getByIdError: null,
        updateError: new Error('Update failed'),
        existingRule: new RewriteRule(1, 'old', 'new', 'https://example.com', false, false),
      },
      expected: {
        errorType: Error,
        errorMessage: 'Update failed',
      },
    },
  ];

  it.each(testCases)('$description', async ({ input, repositoryBehavior, expected }) => {
    // Arrange
    const getByIdMock = repositoryBehavior.getByIdError
      ? vi.fn().mockRejectedValue(repositoryBehavior.getByIdError)
      : vi.fn().mockResolvedValue(repositoryBehavior.existingRule);
    const updateMock = repositoryBehavior.updateError
      ? vi.fn().mockRejectedValue(repositoryBehavior.updateError)
      : vi.fn().mockResolvedValue(undefined);

    mockRepository = {
      getById: getByIdMock,
      getAll: vi.fn(),
      create: vi.fn(),
      update: updateMock,
      getRulesMatchingUrl: vi.fn(),
    };
    const service = new RewriteRuleMessagingService(mockRepository);

    // Act & Assert
    await expect(service.updateActive({ id: input.id, isActive: input.isActive })).rejects.toThrow(
      expected.errorType
    );
    await expect(service.updateActive({ id: input.id, isActive: input.isActive })).rejects.toThrow(
      expected.errorMessage
    );
  });
});
