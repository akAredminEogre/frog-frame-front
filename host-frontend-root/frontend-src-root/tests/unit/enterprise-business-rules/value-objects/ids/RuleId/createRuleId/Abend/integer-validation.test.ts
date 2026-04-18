import { describe, expect, it } from 'vitest';

import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

/**
 * 1. 小数（Number.isInteger違反）の場合はエラーをthrowする
 * 2. NaNの場合はエラーをthrowする
 * 3. Infinityの場合はエラーをthrowする
 */
describe('createRuleId - 整数バリデーション', () => {
  const testCases = [
    {
      description: '小数（Number.isInteger違反）の場合はエラーをthrowする',
      input: 1.5,
      expectedMessage: 'Invalid RuleId: 1.5',
    },
    {
      description: 'NaNの場合はエラーをthrowする',
      input: NaN,
      expectedMessage: 'Invalid RuleId: NaN',
    },
    {
      description: 'Infinityの場合はエラーをthrowする',
      input: Infinity,
      expectedMessage: 'Invalid RuleId: Infinity',
    },
  ];

  testCases.forEach(({ description, input, expectedMessage }) => {
    it(description, () => {
      expect(() => createRuleId(input)).toThrow(expectedMessage);
    });
  });
});
