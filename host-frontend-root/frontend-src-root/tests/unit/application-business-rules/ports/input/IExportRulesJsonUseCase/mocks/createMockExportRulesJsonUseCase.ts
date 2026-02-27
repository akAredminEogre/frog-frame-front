import { vi } from 'vitest';

import { IExportRulesJsonUseCase } from 'src/application-business-rules/ports/input/IExportRulesJsonUseCase';

/**
 * IExportRulesJsonUseCaseのモックオブジェクトを生成する
 * @returns IExportRulesJsonUseCase型のモックオブジェクト
 */
export const createMockExportRulesJsonUseCase =
  (): IExportRulesJsonUseCase => {
    return {
      execute: vi.fn().mockResolvedValue(undefined),
    };
  };
