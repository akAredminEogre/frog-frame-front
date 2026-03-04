import { vi } from 'vitest';

import { IPreviewRulesJsonUseCase } from 'src/application-business-rules/ports/input/IPreviewRulesJsonUseCase';

/**
 * IPreviewRulesJsonUseCaseのモックオブジェクトを生成する
 * @returns IPreviewRulesJsonUseCase型のモックオブジェクト
 */
export const createMockPreviewRulesJsonUseCase = (): IPreviewRulesJsonUseCase => ({
  previewRulesJson: vi.fn().mockResolvedValue(undefined),
});
