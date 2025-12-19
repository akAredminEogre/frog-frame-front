/**
 * ToggleRuleActiveInputData.constructor - 正常系テスト
 * 1. ruleIdを保持するインスタンスが作成できる
 * 2. ruleIdが読み取り専用である
 */
import { describe, expect, it } from 'vitest';

import { ToggleRuleActiveInputData } from 'src/application-business-rules/dto/input/ToggleRuleActiveInputData';

describe('ToggleRuleActiveInputData.constructor - 正常系', () => {
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
      const inputData = new ToggleRuleActiveInputData(testCase.input.ruleId);

      expect(inputData.ruleId).toBe(testCase.input.ruleId);
    });
  });

  it('ruleIdが読み取り専用である', () => {
    const inputData = new ToggleRuleActiveInputData(1);

    // TypeScriptの型システムで読み取り専用が保証されているため、
    // ランタイムでのプロパティ確認のみ行う
    expect(Object.getOwnPropertyDescriptor(inputData, 'ruleId')?.writable).toBe(
      false
    );
  });
});
