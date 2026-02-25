import { vi } from 'vitest';

import { IExportRulesJsonPresenter } from 'src/application-business-rules/ports/output/IExportRulesJsonPresenter';

/**
 * IExportRulesJsonPresenterのモックオブジェクトを生成する
 * @returns IExportRulesJsonPresenter型のモックオブジェクト
 */
export const createMockPresenter = (): IExportRulesJsonPresenter => ({
  present: vi.fn(),
  presentError: vi.fn(),
});
