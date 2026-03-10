/**
 * ExportRulesJsonController.exportRulesJson - 正常系テスト
 * 1. exportRulesJson()でUseCaseのexecuteが1回呼び出される
 */
import { createMockExportRulesJsonUseCase } from 'tests/unit/application-business-rules/ports/input/IExportRulesJsonUseCase/mocks/createMockExportRulesJsonUseCase';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ExportRulesJsonInputData } from 'src/application-business-rules/dto/input/ExportRulesJsonInputData';
import { IExportRulesJsonUseCase } from 'src/application-business-rules/ports/input/IExportRulesJsonUseCase';
import { ExportRulesJsonController } from 'src/interface-adapters/controllers/ExportRulesJsonController';

describe('ExportRulesJsonController.exportRulesJson - 正常系', () => {
  let mockUseCase: IExportRulesJsonUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCase = createMockExportRulesJsonUseCase();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('exportRulesJson()でUseCaseのexecuteが1回呼び出される', async () => {
    const controller = new ExportRulesJsonController(mockUseCase);

    await controller.exportRulesJson();

    expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
    expect(mockUseCase.execute).toHaveBeenCalledWith(
      expect.any(ExportRulesJsonInputData)
    );
  });
});
