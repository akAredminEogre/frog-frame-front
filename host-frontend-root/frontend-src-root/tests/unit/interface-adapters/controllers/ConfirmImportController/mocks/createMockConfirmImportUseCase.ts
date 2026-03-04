import { vi } from 'vitest';

import { IConfirmImportUseCase } from 'src/application-business-rules/ports/input/IConfirmImportUseCase';

/**
 * IConfirmImportUseCaseのモックオブジェクトを生成する
 * @returns IConfirmImportUseCase型のモックオブジェクト
 */
export const createMockConfirmImportUseCase = (): IConfirmImportUseCase => ({
  confirmImport: vi.fn().mockResolvedValue(undefined),
});
