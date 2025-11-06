import { vi } from 'vitest';

import type { ISelectedPageTextRepository } from 'src/application/ports/ISelectedPageTextRepository';

/**
 * テスト用のモックSelectedPageTextRepositoryを作成
 */
export function createMockSelectedPageTextRepository(): ISelectedPageTextRepository {
  return {
    setSelectedPageText: vi.fn(),
    getSelectedPageText: vi.fn(),
    getSelectedPageTextAndRemove: vi.fn(),
  };
}