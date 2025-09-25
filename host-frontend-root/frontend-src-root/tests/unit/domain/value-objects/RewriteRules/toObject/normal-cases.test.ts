import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { describe, it, expect, beforeEach } from 'vitest';

/**
 * 1. すべてのルールをオブジェクトとして取得できることを確認
 * 2. 空のRewriteRulesから空のオブジェクトを取得できることを確認
 */
describe('RewriteRules.toObject - 正常系', () => {
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

  it('すべてのルールをオブジェクトとして取得できる', () => {
    const rewriteRules = new RewriteRules(rulesObject);
    const object = rewriteRules.toObject();
    
    expect(object).toEqual(rulesObject);
    expect(object.rule1).toBe(rule1);
    expect(object.rule2).toBe(rule2);
  });

  it('空のRewriteRulesから空のオブジェクトを取得できる', () => {
    const emptyRules = new RewriteRules();
    const object = emptyRules.toObject();
    
    expect(object).toEqual({});
  });
});
