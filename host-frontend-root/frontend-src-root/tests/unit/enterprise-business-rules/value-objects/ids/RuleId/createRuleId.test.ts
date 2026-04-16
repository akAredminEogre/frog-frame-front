/**
 * createRuleId - バリデーションテスト
 * 1. 正の整数は正常に生成できる
 * 2. 0は正常に生成できる
 * 3. 負数は拒否される
 * 4. non-numberは拒否される
 * 5. 小数（Number.isInteger違反）は拒否される
 * 6. NaNは拒否される
 * 7. Infinityは拒否される
 */
import { describe, expect, it } from 'vitest';

import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

describe('createRuleId', () => {
  it('正の整数を正常に生成できる', () => {
    const id = createRuleId(42);
    expect(id).toBe(42);
  });

  it('0を正常に生成できる', () => {
    const id = createRuleId(0);
    expect(id).toBe(0);
  });

  it('負数を拒否する', () => {
    expect(() => createRuleId(-1)).toThrow('Invalid RuleId: -1');
  });

  it('non-numberを拒否する', () => {
    expect(() => createRuleId('abc')).toThrow('Invalid RuleId: abc');
    expect(() => createRuleId(null)).toThrow('Invalid RuleId: null');
    expect(() => createRuleId(undefined)).toThrow('Invalid RuleId: undefined');
  });

  it('小数（Number.isInteger違反）を拒否する', () => {
    expect(() => createRuleId(1.5)).toThrow('Invalid RuleId: 1.5');
  });

  it('NaNを拒否する', () => {
    expect(() => createRuleId(NaN)).toThrow('Invalid RuleId: NaN');
  });

  it('Infinityを拒否する', () => {
    expect(() => createRuleId(Infinity)).toThrow('Invalid RuleId: Infinity');
  });
});
