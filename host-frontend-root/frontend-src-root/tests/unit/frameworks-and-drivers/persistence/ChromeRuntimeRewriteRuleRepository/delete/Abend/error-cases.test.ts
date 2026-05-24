import { createMockRewriteRuleMessagingPort } from 'tests/unit/interface-adapters/ports/IRewriteRuleMessagingPort/mocks/createMockRewriteRuleMessagingPort';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ChromeRuntimeRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/ChromeRuntimeRewriteRuleRepository';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * ChromeRuntimeRewriteRuleRepository.delete - 異常系テスト
 * 1. Mapperがエラーをスローした場合、そのエラーが伝播する
 * 2. 異なるエラーメッセージでも正しく伝播する
 *
 * ADR-002, ADR-003に準拠: IRewriteRuleMessagingPort → Mapper → Repository
 */
describe('ChromeRuntimeRewriteRuleRepository.delete - 異常系', () => {
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
      description: 'Mapperがエラーをスローした場合、そのエラーが伝播する',
      id: 1,
      errorMessage: 'Delete failed: Network error',
    },
    {
      description: '異なるエラーメッセージでも正しく伝播する',
      id: 42,
      errorMessage: 'Connection timeout',
    },
  ];

  testCases.forEach(({ description, id, errorMessage }) => {
    it(description, async () => {
      // Arrange - IRewriteRuleMessagingPort の delete がエラーをスローするようモック
      const expectedError = new Error(errorMessage);
      (mockMessagingPort.delete as ReturnType<typeof vi.fn>).mockRejectedValue(expectedError);
      const mapper = new RewriteRuleMapper(mockMessagingPort);
      const repository = new ChromeRuntimeRewriteRuleRepository(mapper);

      // Act & Assert - エラーが伝播することを確認
      await expect(repository.delete(id)).rejects.toThrow(errorMessage);
    });
  });
});
