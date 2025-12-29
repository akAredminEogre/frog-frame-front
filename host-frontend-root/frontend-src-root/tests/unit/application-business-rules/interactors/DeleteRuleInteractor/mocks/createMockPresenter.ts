import { vi } from 'vitest';

import { IDeleteRulePresenter } from 'src/application-business-rules/ports/output/IDeleteRulePresenter';

/**
 * IDeleteRulePresenterのモックオブジェクトを生成する
 * @returns IDeleteRulePresenter型のモックオブジェクト
 */
export const createMockPresenter = (): IDeleteRulePresenter => ({
  present: vi.fn(),
  presentError: vi.fn(),
});
