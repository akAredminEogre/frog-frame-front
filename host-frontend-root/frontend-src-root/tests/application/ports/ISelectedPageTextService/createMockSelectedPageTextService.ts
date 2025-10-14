import { vi } from 'vitest';
import type { ISelectedPageTextService } from 'src/application/ports/ISelectedPageTextService';

/**
 * テスト用のモックSelectedPageTextServiceを作成
 */
export function createMockSelectedPageTextService(): ISelectedPageTextService {
  return {
    setSelectedPageText: vi.fn(),
    getSelectedPageText: vi.fn(),
  };
}
