import { describe, expect, it } from 'vitest';

import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

/**
 * 1. 小数（Number.isInteger違反）の場合はエラーをthrowする
 * 2. NaNの場合はエラーをthrowする
 * 3. Infinityの場合はエラーをthrowする
 */
describe('createRuleId - 整数バリデーション', () => {
  it('小数（Number.isInteger違反）の場合はエラーをthrowする', () => {
    expect(() => createRuleId(1.5)).toThrow('Invalid RuleId: 1.5');
  });

  it('NaNの場合はエラーをthrowする', () => {
    expect(() => createRuleId(NaN)).toThrow('Invalid RuleId: NaN');
  });

  it('Infinityの場合はエラーをthrowする', () => {
    expect(() => createRuleId(Infinity)).toThrow('Invalid RuleId: Infinity');
  });
});
