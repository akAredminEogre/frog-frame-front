import { describe, expect, it } from 'vitest';

import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

interface TestCase {
  description: string;
  input: { value: number };
  expected: { value: number };
}

/**
 * 1. 正の整数を正常に生成できる
 * 2. 0を正常に生成できる
 */
describe('createRuleId - 正常系', () => {
  const testCases: TestCase[] = [
    {
      description: '正の整数を正常に生成できる',
      input: { value: 42 },
      expected: { value: 42 },
    },
    {
      description: '0を正常に生成できる',
      input: { value: 0 },
      expected: { value: 0 },
    },
  ];

  testCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      const id = createRuleId(input.value);
      expect(id).toBe(expected.value);
    });
  });
});
