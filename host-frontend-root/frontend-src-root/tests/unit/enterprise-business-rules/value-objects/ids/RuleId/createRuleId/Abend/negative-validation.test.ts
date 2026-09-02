import { describe, expect, it } from 'vitest';

import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

/**
 * 1. 負数の場合はエラーをthrowする
 */
describe('createRuleId - 負数バリデーション', () => {
  it('負数の場合はエラーをthrowする', () => {
    expect(() => createRuleId(-1)).toThrow('Invalid RuleId: -1');
  });
});
