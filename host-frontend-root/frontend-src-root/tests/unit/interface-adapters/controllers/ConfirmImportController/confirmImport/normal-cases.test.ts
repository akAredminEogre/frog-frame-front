/**
 * ConfirmImportController.confirmImport - 正常系テスト
 * 1. ゼロ引数でUseCaseのconfirmImportが呼ばれる（pendingRulesはInteractorが保持）
 */
import { createMockConfirmImportUseCase } from 'tests/unit/interface-adapters/controllers/ConfirmImportController/mocks/createMockConfirmImportUseCase';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IConfirmImportUseCase } from 'src/application-business-rules/ports/input/IConfirmImportUseCase';
import { ConfirmImportController } from 'src/interface-adapters/controllers/ConfirmImportController';

describe('ConfirmImportController.confirmImport - 正常系', () => {
  let mockUseCase: IConfirmImportUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCase = createMockConfirmImportUseCase();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('ゼロ引数でUseCaseのconfirmImportが呼ばれる', async () => {
    const controller = new ConfirmImportController(mockUseCase);

    await controller.confirmImport();

    expect(mockUseCase.confirmImport).toHaveBeenCalledTimes(1);
    expect(mockUseCase.confirmImport).toHaveBeenCalledWith();
  });
});
