import { vi } from 'vitest';

import { IConfirmImportPresenter } from 'src/application-business-rules/ports/output/IConfirmImportPresenter';

/**
 * IConfirmImportPresenterのモックオブジェクトを生成する
 * @returns IConfirmImportPresenter型のモックオブジェクト
 */
export const createMockPresenter = (): IConfirmImportPresenter => ({
  present: vi.fn(),
  presentError: vi.fn(),
});
