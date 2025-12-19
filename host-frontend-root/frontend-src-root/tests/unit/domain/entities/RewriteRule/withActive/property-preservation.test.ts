/**
 * RewriteRule.withActive - プロパティ維持テスト
 * isActive以外のプロパティは維持される
 */
import { describe, expect, it } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('RewriteRule.withActive - プロパティ維持', () => {
  it('isActive以外のプロパティは維持される', () => {
    const ruleId = 42;
    const oldString = 'oldValue';
    const newString = 'newValue';
    const urlPattern = 'https://test.example.com/path';
    const isRegex = true;
    const initialIsActive = true;

    const originalRule = new RewriteRule(
      ruleId,
      oldString,
      newString,
      urlPattern,
      isRegex,
      initialIsActive
    );

    const newRule = originalRule.withActive(false);

    expect(newRule.isActive).toBe(false);
    expect(newRule.id).toBe(ruleId);
    expect(newRule.oldString).toBe(oldString);
    expect(newRule.newString).toBe(newString);
    expect(newRule.urlPattern).toBe(urlPattern);
    expect(newRule.isRegex).toBe(isRegex);
  });
});
