import { describe, expect, it } from 'vitest';

import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

/**
 * 1. 文字列の場合はエラーをthrowする
 */
describe('createRuleId - 型バリデーション', () => {
  it('文字列の場合はエラーをthrowする', () => {
    expect(() => createRuleId('abc')).toThrow('Invalid RuleId: abc');
  });
});
