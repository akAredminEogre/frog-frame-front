import { vi } from 'vitest';

import { IRewriteRuleProxyService } from 'src/frameworks-and-drivers/messaging/RewriteRuleProxyService';

/**
 * IRewriteRuleProxyService のモックファクトリ
 * @returns モック化された IRewriteRuleProxyService
 */
export const createMockRewriteRuleProxyService = (): IRewriteRuleProxyService => {
  return {
    getAllRules: vi.fn(),
    deleteRule: vi.fn(),
  };
};
