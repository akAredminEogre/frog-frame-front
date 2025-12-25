import { vi } from 'vitest';

import { ITabsGateway } from 'src/application-business-rules/ports/gateway/ITabsGateway';

/**
 * タブリロード失敗をシミュレートするITabsGatewayモックを生成する
 * 部分的成功（ルール更新成功後のタブリロード失敗）のテストで使用
 * @param errorMessage エラーメッセージ
 * @returns ITabsGateway型のモックオブジェクト（reloadMatchingTabsがエラーを投げる）
 */
export const createFailingTabsGatewayMock = (errorMessage: string): ITabsGateway => ({
  reloadMatchingTabs: vi.fn().mockRejectedValue(new Error(errorMessage)),
});
