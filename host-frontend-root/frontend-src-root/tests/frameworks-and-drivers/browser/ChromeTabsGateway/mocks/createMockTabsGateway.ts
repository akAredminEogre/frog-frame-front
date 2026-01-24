import { vi } from 'vitest';

import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';

/**
 * ITabsGatewayのモックオブジェクトを生成する
 * Chrome Tabs APIに依存するため、結合テストではモック化が必要
 * @returns ITabsGateway型のモックオブジェクト
 */
export const createMockTabsGateway = (): ITabsGateway => ({
  reloadMatchingTabs: vi.fn().mockResolvedValue(undefined),
});
