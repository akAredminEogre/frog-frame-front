import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRuleNotFoundError } from 'src/domain/errors/RewriteRuleNotFoundError';
import { describe, it, expect, beforeEach } from 'vitest';

/**
 * 1. 存在しないIDを指定した場合にRewriteRuleNotFoundErrorがthrowされることを確認
 * 2. 空のRewriteRulesから取得しようとした場合にRewriteRuleNotFoundErrorがthrowされることを確認
 */
describe('RewriteRules.getById - 異常系', () => {
  let rule1: RewriteRule;
  let rule2: RewriteRule;
  let rulesObject: Record<string, RewriteRule>;
  let rewriteRules: RewriteRules;

  beforeEach(() => {
    rule1 = new RewriteRule(1, 'old1', 'new1', 'https://example.com/*', false);
    rule2 = new RewriteRule(2, 'old2', 'new2', 'https://test.com/*', true);
    rulesObject = {
      1: rule1,
      2: rule2,
    };
    rewriteRules = new RewriteRules(rulesObject);
  });

  it('存在しないIDを指定した場合にRewriteRuleNotFoundErrorがthrowされる', () => {
    expect(() => rewriteRules.getById('nonexistent')).toThrow(RewriteRuleNotFoundError);
    expect(() => rewriteRules.getById('nonexistent')).toThrow('Rewrite rule with id "nonexistent" not found');
  });

  it('空のRewriteRulesから取得しようとした場合にRewriteRuleNotFoundErrorがthrowされる', () => {
    const emptyRules = new RewriteRules();

    expect(() => emptyRules.getById(1)).toThrow(RewriteRuleNotFoundError);
    expect(() => emptyRules.getById(1)).toThrow('Rewrite rule with id "1" not found');
  });
});
