/**
 * PreviewRulesJsonController.previewRulesJson - 正常系テスト
 * 1. fileをPreviewRulesJsonInputDataに包んでUseCaseが呼ばれる
 */
import { createMockPreviewRulesJsonUseCase } from 'tests/unit/interface-adapters/controllers/PreviewRulesJsonController/mocks/createMockPreviewRulesJsonUseCase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PreviewRulesJsonInputData } from 'src/application-business-rules/dto/input/PreviewRulesJsonInputData';
import { IPreviewRulesJsonUseCase } from 'src/application-business-rules/ports/input/IPreviewRulesJsonUseCase';
import { PreviewRulesJsonController } from 'src/interface-adapters/controllers/PreviewRulesJsonController';

describe('PreviewRulesJsonController.previewRulesJson - 正常系', () => {
  let mockUseCase: IPreviewRulesJsonUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCase = createMockPreviewRulesJsonUseCase();
  });

  const testCases = [
    {
      description: 'fileをPreviewRulesJsonInputDataに包んでUseCaseが呼ばれる',
      file: new File(['{"version":"1","rules":[]}'], 'rules.json', { type: 'application/json' }),
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      const controller = new PreviewRulesJsonController(mockUseCase);

      await controller.previewRulesJson(testCase.file);

      expect(mockUseCase.previewRulesJson).toHaveBeenCalledTimes(1);
      expect(mockUseCase.previewRulesJson).toHaveBeenCalledWith(
        expect.any(PreviewRulesJsonInputData)
      );
      const calledInputData = (mockUseCase.previewRulesJson as ReturnType<typeof vi.fn>)
        .mock.calls[0][0] as PreviewRulesJsonInputData;
      expect(calledInputData.file).toBe(testCase.file);
    });
  });
});
