import { vi } from 'vitest';

import { IToggleRuleActiveUseCase } from 'src/application-business-rules/ports/input/IToggleRuleActiveUseCase';

/**
 * IToggleRuleActiveUseCaseのモックオブジェクトを生成する
 * @returns IToggleRuleActiveUseCase型のモックオブジェクト
 */
export const createMockToggleRuleActiveUseCase = (): IToggleRuleActiveUseCase => {
  return {
    execute: vi.fn().mockResolvedValue(undefined),
  };
};
