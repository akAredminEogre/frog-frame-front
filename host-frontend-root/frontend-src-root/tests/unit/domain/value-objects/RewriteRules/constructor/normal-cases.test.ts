import { beforeEach, describe, expect, it } from 'vitest';

import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

/**
 * 1. 空のオブジェクトでRewriteRulesインスタンスを作成できることを確認
 * 2. 既存のルールオブジェクトでRewriteRulesインスタンスを作成できることを確認
 */
describe('RewriteRules.constructor - 正常系', () => {
  let rule1: RewriteRule;
  let rule2: RewriteRule;
  let rulesObject: Record<string, RewriteRule>;

  beforeEach(() => {
    rule1 = RewriteRule.fromParams(1, { oldString: 'old1', newString: 'new1', urlPattern: 'https://example.com/*', isRegex: false });
    rule2 = RewriteRule.fromParams(2, { oldString: 'old2', newString: 'new2', urlPattern: 'https://test.com/*', isRegex: true });
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
