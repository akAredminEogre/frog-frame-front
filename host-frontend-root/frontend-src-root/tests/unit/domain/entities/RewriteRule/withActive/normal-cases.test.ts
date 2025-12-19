/**
 * RewriteRule.withActive - 正常系テスト
 * 1. isActive=true のルールを false に変更できる
 * 2. isActive=false のルールを true に変更できる
 * 3. 同じ値を設定しても新しいインスタンスが返される
 * 4. 元のインスタンスは変更されない（イミュータブル性）
 * 5. 他のプロパティは維持される
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('RewriteRule.withActive - 正常系', () => {
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

  it('元のインスタンスは変更されない（イミュータブル性）', () => {
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

  it('他のプロパティは維持される', () => {
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

    expect(newRule.id).toBe(ruleId);
    expect(newRule.oldString).toBe(oldString);
    expect(newRule.newString).toBe(newString);
    expect(newRule.urlPattern).toBe(urlPattern);
    expect(newRule.isRegex).toBe(isRegex);
  });
});
