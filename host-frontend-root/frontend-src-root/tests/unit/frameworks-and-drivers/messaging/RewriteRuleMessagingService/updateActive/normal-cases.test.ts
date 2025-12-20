/**
 * RewriteRuleMessagingService.updateActive - 正常系テスト
 *
 * 1. isActiveをtrueに更新した場合、withActive(true)が呼ばれてupdateが実行される
 * 2. isActiveをfalseに更新した場合、withActive(false)が呼ばれてupdateが実行される
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { RewriteRuleMessagingService } from 'src/frameworks-and-drivers/messaging/RewriteRuleMessagingService';

describe('RewriteRuleMessagingService.updateActive - 正常系', () => {
  let mockRepository: IRewriteRuleRepository;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'isActiveをtrueに更新した場合、withActive(true)が呼ばれてupdateが実行される',
      input: {
        id: 1,
        isActive: true,
        existingRule: new RewriteRule(1, 'old', 'new', 'https://example.com', false, false),
      },
      expected: {
        updatedIsActive: true,
      },
    },
    {
      description: 'isActiveをfalseに更新した場合、withActive(false)が呼ばれてupdateが実行される',
      input: {
        id: 2,
        isActive: false,
        existingRule: new RewriteRule(2, 'search', 'replace', 'https://test.com', true, true),
      },
      expected: {
        updatedIsActive: false,
      },
    },
  ];

  it.each(testCases)('$description', async ({ input, expected }) => {
    // Arrange
    const mockUpdate = vi.fn().mockResolvedValue(undefined);
    mockRepository = {
      getById: vi.fn().mockResolvedValue(input.existingRule),
      getAll: vi.fn(),
      create: vi.fn(),
      update: mockUpdate,
      getRulesMatchingUrl: vi.fn(),
    };
    const service = new RewriteRuleMessagingService(mockRepository);

    // Act
    await service.updateActive({ id: input.id, isActive: input.isActive });

    // Assert
    expect(mockRepository.getById).toHaveBeenCalledWith(input.id);
    expect(mockUpdate).toHaveBeenCalledTimes(1);

    // updateに渡されたルールのisActiveが期待値と一致することを確認
    const updatedRule = mockUpdate.mock.calls[0][0] as RewriteRule;
    expect(updatedRule.isActive).toBe(expected.updatedIsActive);
    expect(updatedRule.id).toBe(input.id);
  });
});
