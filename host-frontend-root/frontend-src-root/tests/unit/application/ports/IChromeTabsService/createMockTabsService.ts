import { vi } from 'vitest';

import type { IChromeTabsService } from 'src/application/ports/IChromeTabsService';

/**
 * テスト用のモックChromeTabsServiceを作成
 */
export function createMockTabsService(): IChromeTabsService {
  return {
    sendMessage: vi.fn(),
    queryTabs: vi.fn(),
    sendApplyAllRulesMessage: vi.fn(),
    openEditPage: vi.fn(),
    reloadTab: vi.fn(),
  };
}
