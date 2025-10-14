import { vi } from 'vitest';
import type { IPopupService } from 'src/application/ports/IPopupService';

/**
 * テスト用のモックPopupServiceを作成
 */
export function createMockPopupService(): IPopupService {
  return {
    openPopup: vi.fn(),
  };
}
