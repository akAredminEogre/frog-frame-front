/**
 * ToggleRuleActiveController.toggleActive - 正常系テスト
 * 1. ruleId=1 でUseCaseが呼び出される
 * 2. 大きなruleId でUseCaseが呼び出される
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/ToggleRuleActiveInputData';
import { IToggleRuleActiveUseCase } from 'src/application-business-rules/ports/input/IToggleRuleActiveUseCase';
import { ToggleRuleActiveController } from 'src/interface-adapters/controllers/ToggleRuleActiveController';

describe('ToggleRuleActiveController.toggleActive - 正常系', () => {
  let mockUseCase: IToggleRuleActiveUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCase = {
      execute: vi.fn().mockResolvedValue(undefined),
    };
  });

  const testCases = [
    {
      description: 'ruleId=1 でUseCaseが呼び出される',
      input: { ruleId: 1 },
    },
    {
      description: '大きなruleId でUseCaseが呼び出される',
      input: { ruleId: 999999 },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, async () => {
      const controller = new ToggleRuleActiveController(mockUseCase);

      await controller.toggleActive(testCase.input.ruleId);

      expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockUseCase.execute).toHaveBeenCalledWith(
        expect.any(ToggleRuleActiveInputData)
      );
      const calledInputData = (mockUseCase.execute as ReturnType<typeof vi.fn>)
        .mock.calls[0][0] as ToggleRuleActiveInputData;
      expect(calledInputData.ruleId).toBe(testCase.input.ruleId);
    });
  });
});
