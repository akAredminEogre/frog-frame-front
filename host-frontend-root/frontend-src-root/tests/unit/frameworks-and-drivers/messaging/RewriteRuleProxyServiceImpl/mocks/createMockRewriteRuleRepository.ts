import { vi } from 'vitest';

import { IRewriteRuleRepository } from 'src/application-business-rules/ports/gateway/IRewriteRuleRepository';

/**
 * IRewriteRuleRepository のモックファクトリ
 * RewriteRuleProxyServiceImpl のテスト用
 * @returns モック化された IRewriteRuleRepository
 */
export const createMockRewriteRuleRepository = (): IRewriteRuleRepository => {
  return {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    getAll: vi.fn(),
    getById: vi.fn(),
    getRulesMatchingUrl: vi.fn(),
  };
};
