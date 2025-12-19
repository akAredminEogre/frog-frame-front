/**
 * RewriteRule.withActive - イミュータブル性テスト
 * 元のインスタンスは変更されない
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('RewriteRule.withActive - イミュータブル性', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('元のインスタンスは変更されない', () => {
    const ruleId = 1;
    const oldString = 'old';
    const newString = 'new';
    const urlPattern = 'https://example.com';
    const isRegex = false;
    const initialIsActive = true;

    const originalRule = new RewriteRule(
      ruleId,
      oldString,
      newString,
      urlPattern,
      isRegex,
      initialIsActive
    );

    originalRule.withActive(false);

    expect(originalRule.isActive).toBe(true);
  });
});
