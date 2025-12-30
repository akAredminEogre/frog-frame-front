/**
 * RewriteRuleMapper.delete - 正常系テスト
 * 1. ID=1: 最小IDで正しくDTOが構築され、messagingPort.delete()が1回呼ばれる
 * 2. ID=999: 大きなIDでも正しくDTOが構築される
 */
import { createMockRewriteRuleMessagingPort } from 'tests/unit/interface-adapters/ports/IRewriteRuleMessagingPort/mocks/createMockRewriteRuleMessagingPort';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

describe('RewriteRuleMapper.delete - 正常系', () => {
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
      description: 'ID=1: 最小IDで正しくDTOが構築され、messagingPort.delete()が1回呼ばれる',
      inputId: 1,
      expectedDto: { id: 1 },
    },
    {
      description: 'ID=999: 大きなIDでも正しくDTOが構築される',
      inputId: 999,
      expectedDto: { id: 999 },
    },
  ];

  testCases.forEach(({ description, inputId, expectedDto }) => {
    it(description, async () => {
      // Arrange
      (mockMessagingPort.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const mapper = new RewriteRuleMapper(mockMessagingPort);

      // Act
      await mapper.delete(inputId);

      // Assert
      expect(mockMessagingPort.delete).toHaveBeenCalledWith(expectedDto);
      expect(mockMessagingPort.delete).toHaveBeenCalledTimes(1);
    });
  });
});
