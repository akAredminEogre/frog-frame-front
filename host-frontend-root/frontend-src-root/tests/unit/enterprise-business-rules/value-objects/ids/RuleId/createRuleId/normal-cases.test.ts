import { describe, expect, it } from 'vitest';

import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

/**
 * 1. 正の整数を正常に生成できる
 * 2. 0を正常に生成できる
 */
describe('createRuleId - 正常系', () => {
  const testCases = [
    {
      description: '正の整数を正常に生成できる',
      input: 42,
      expected: 42,
    },
    {
      description: '0を正常に生成できる',
      input: 0,
      expected: 0,
    },
  ];

  testCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      const id = createRuleId(input);
      expect(id).toBe(expected);
    });
  });
});
