import { vi } from 'vitest';

import { IImportRulesJsonPresenter } from 'src/application-business-rules/interactors/ImportRulesJsonInteractor';

/**
 * IImportRulesJsonPresenterのモックオブジェクトを生成する
 * @returns IImportRulesJsonPresenter型のモックオブジェクト
 */
export const createMockPresenter = (): IImportRulesJsonPresenter => ({
  present: vi.fn(),
  presentError: vi.fn(),
});
