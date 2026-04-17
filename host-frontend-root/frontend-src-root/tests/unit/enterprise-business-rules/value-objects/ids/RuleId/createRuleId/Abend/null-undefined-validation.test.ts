import { describe, expect, it } from 'vitest';

import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

/**
 * 1. nullの場合はエラーをthrowする
 * 2. undefinedの場合はエラーをthrowする
 */
describe('createRuleId - null/undefinedバリデーション', () => {
  it('nullの場合はエラーをthrowする', () => {
    expect(() => createRuleId(null)).toThrow('Invalid RuleId: null');
  });

  it('undefinedの場合はエラーをthrowする', () => {
    expect(() => createRuleId(undefined)).toThrow('Invalid RuleId: undefined');
  });
});
