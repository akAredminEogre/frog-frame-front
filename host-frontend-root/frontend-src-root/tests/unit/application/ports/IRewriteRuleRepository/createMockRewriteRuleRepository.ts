import { vi } from 'vitest';

import type { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';

/**
 * テスト用のモックRewriteRuleRepositoryを作成
 */
export function createMockRewriteRuleRepository(): IRewriteRuleRepository {
  return {
    create: vi.fn(),
    update: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
  };
}