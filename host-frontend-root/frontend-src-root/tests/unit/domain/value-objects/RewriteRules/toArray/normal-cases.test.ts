import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { describe, it, expect, beforeEach } from 'vitest';

/**
 * 1. すべてのルールを配列として取得できることを確認
 * 2. 空のRewriteRulesから空の配列を取得できることを確認
 */
describe('RewriteRules.toArray - 正常系', () => {
  let rule1: RewriteRule;
  let rule2: RewriteRule;
  let rulesObject: Record<string, RewriteRule>;

  beforeEach(() => {
    rule1 = new RewriteRule(1, 'old1', 'new1', 'https://example.com/*', false);
    rule2 = new RewriteRule(2, 'old2', 'new2', 'https://test.com/*', true);
    rulesObject = {
      1: rule1,
      2: rule2,
    };
  });

  it('すべてのルールを配列として取得できる', () => {
    const rewriteRules = new RewriteRules(rulesObject);
    const array = rewriteRules.toArray();
    
    expect(array.length).toBe(2);
    expect(array).toContain(rule1);
    expect(array).toContain(rule2);
  });

  it('空のRewriteRulesから空の配列を取得できる', () => {
    const emptyRules = new RewriteRules();
    const array = emptyRules.toArray();
    
    expect(array).toEqual([]);
    expect(array.length).toBe(0);
  });
});
