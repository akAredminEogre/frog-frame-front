import { beforeEach,describe, expect, it } from 'vitest';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

/**
 * 1. 空のオブジェクトでRewriteRulesインスタンスを作成できることを確認
 * 2. 既存のルールオブジェクトでRewriteRulesインスタンスを作成できることを確認
 */
describe('RewriteRules.constructor - 正常系', () => {
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

  it('空のオブジェクトでRewriteRulesインスタンスを作成できる', () => {
    const rewriteRules = new RewriteRules();

    expect(rewriteRules.toArray()).toHaveLength(0);
    expect(rewriteRules.toArray()).toEqual([]);
  });

  it('既存のルールオブジェクトでRewriteRulesインスタンスを作成できる', () => {
    const rewriteRules = new RewriteRules(rulesObject);

    const rulesArray = rewriteRules.toArray();

    expect(rulesArray).toHaveLength(2);
    expect(rulesArray).toContain(rule1);
    expect(rulesArray).toContain(rule2);
  });
});
