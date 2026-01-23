import { vi } from 'vitest';

import { IDeleteRuleUseCase } from 'src/application-business-rules/ports/input/IDeleteRuleUseCase';

/**
 * IDeleteRuleUseCaseのモックオブジェクトを生成する
 * @returns IDeleteRuleUseCase型のモックオブジェクト
 */
export const createMockDeleteRuleUseCase = (): IDeleteRuleUseCase => {
  return {
    execute: vi.fn().mockResolvedValue(undefined),
  };
};
