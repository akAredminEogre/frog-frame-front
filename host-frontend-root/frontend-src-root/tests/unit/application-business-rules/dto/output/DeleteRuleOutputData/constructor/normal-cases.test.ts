/**
 * DeleteRuleOutputData.constructor - 正常系テスト
 * 1. 正の整数IDでインスタンスを作成できる
 * 2. 複数桁のIDでインスタンスを作成できる
 *
 * Note: deletedRuleIdの読み取り専用性はTypeScriptの型システムで保証される
 */
import { describe, expect, it } from 'vitest';

import { DeleteRuleOutputData } from 'src/application-business-rules/dto/output/DeleteRuleOutputData';

describe('DeleteRuleOutputData.constructor - 正常系', () => {
  const testCases = [
    {
      description: '正の整数IDでインスタンスを作成できる',
      input: { deletedRuleId: 1 },
      expected: { deletedRuleId: 1 },
    },
    {
      description: '複数桁のIDでインスタンスを作成できる',
      input: { deletedRuleId: 12345 },
      expected: { deletedRuleId: 12345 },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const outputData = new DeleteRuleOutputData(testCase.input.deletedRuleId);

      expect(outputData.deletedRuleId).toBe(testCase.expected.deletedRuleId);
    });
  });
});
