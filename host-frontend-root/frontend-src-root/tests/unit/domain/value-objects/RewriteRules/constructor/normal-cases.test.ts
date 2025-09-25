import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { describe, it, expect, beforeEach } from 'vitest';

/**
 * 1. 空のオブジェクトでRewriteRulesインスタンスを作成できることを確認
 * 2. 既存のルールオブジェクトでRewriteRulesインスタンスを作成できることを確認
 */
describe('RewriteRules.constructor - 正常系', () => {
  let rule1: RewriteRule;
  let rule2: RewriteRule;
  let rulesObject: Record<string, RewriteRule>;

  beforeEach(() => {
    rule1 = new RewriteRule('rule1', 'old1', 'new1', 'https://example.com/*', false);
    rule2 = new RewriteRule('rule2', 'old2', 'new2', 'https://test.com/*', true);
    rulesObject = {
      rule1,
      rule2,
    };
  });

  it('空のオブジェクトでRewriteRulesインスタンスを作成できる', () => {
    const rewriteRules = new RewriteRules();
    
    expect(Object.keys(rewriteRules.toObject())).toHaveLength(0);
    expect(rewriteRules.toArray()).toHaveLength(0);
    expect(rewriteRules.toArray()).toEqual([]);
    expect(rewriteRules.toObject()).toEqual({});
  });

  it('既存のルールオブジェクトでRewriteRulesインスタンスを作成できる', () => {
    const rewriteRules = new RewriteRules(rulesObject);
    
    const rulesObjectResult = rewriteRules.toObject();
    
    expect(Object.keys(rulesObjectResult)).toHaveLength(2);
    expect(rewriteRules.toArray()).toHaveLength(2);
    expect(rulesObjectResult['rule1']).toBe(rule1);
    expect(rulesObjectResult['rule2']).toBe(rule2);
  });
});
