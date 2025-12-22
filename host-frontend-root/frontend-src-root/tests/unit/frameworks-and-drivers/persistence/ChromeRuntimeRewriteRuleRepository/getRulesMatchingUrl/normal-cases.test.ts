import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { ChromeRuntimeRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/ChromeRuntimeRewriteRuleRepository';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

import { createMockRewriteRuleMessagingPort } from 'tests/unit/interface-adapters/ports/IRewriteRuleMessagingPort/mocks/createMockRewriteRuleMessagingPort';

/**
 * ChromeRuntimeRewriteRuleRepository.getRulesMatchingUrl - 正常系テスト
 * 1. URLにマッチするルールのみを取得する
 * 2. マッチするルールがない場合は空のRewriteRulesを返す
 * 3. 空のurlPatternを持つルールは取得されない
 *
 * ADR-002, ADR-003に準拠: IRewriteRuleMessagingPort → Mapper → Repository
 */
describe('ChromeRuntimeRewriteRuleRepository.getRulesMatchingUrl - 正常系', () => {
  let repository: ChromeRuntimeRewriteRuleRepository;
  let mockMessagingPort: IRewriteRuleMessagingPort;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMessagingPort = createMockRewriteRuleMessagingPort();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'URLにマッチするルールのみを取得する',
      mockRules: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://example.com', isRegex: false, isActive: true },
        { id: 2, oldString: 'old2', newString: 'new2', urlPattern: 'https://other.com', isRegex: false, isActive: true },
      ],
      currentUrl: 'https://example.com/page',
      expectedLength: 1,
      expectedOldStrings: ['old1'],
    },
    {
      description: 'マッチするルールがない場合は空のRewriteRulesを返す',
      mockRules: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://other.com', isRegex: false, isActive: true },
      ],
      currentUrl: 'https://example.com/page',
      expectedLength: 0,
      expectedOldStrings: [],
    },
    {
      description: '空のurlPatternを持つルールは取得されない',
      mockRules: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: '', isRegex: false, isActive: true },
        { id: 2, oldString: 'old2', newString: 'new2', urlPattern: 'https://example.com', isRegex: false, isActive: true },
      ],
      currentUrl: 'https://example.com/page',
      expectedLength: 1,
      expectedOldStrings: ['old2'],
    },
  ];

  testCases.forEach(({ description, mockRules, currentUrl, expectedLength, expectedOldStrings }) => {
    it(description, async () => {
      // Arrange - IRewriteRuleMessagingPort の getAll をモック
      (mockMessagingPort.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockRules as RewriteRuleDTO[]);
      const mapper = new RewriteRuleMapper(mockMessagingPort);
      repository = new ChromeRuntimeRewriteRuleRepository(mapper);

      // Act
      const result = await repository.getRulesMatchingUrl(currentUrl);

      // Assert
      expect(result).toBeInstanceOf(RewriteRules);
      const rulesArray = result.toArray();
      expect(rulesArray).toHaveLength(expectedLength);
      expectedOldStrings.forEach((expectedOldString, index) => {
        expect(rulesArray[index].oldString).toBe(expectedOldString);
      });

      // IRewriteRuleMessagingPort の getAll が呼ばれたことを確認
      expect(mockMessagingPort.getAll).toHaveBeenCalled();
    });
  });
});
