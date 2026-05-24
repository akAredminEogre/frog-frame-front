import { vi } from 'vitest';

import { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';

/**
 * IRewriteRuleMessagingPort のモックファクトリ
 * @returns モック化された IRewriteRuleMessagingPort
 */
export function createMockRewriteRuleMessagingPort(): IRewriteRuleMessagingPort {
  return {
    getAll: vi.fn(),
    getById: vi.fn(),
    updateActive: vi.fn(),
    delete: vi.fn(),
  };
}
