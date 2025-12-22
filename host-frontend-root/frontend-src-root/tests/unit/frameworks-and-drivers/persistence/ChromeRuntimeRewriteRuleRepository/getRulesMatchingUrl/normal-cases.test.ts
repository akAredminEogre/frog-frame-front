import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { ChromeRuntimeRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/ChromeRuntimeRewriteRuleRepository';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';

// 動的importをモック
vi.mock('src/frameworks-and-drivers/messaging/RewriteRuleProxyService', () => ({
  getRewriteRuleProxyService: vi.fn(),
}));

/**
 * ChromeRuntimeRewriteRuleRepository.getRulesMatchingUrl - 正常系テスト
 * 1. URLにマッチするルールのみを取得する
 * 2. マッチするルールがない場合は空のRewriteRulesを返す
 * 3. 空のurlPatternを持つルールは取得されない
 */
describe('ChromeRuntimeRewriteRuleRepository.getRulesMatchingUrl - 正常系', () => {
  let repository: ChromeRuntimeRewriteRuleRepository;
  let mockProxyService: { getAll: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.clearAllMocks();

    // Create mock proxy service
    mockProxyService = {
      getAll: vi.fn(),
    };

    // 動的importされるモジュールのモックを設定
    const { getRewriteRuleProxyService } = await import(
      'src/frameworks-and-drivers/messaging/RewriteRuleProxyService'
    );
    vi.mocked(getRewriteRuleProxyService).mockReturnValue(mockProxyService as any);

    repository = new ChromeRuntimeRewriteRuleRepository();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'URLにマッチするルールのみを取得する',
      mockDtos: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://example.com', isRegex: false, isActive: true },
        { id: 2, oldString: 'old2', newString: 'new2', urlPattern: 'https://other.com', isRegex: false, isActive: true },
      ] as RewriteRuleDTO[],
      currentUrl: 'https://example.com/page',
      expectedLength: 1,
      expectedOldStrings: ['old1'],
    },
    {
      description: 'マッチするルールがない場合は空のRewriteRulesを返す',
      mockDtos: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://other.com', isRegex: false, isActive: true },
      ] as RewriteRuleDTO[],
      currentUrl: 'https://example.com/page',
      expectedLength: 0,
      expectedOldStrings: [],
    },
    {
      description: '空のurlPatternを持つルールは取得されない',
      mockDtos: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: '', isRegex: false, isActive: true },
        { id: 2, oldString: 'old2', newString: 'new2', urlPattern: 'https://example.com', isRegex: false, isActive: true },
      ] as RewriteRuleDTO[],
      currentUrl: 'https://example.com/page',
      expectedLength: 1,
      expectedOldStrings: ['old2'],
    },
  ];

  testCases.forEach(({ description, mockDtos, currentUrl, expectedLength, expectedOldStrings }) => {
    it(description, async () => {
      // Arrange - proxy-service.getAll() がDTOを返すようにモック
      mockProxyService.getAll.mockResolvedValue(mockDtos);

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
