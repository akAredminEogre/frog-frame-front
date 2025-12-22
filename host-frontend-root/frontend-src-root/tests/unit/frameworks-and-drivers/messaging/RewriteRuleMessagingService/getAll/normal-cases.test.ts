/**
 * RewriteRuleMessagingService.getAll - 正常系テスト
 * 1. 単一ルール: 1件のDTOを返却
 * 2. 空配列: 0件のDTOを空配列で返却
 * 3. 複数ルール: 複数件のDTOを配列で返却
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { RewriteRuleMessagingService } from 'src/frameworks-and-drivers/messaging/RewriteRuleMessagingService';
import { getRewriteRuleProxyService, IRewriteRuleProxyService } from 'src/frameworks-and-drivers/messaging/RewriteRuleProxyService';

// モック設定
vi.mock('src/frameworks-and-drivers/messaging/RewriteRuleProxyService', () => ({
  getRewriteRuleProxyService: vi.fn(),
}));

describe('RewriteRuleMessagingService.getAll - 正常系', () => {
  let mockProxyService: IRewriteRuleProxyService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockProxyService = {
      getAllRules: vi.fn(),
    };
    (getRewriteRuleProxyService as ReturnType<typeof vi.fn>).mockReturnValue(mockProxyService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: '単一ルール: 1件のDTOを返却',
      mockDtos: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://example.com', isRegex: false, isActive: true },
      ] as RewriteRuleDTO[],
      expectedLength: 1,
    },
    {
      description: '空配列: 0件のDTOを空配列で返却',
      mockDtos: [] as RewriteRuleDTO[],
      expectedLength: 0,
    },
    {
      description: '複数ルール: 複数件のDTOを配列で返却',
      mockDtos: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://example.com', isRegex: false, isActive: true },
        { id: 2, oldString: 'old2', newString: 'new2', urlPattern: 'https://other.com', isRegex: true, isActive: false },
        { id: 3, oldString: 'old3', newString: 'new3', urlPattern: '*', isRegex: false, isActive: true },
      ] as RewriteRuleDTO[],
      expectedLength: 3,
    },
  ];

  testCases.forEach(({ description, mockDtos, expectedLength }) => {
    it(description, async () => {
      // Arrange
      (mockProxyService.getAllRules as ReturnType<typeof vi.fn>).mockResolvedValue(mockDtos);
      const service = new RewriteRuleMessagingService();

      // Act
      const result = await service.getAll();

      // Assert
      expect(result).toHaveLength(expectedLength);
      expect(result).toEqual(mockDtos);
      expect(mockProxyService.getAllRules).toHaveBeenCalledTimes(1);
    });
  });
});
