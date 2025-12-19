/**
 * RewriteRule.withActive - 正常系テスト（isActive状態変更）
 * 1. isActive=true のルールを false に変更できる
 * 2. isActive=false のルールを true に変更できる
 * 3. 同じ値(true)を設定しても新しいインスタンスが返される
 * 4. 同じ値(false)を設定しても新しいインスタンスが返される
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('RewriteRule.withActive - 正常系（isActive状態変更）', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const testCases = [
    {
      description: 'isActive=true のルールを false に変更できる',
      input: {
        initialIsActive: true,
        newIsActive: false,
      },
    },
    {
      description: 'isActive=false のルールを true に変更できる',
      input: {
        initialIsActive: false,
        newIsActive: true,
      },
    },
    {
      description: '同じ値(true)を設定しても新しいインスタンスが返される',
      input: {
        initialIsActive: true,
        newIsActive: true,
      },
    },
    {
      description: '同じ値(false)を設定しても新しいインスタンスが返される',
      input: {
        initialIsActive: false,
        newIsActive: false,
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const ruleId = 1;
      const oldString = 'old';
      const newString = 'new';
      const urlPattern = 'https://example.com';
      const isRegex = false;

      const originalRule = new RewriteRule(
        ruleId,
        oldString,
        newString,
        urlPattern,
        isRegex,
        testCase.input.initialIsActive
      );

      const newRule = originalRule.withActive(testCase.input.newIsActive);

      expect(newRule.isActive).toBe(testCase.input.newIsActive);
      expect(newRule).not.toBe(originalRule);
    });
  });
});
