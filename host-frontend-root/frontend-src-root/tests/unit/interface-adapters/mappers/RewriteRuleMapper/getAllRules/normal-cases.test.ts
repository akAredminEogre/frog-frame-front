/**
 * RewriteRuleMapper.getAllRules - 正常系テスト
 * 1. 単一ルール: 1件のDTOをEntityに変換
 * 2. 空配列: 0件のDTOを空配列で返却
 * 3. 複数ルール: 複数件のDTOをEntity配列に変換
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

describe('RewriteRuleMapper.getAllRules - 正常系', () => {
  let mockMessagingPort: IRewriteRuleMessagingPort;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMessagingPort = {
      getAll: vi.fn(),
      getById: vi.fn(),
      updateActive: vi.fn(),
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: '単一ルール: 1件のDTOをEntityに変換',
      mockDtos: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://example.com', isRegex: false, isActive: true },
      ] as RewriteRuleDTO[],
      expectedLength: 1,
      expectedIds: [1],
    },
    {
      description: '空配列: 0件のDTOを空配列で返却',
      mockDtos: [] as RewriteRuleDTO[],
      expectedLength: 0,
      expectedIds: [],
    },
    {
      description: '複数ルール: 複数件のDTOをEntity配列に変換',
      mockDtos: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://example.com', isRegex: false, isActive: true },
        { id: 2, oldString: 'old2', newString: 'new2', urlPattern: 'https://other.com', isRegex: true, isActive: false },
      ] as RewriteRuleDTO[],
      expectedLength: 2,
      expectedIds: [1, 2],
    },
  ];

  testCases.forEach(({ description, mockDtos, expectedLength, expectedIds }) => {
    it(description, async () => {
      // Arrange
      (mockMessagingPort.getAll as ReturnType<typeof vi.fn>).mockResolvedValue(mockDtos);
      const mapper = new RewriteRuleMapper(mockMessagingPort);

      // Act
      const result = await mapper.getAllRules();

      // Assert
      expect(result).toHaveLength(expectedLength);
      result.forEach((rule, index) => {
        expect(rule).toBeInstanceOf(RewriteRule);
        expect(rule.id).toBe(expectedIds[index]);
      });
      expect(mockMessagingPort.getAll).toHaveBeenCalledTimes(1);
    });
  });
});
