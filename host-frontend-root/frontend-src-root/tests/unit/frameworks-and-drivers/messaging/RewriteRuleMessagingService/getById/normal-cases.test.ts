/**
 * RewriteRuleMessagingService.getById - 正常系テスト
 *
 * 1. 存在するIDでルールを取得した場合、DTOが返される
 * 2. isActiveがtrueのルールを取得した場合、DTOのisActiveもtrue
 * 3. isActiveがfalseのルールを取得した場合、DTOのisActiveもfalse
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { RewriteRuleMessagingService } from 'src/frameworks-and-drivers/messaging/RewriteRuleMessagingService';

describe('RewriteRuleMessagingService.getById - 正常系', () => {
  let mockRepository: IRewriteRuleRepository;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: '存在するIDでルールを取得した場合、DTOが返される',
      input: {
        id: 1,
        rule: new RewriteRule(1, 'old', 'new', 'https://example.com', false, true),
      },
      expected: {
        id: 1,
        oldString: 'old',
        newString: 'new',
        urlPattern: 'https://example.com',
        isRegex: false,
        isActive: true,
      },
    },
    {
      description: 'isActiveがtrueのルールを取得した場合、DTOのisActiveもtrue',
      input: {
        id: 2,
        rule: new RewriteRule(2, 'search', 'replace', 'https://test.com', true, true),
      },
      expected: {
        id: 2,
        oldString: 'search',
        newString: 'replace',
        urlPattern: 'https://test.com',
        isRegex: true,
        isActive: true,
      },
    },
    {
      description: 'isActiveがfalseのルールを取得した場合、DTOのisActiveもfalse',
      input: {
        id: 3,
        rule: new RewriteRule(3, 'pattern', 'replacement', 'https://site.com', false, false),
      },
      expected: {
        id: 3,
        oldString: 'pattern',
        newString: 'replacement',
        urlPattern: 'https://site.com',
        isRegex: false,
        isActive: false,
      },
    },
  ];

  it.each(testCases)('$description', async ({ input, expected }) => {
    // Arrange
    mockRepository = {
      getById: vi.fn().mockResolvedValue(input.rule),
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      getRulesMatchingUrl: vi.fn(),
    };
    const service = new RewriteRuleMessagingService(mockRepository);

    // Act
    const result = await service.getById({ id: input.id });

    // Assert
    expect(result).toEqual(expected);
    expect(mockRepository.getById).toHaveBeenCalledWith(input.id);
  });
});
