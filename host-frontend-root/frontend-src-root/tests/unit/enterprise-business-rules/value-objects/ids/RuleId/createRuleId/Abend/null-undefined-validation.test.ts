import { describe, expect, it } from 'vitest';

import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

interface TestCase {
  description: string;
  input: { value: null | undefined };
  expected: { message: string };
}

/**
 * 1. nullの場合はエラーをthrowする
 * 2. undefinedの場合はエラーをthrowする
 */
describe('createRuleId - null/undefinedバリデーション', () => {
  const testCases: TestCase[] = [
    {
      description: 'nullの場合はエラーをthrowする',
      input: { value: null },
      expected: { message: 'Invalid RuleId: null' },
    },
    {
      description: 'undefinedの場合はエラーをthrowする',
      input: { value: undefined },
      expected: { message: 'Invalid RuleId: undefined' },
    },
  ];

  testCases.forEach(({ description, input, expected }) => {
    it(description, () => {
      expect(() => createRuleId(input.value)).toThrow(expected.message);
    });
  });
});
