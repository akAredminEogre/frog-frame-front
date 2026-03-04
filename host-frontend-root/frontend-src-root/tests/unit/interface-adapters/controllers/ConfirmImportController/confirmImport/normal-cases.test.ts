/**
 * ConfirmImportController.confirmImport - 正常系テスト
 * 1. validatedRulesをConfirmImportInputDataに包んでUseCaseが呼ばれる
 */
import { createMockConfirmImportUseCase } from 'tests/unit/interface-adapters/controllers/ConfirmImportController/mocks/createMockConfirmImportUseCase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ConfirmImportInputData } from 'src/application-business-rules/dto/input/ConfirmImportInputData';
import { IConfirmImportUseCase } from 'src/application-business-rules/ports/input/IConfirmImportUseCase';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { ConfirmImportController } from 'src/interface-adapters/controllers/ConfirmImportController';

describe('ConfirmImportController.confirmImport - 正常系', () => {
  let mockUseCase: IConfirmImportUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCase = createMockConfirmImportUseCase();
  });

  const testCases = [
    {
      description: 'validatedRulesをConfirmImportInputDataに包んでUseCaseが呼ばれる',
      validatedRules: [
        new RewriteRule(1, 'foo', 'bar', '', false, true),
        new RewriteRule(2, 'baz', 'qux', '', false, true),
      ],
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      const controller = new ConfirmImportController(mockUseCase);

      await controller.confirmImport(testCase.validatedRules);

      expect(mockUseCase.confirmImport).toHaveBeenCalledTimes(1);
      expect(mockUseCase.confirmImport).toHaveBeenCalledWith(
        expect.any(ConfirmImportInputData)
      );
      const calledInputData = (mockUseCase.confirmImport as ReturnType<typeof vi.fn>)
        .mock.calls[0][0] as ConfirmImportInputData;
      expect(calledInputData.validatedRules).toBe(testCase.validatedRules);
    });
  });
});
