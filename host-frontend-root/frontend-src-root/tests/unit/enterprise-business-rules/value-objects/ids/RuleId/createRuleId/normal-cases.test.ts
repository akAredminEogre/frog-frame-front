import { describe, expect, it } from 'vitest';

import { createRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

/**
 * 1. 正の整数を正常に生成できる
 * 2. 0を正常に生成できる
 */
describe('createRuleId - 正常系', () => {
  it('正の整数を正常に生成できる', () => {
    const id = createRuleId(42);
    expect(id).toBe(42);
  });

  it('0を正常に生成できる', () => {
    const id = createRuleId(0);
    expect(id).toBe(0);
  });
});
