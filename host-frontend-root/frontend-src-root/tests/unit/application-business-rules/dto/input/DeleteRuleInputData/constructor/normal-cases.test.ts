/**
 * DeleteRuleInputData.constructor - 正常系テスト
 * 1. ruleId=1 でインスタンスを作成できる
 * 2. ruleId=100 でインスタンスを作成できる
 * 3. 大きなruleId でインスタンスを作成できる
 *
 * Note: ruleIdの読み取り専用性はTypeScriptの型システムで保証される
 */
import { describe, expect, it } from 'vitest';

import { DeleteRuleInputData } from 'src/application-business-rules/dto/input/DeleteRuleInputData';

describe('DeleteRuleInputData.constructor - 正常系', () => {
  const testCases = [
    {
      description: 'ruleId=1 でインスタンスを作成できる',
      input: { ruleId: 1 },
    },
    {
      description: 'ruleId=100 でインスタンスを作成できる',
      input: { ruleId: 100 },
    },
    {
      description: '大きなruleId でインスタンスを作成できる',
      input: { ruleId: 999999 },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const inputData = new DeleteRuleInputData(testCase.input.ruleId);

      expect(inputData.ruleId).toBe(testCase.input.ruleId);
    });
  });
});
