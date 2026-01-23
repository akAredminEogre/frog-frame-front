/**
 * DeleteRuleController.deleteRule - 正常系テスト
 * 1. ruleId=1 でUseCaseが呼び出される
 * 2. 大きなruleId でUseCaseが呼び出される
 */
import { createMockDeleteRuleUseCase } from 'tests/unit/interface-adapters/controllers/DeleteRuleController/mocks/createMockDeleteRuleUseCase';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DeleteRuleInputData } from 'src/application-business-rules/dto/input/DeleteRuleInputData';
import { IDeleteRuleUseCase } from 'src/application-business-rules/ports/input/IDeleteRuleUseCase';
import { DeleteRuleController } from 'src/interface-adapters/controllers/DeleteRuleController';

describe('DeleteRuleController.deleteRule - 正常系', () => {
  let mockUseCase: IDeleteRuleUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCase = createMockDeleteRuleUseCase();
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
      const controller = new DeleteRuleController(mockUseCase);

      await controller.deleteRule(testCase.input.ruleId);

      expect(mockUseCase.execute).toHaveBeenCalledTimes(1);
      expect(mockUseCase.execute).toHaveBeenCalledWith(
        expect.any(DeleteRuleInputData)
      );
      const calledInputData = (mockUseCase.execute as ReturnType<typeof vi.fn>)
        .mock.calls[0][0] as DeleteRuleInputData;
      expect(calledInputData.ruleId).toBe(testCase.input.ruleId);
    });
  });
});
