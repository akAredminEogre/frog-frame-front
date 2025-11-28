import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { ChromeRuntimeRewriteRuleRepository } from 'src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository';

/**
 * ChromeRuntimeRewriteRuleRepository.getRulesMatchingUrl - 正常系テスト
 * 1. URLにマッチするルールのみを取得する
 * 2. マッチするルールがない場合は空のRewriteRulesを返す
 * 3. 空のurlPatternを持つルールは取得されない
 */
describe('ChromeRuntimeRewriteRuleRepository.getRulesMatchingUrl - 正常系', () => {
  let repository: ChromeRuntimeRewriteRuleRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock chrome.runtime.sendMessage
    global.chrome = {
      runtime: {
        sendMessage: vi.fn(),
      },
    } as any;

    repository = new ChromeRuntimeRewriteRuleRepository();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'URLにマッチするルールのみを取得する',
      mockRules: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://example.com', isRegex: false },
        { id: 2, oldString: 'old2', newString: 'new2', urlPattern: 'https://other.com', isRegex: false },
      ],
      currentUrl: 'https://example.com/page',
      expectedLength: 1,
      expectedOldStrings: ['old1'],
    },
    {
      description: 'マッチするルールがない場合は空のRewriteRulesを返す',
      mockRules: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://other.com', isRegex: false },
      ],
      currentUrl: 'https://example.com/page',
      expectedLength: 0,
      expectedOldStrings: [],
    },
    {
      description: '空のurlPatternを持つルールは取得されない',
      mockRules: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: '', isRegex: false },
        { id: 2, oldString: 'old2', newString: 'new2', urlPattern: 'https://example.com', isRegex: false },
      ],
      currentUrl: 'https://example.com/page',
      expectedLength: 1,
      expectedOldStrings: ['old2'],
    },
  ];

  testCases.forEach(({ description, mockRules, currentUrl, expectedLength, expectedOldStrings }) => {
    it(description, async () => {
      // Arrange
      vi.mocked(chrome.runtime.sendMessage).mockResolvedValue({
        success: true,
        rules: mockRules,
      });

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
