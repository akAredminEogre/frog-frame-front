import { createMockRewriteRuleMessagingPort } from 'tests/unit/interface-adapters/ports/IRewriteRuleMessagingPort/mocks/createMockRewriteRuleMessagingPort';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ChromeRuntimeRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/ChromeRuntimeRewriteRuleRepository';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * ChromeRuntimeRewriteRuleRepository.delete - 異常系テスト
 * 1. Mapperがエラーをスローした場合、そのエラーが伝播する
 *
 * ADR-002, ADR-003に準拠: IRewriteRuleMessagingPort → Mapper → Repository
 */
describe('ChromeRuntimeRewriteRuleRepository.delete - 異常系', () => {
  let repository: ChromeRuntimeRewriteRuleRepository;
  let mockMessagingPort: IRewriteRuleMessagingPort;
  let mapper: RewriteRuleMapper;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMessagingPort = createMockRewriteRuleMessagingPort();
    mapper = new RewriteRuleMapper(mockMessagingPort);
    repository = new ChromeRuntimeRewriteRuleRepository(mapper);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('Mapperがエラーをスローした場合、そのエラーが伝播する', async () => {
    // Arrange - IRewriteRuleMessagingPort の delete がエラーをスローするようモック
    const expectedError = new Error('Delete failed: Network error');
    (mockMessagingPort.delete as ReturnType<typeof vi.fn>).mockRejectedValue(expectedError);

    // Act & Assert - エラーが伝播することを確認
    await expect(repository.delete(1)).rejects.toThrow(expectedError);
  });

  it('異なるエラーメッセージでも正しく伝播する', async () => {
    // Arrange
    const expectedError = new Error('Connection timeout');
    (mockMessagingPort.delete as ReturnType<typeof vi.fn>).mockRejectedValue(expectedError);

    // Act & Assert
    await expect(repository.delete(42)).rejects.toThrow('Connection timeout');
  });
});
