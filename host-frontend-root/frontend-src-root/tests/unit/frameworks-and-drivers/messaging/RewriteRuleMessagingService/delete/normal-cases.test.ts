/**
 * RewriteRuleMessagingService.delete - 正常系テスト
 * 1. 削除成功: deleteRule()が正常に完了する
 * 2. IDの伝播: DTOのidがdeleteRule()に正しく渡される
 */
import { createMockRewriteRuleProxyService } from 'tests/unit/frameworks-and-drivers/messaging/RewriteRuleMessagingService/mocks/createMockRewriteRuleProxyService';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DeleteRuleRequestDTO } from 'src/frameworks-and-drivers/messaging/dto/request-dto/DeleteRuleRequestDTO';
import { RewriteRuleMessagingService } from 'src/frameworks-and-drivers/messaging/RewriteRuleMessagingService';
import { getRewriteRuleProxyService, IRewriteRuleProxyService } from 'src/frameworks-and-drivers/messaging/RewriteRuleProxyService';

// モジュールレベルのモック設定（vi.mock()はファイルトップレベルで呼び出す必要がある）
vi.mock('src/frameworks-and-drivers/messaging/RewriteRuleProxyService', () => ({
  getRewriteRuleProxyService: vi.fn(),
}));

describe('RewriteRuleMessagingService.delete - 正常系', () => {
  let mockProxyService: IRewriteRuleProxyService;

  beforeEach(() => {
    vi.clearAllMocks();
    mockProxyService = createMockRewriteRuleProxyService();
    (getRewriteRuleProxyService as ReturnType<typeof vi.fn>).mockReturnValue(mockProxyService);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases: { description: string; dto: DeleteRuleRequestDTO }[] = [
    {
      description: '削除成功: deleteRule()が正常に完了する（id=1）',
      dto: { id: 1 },
    },
    {
      description: 'IDの伝播: 大きなID値が正しく渡される（id=9999）',
      dto: { id: 9999 },
    },
  ];

  testCases.forEach(({ description, dto }) => {
    it(description, async () => {
      // Arrange
      (mockProxyService.deleteRule as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const service = new RewriteRuleMessagingService();

      // Act
      await service.delete(dto);

      // Assert
      expect(mockProxyService.deleteRule).toHaveBeenCalledTimes(1);
      expect(mockProxyService.deleteRule).toHaveBeenCalledWith(dto.id);
    });
  });
});
