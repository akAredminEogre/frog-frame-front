import { describe, expect, it } from 'vitest';

import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

interface TestCase {
  description: string;
  input: { value: number };
  expected: { message: string };
}

/**
 * 1. 小数（Number.isInteger違反）の場合はエラーをthrowする
 * 2. NaNの場合はエラーをthrowする
 * 3. Infinityの場合はエラーをthrowする
 */
describe('createRuleId - 整数バリデーション', () => {
  const testCases: TestCase[] = [
    {
      description: '小数（Number.isInteger違反）の場合はエラーをthrowする',
      input: { value: 1.5 },
      expected: { message: 'Invalid RuleId: 1.5' },
    },
    {
      description: 'NaNの場合はエラーをthrowする',
      input: { value: NaN },
      expected: { message: 'Invalid RuleId: NaN' },
    },
    {
      description: 'Infinityの場合はエラーをthrowする',
      input: { value: Infinity },
      expected: { message: 'Invalid RuleId: Infinity' },
    },
  ];

  testCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      expect(() => createRuleId(input.value)).toThrow(expected.message);
    });
  });
});
