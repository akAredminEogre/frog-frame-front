import { createMockRewriteRuleMessagingPort } from 'tests/unit/interface-adapters/ports/IRewriteRuleMessagingPort/mocks/createMockRewriteRuleMessagingPort';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ChromeRuntimeRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/ChromeRuntimeRewriteRuleRepository';
import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';
import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * ChromeRuntimeRewriteRuleRepository.delete - 正常系テスト
 * 1. 指定されたIDでMapperのdeleteが呼ばれる
 * 2. Promiseが正常に解決される
 *
 * ADR-002, ADR-003に準拠: IRewriteRuleMessagingPort → Mapper → Repository
 */
describe('ChromeRuntimeRewriteRuleRepository.delete - 正常系', () => {
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

  const testCases = [
    {
      description: '指定されたIDでMapperのdeleteが呼ばれる',
      id: 1,
    },
    {
      description: '別のIDでもMapperのdeleteが正しく呼ばれる',
      id: 42,
    },
  ];

  testCases.forEach(({ description, id }) => {
    it(description, async () => {
      // Arrange - IRewriteRuleMessagingPort の delete をモック
      (mockMessagingPort.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

      // Act
      await repository.delete(id);

      // Assert - IRewriteRuleMessagingPort の delete が正しいIDで呼ばれたことを確認
      expect(mockMessagingPort.delete).toHaveBeenCalledWith({ id });
      expect(mockMessagingPort.delete).toHaveBeenCalledTimes(1);
    });
  });

  it('Promiseが正常に解決される', async () => {
    // Arrange
    (mockMessagingPort.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);

    // Act & Assert - エラーなく完了することを確認
    await expect(repository.delete(1)).resolves.toBeUndefined();
  });
});
