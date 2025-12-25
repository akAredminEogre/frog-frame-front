import { vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';

/**
 * IRewriteRuleRepositoryのモックオブジェクトを生成する
 * @returns IRewriteRuleRepository型のモックオブジェクト
 */
export const createMockRepository = (): IRewriteRuleRepository => ({
  create: vi.fn(),
  update: vi.fn().mockResolvedValue(undefined),
  getAll: vi.fn(),
  getById: vi.fn(),
  getRulesMatchingUrl: vi.fn(),
});
