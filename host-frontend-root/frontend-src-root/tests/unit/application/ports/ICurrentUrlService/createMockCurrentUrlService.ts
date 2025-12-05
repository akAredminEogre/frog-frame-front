import { vi } from 'vitest';

import type { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';

/**
 * テスト用のモックCurrentUrlServiceを作成
 */
export function createMockCurrentUrlService(): ICurrentUrlService {
  return {
    getCurrentUrl: vi.fn(),
  };
}
