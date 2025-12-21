import { vi } from 'vitest';

import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';

/**
 * ITabsGatewayのモックオブジェクトを生成する
 * @returns ITabsGateway型のモックオブジェクト
 */
export const createMockTabsGateway = (): ITabsGateway => ({
  reloadMatchingTabs: vi.fn().mockResolvedValue(undefined),
});
