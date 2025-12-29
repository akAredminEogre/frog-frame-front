/**
 * createRewriteRuleProxyServiceImpl().deleteRule - 正常系テスト
 * 1. 単一ID削除: 指定IDでrepository.delete()が呼ばれる
 * 2. 異なるID: 別のIDでも正しく委譲される
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';
import { container } from 'src/frameworks-and-drivers/di/container';
import { createRewriteRuleProxyServiceImpl } from 'src/frameworks-and-drivers/messaging/RewriteRuleProxyServiceImpl';

import { createMockRewriteRuleRepository } from 'tests/unit/application/ports/IRewriteRuleRepository/mocks/createMockRewriteRuleRepository';

// container.resolveのモック
vi.mock('src/frameworks-and-drivers/di/container', () => ({
  container: {
    resolve: vi.fn(),
  },
}));

describe('createRewriteRuleProxyServiceImpl().deleteRule - 正常系', () => {
  let mockRepository: IRewriteRuleRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = createMockRewriteRuleRepository();
    (container.resolve as ReturnType<typeof vi.fn>).mockReturnValue(mockRepository);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases: { description: string; id: number }[] = [
    {
      description: '単一ID削除: 指定IDでrepository.delete()が呼ばれる',
      id: 1,
    },
    {
      description: '異なるID: 別のIDでも正しく委譲される',
      id: 42,
    },
  ];

  testCases.forEach(({ description, id }) => {
    it(description, async () => {
      // Arrange
      (mockRepository.delete as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const service = createRewriteRuleProxyServiceImpl();

      // Act
      await service.deleteRule(id);

      // Assert
      expect(container.resolve).toHaveBeenCalledWith('IRewriteRuleRepository');
      expect(container.resolve).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
