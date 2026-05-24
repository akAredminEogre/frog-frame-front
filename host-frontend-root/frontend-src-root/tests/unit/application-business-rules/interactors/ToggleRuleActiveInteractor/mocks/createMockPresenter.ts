import { vi } from 'vitest';

import { IToggleRuleActivePresenter } from 'src/application-business-rules/ports/output/IToggleRuleActivePresenter';

/**
 * IToggleRuleActivePresenterのモックオブジェクトを生成する
 * @returns IToggleRuleActivePresenter型のモックオブジェクト
 */
export const createMockPresenter = (): IToggleRuleActivePresenter => ({
  present: vi.fn(),
  presentError: vi.fn(),
});
