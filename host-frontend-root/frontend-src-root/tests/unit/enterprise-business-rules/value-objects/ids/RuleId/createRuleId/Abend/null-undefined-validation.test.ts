import { describe, expect, it } from 'vitest';

import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

/**
 * 1. nullの場合はエラーをthrowする
 * 2. undefinedの場合はエラーをthrowする
 */
describe('createRuleId - null/undefinedバリデーション', () => {
  const testCases = [
    {
      description: 'nullの場合はエラーをthrowする',
      input: null,
      expectedMessage: 'Invalid RuleId: null',
    },
    {
      description: 'undefinedの場合はエラーをthrowする',
      input: undefined,
      expectedMessage: 'Invalid RuleId: undefined',
    },
  ];

  testCases.forEach(({ description, input, expectedMessage }) => {
    it(description, () => {
      expect(() => createRuleId(input)).toThrow(expectedMessage);
    });
  });
});
