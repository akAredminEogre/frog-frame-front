/**
 * ToggleRuleActiveOutputData.constructor - 正常系テスト
 * 1. isActive=true のルールでインスタンスを作成できる
 * 2. isActive=false のルールでインスタンスを作成できる
 *
 * Note: toggledRuleの読み取り専用性はTypeScriptの型システムで保証される
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
});
