/**
 * RewriteRuleMapper.delete - 正常系テスト
 * 1. 単一ID指定: 指定したIDでmessagingPort.delete()が呼ばれる
 * 2. ID値の検証: DeleteRuleRequestDTOに正しいIDが設定される
 * 3. 呼び出し回数: messagingPort.delete()が1回だけ呼ばれる
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
      description: '単一ID指定: 指定したIDでmessagingPort.delete()が呼ばれる',
      inputId: 1,
      expectedDto: { id: 1 },
    },
    {
      description: 'ID値の検証: 大きなIDでも正しくDTOが構築される',
      inputId: 999,
      expectedDto: { id: 999 },
    },
    {
      description: 'ID値の検証: 最小ID（1）でも正しくDTOが構築される',
      inputId: 1,
      expectedDto: { id: 1 },
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

  it('呼び出し回数: messagingPort.delete()が1回だけ呼ばれる', async () => {
    // Arrange
    (mockMessagingPort.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
    const mapper = new RewriteRuleMapper(mockMessagingPort);
    const testId = 42;

    // Act
    await mapper.delete(testId);

    // Assert
    expect(mockMessagingPort.delete).toHaveBeenCalledTimes(1);
    expect(mockMessagingPort.delete).toHaveBeenCalledWith({ id: testId });
  });
});
