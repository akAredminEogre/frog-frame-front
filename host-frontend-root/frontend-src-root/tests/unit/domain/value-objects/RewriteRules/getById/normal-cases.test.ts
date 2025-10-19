import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { describe, it, expect, beforeEach } from 'vitest';

/**
 * 1. 存在するIDでルールを取得できることを確認
 * 2. 複数のルールがある場合でも正しいルールを取得できることを確認
 */
describe('RewriteRules.getById - 正常系', () => {
  let rule1: RewriteRule;
  let rule2: RewriteRule;
  let rule3: RewriteRule;
  let rulesObject: Record<string, RewriteRule>;
  let rewriteRules: RewriteRules;

  beforeEach(() => {
    rule1 = new RewriteRule(1, 'old1', 'new1', 'https://example.com/*', false);
    rule2 = new RewriteRule(2, 'old2', 'new2', 'https://test.com/*', true);
    rule3 = new RewriteRule(3, 'old3', 'new3', '', false);
    rulesObject = {
      1: rule1,
      2: rule2,
      3: rule3,
    };
    rewriteRules = new RewriteRules(rulesObject);
  });

  it('存在するIDでルールを取得できる', () => {
    const foundRule = rewriteRules.getById('1');

    expect(foundRule).toBe(rule1);
  });

  it('複数のルールがある場合でも正しいルールを取得できる', () => {
    const foundRule1 = rewriteRules.getById('1');
    const foundRule2 = rewriteRules.getById('2');
    const foundRule3 = rewriteRules.getById('3');
    
    expect(foundRule1).toBe(rule1);
    expect(foundRule2).toBe(rule2);
    expect(foundRule3).toBe(rule3);
  });
});
