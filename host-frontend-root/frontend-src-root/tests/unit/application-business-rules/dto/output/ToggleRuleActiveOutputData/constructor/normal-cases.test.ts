/**
 * ToggleRuleActiveOutputData.constructor - 正常系テスト
 * 1. RewriteRuleを保持するインスタンスが作成できる
 * 2. toggledRuleが読み取り専用である
 */
import { describe, expect, it } from 'vitest';

import { ToggleRuleActiveOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveOutputData';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('ToggleRuleActiveOutputData.constructor - 正常系', () => {
  const testCases = [
    {
      description: 'isActive=true のルールでインスタンスを作成できる',
      input: {
        ruleId: 1,
        oldString: 'old',
        newString: 'new',
        urlPattern: 'https://example.com',
        isRegex: false,
        isActive: true,
      },
    },
    {
      description: 'isActive=false のルールでインスタンスを作成できる',
      input: {
        ruleId: 2,
        oldString: 'before',
        newString: 'after',
        urlPattern: 'https://test.com',
        isRegex: true,
        isActive: false,
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const rule = new RewriteRule(
        testCase.input.ruleId,
        testCase.input.oldString,
        testCase.input.newString,
        testCase.input.urlPattern,
        testCase.input.isRegex,
        testCase.input.isActive
      );

      const outputData = new ToggleRuleActiveOutputData(rule);

      expect(outputData.toggledRule).toBe(rule);
      expect(outputData.toggledRule.id).toBe(testCase.input.ruleId);
      expect(outputData.toggledRule.isActive).toBe(testCase.input.isActive);
    });
  });

  it('toggledRuleが読み取り専用である', () => {
    const rule = new RewriteRule(1, 'old', 'new', 'https://example.com', false, true);
    const outputData = new ToggleRuleActiveOutputData(rule);

    // TypeScriptの型システムで読み取り専用が保証されているため、
    // ランタイムでのプロパティ確認のみ行う
    expect(
      Object.getOwnPropertyDescriptor(outputData, 'toggledRule')?.writable
    ).toBe(false);
  });
});
