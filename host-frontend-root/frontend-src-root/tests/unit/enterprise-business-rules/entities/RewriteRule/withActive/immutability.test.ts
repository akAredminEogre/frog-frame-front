/**
 * RewriteRule.withActive - イミュータブル性テスト
 * 元のインスタンスは変更されない
 */
import { describe, expect, it } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('RewriteRule.withActive - イミュータブル性', () => {
  it('元のインスタンスは変更されない', () => {
    const ruleId = 1;
    const oldString = 'old';
    const newString = 'new';
    const urlPattern = 'https://example.com';
    const isRegex = false;
    const initialIsActive = true;

    const originalRule = RewriteRule.fromParams(ruleId, {
      oldString,
      newString,
      urlPattern,
      isRegex,
      isActive: initialIsActive,
    });

    originalRule.withActive(false);

    expect(originalRule.isActive).toBe(true);
  });
});
