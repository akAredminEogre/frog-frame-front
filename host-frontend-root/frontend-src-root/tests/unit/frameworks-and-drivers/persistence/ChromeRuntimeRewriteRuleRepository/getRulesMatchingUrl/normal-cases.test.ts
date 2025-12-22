import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { ChromeRuntimeRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/ChromeRuntimeRewriteRuleRepository';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';

/**
 * ChromeRuntimeRewriteRuleRepository.getRulesMatchingUrl - 正常系テスト
 * 1. URLにマッチするルールのみを取得する
 * 2. マッチするルールがない場合は空のRewriteRulesを返す
 * 3. 空のurlPatternを持つルールは取得されない
 */
describe('ChromeRuntimeRewriteRuleRepository.getRulesMatchingUrl - 正常系', () => {
  let repository: ChromeRuntimeRewriteRuleRepository;
  let mockMapper: RewriteRuleMapper;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock mapper
    mockMapper = {
      getAllRules: vi.fn(),
      toEntity: vi.fn(),
      toDto: vi.fn(),
    } as unknown as RewriteRuleMapper;

    repository = new ChromeRuntimeRewriteRuleRepository(mockMapper);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'URLにマッチするルールのみを取得する',
      mockRules: [
        new RewriteRule(1, 'old1', 'new1', 'https://example.com', false, true),
        new RewriteRule(2, 'old2', 'new2', 'https://other.com', false, true),
      ],
      currentUrl: 'https://example.com/page',
      expectedLength: 1,
      expectedOldStrings: ['old1'],
    },
    {
      description: 'マッチするルールがない場合は空のRewriteRulesを返す',
      mockRules: [
        new RewriteRule(1, 'old1', 'new1', 'https://other.com', false, true),
      ],
      currentUrl: 'https://example.com/page',
      expectedLength: 0,
      expectedOldStrings: [],
    },
    {
      description: '空のurlPatternを持つルールは取得されない',
      mockRules: [
        new RewriteRule(1, 'old1', 'new1', '', false, true),
        new RewriteRule(2, 'old2', 'new2', 'https://example.com', false, true),
      ],
      currentUrl: 'https://example.com/page',
      expectedLength: 1,
      expectedOldStrings: ['old2'],
    },
  ];

  testCases.forEach(({ description, mockRules, currentUrl, expectedLength, expectedOldStrings }) => {
    it(description, async () => {
      // Arrange - Mapper.getAllRules() が RewriteRules を返すようにモック
      const rulesObject: Record<string, RewriteRule> = {};
      mockRules.forEach((rule) => {
        rulesObject[rule.id] = rule;
      });
      vi.mocked(mockMapper.getAllRules).mockResolvedValue(new RewriteRules(rulesObject));

      // Act
      const result = await repository.getRulesMatchingUrl(currentUrl);

      // Assert
      expect(result).toBeInstanceOf(RewriteRules);
      const rulesArray = result.toArray();
      expect(rulesArray).toHaveLength(expectedLength);
      expectedOldStrings.forEach((expectedOldString, index) => {
        expect(rulesArray[index].oldString).toBe(expectedOldString);
      });
    });
  });
});
