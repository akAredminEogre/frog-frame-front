import { vi } from 'vitest';

import { IPreviewRulesJsonPresenter } from 'src/application-business-rules/ports/output/IPreviewRulesJsonPresenter';

/**
 * IPreviewRulesJsonPresenterのモックオブジェクトを生成する
 * @returns IPreviewRulesJsonPresenter型のモックオブジェクト
 */
export const createMockPresenter = (): IPreviewRulesJsonPresenter => ({
  presentPreview: vi.fn(),
  presentError: vi.fn(),
});
