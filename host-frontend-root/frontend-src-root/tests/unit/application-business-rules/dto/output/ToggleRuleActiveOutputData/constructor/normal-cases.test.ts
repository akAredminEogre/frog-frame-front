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
      input: { isActive: true },
    },
    {
      description: 'isActive=false のルールでインスタンスを作成できる',
      input: { isActive: false },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const ruleId = 1;
      const oldString = 'old';
      const newString = 'new';
      const urlPattern = 'https://example.com';
      const isRegex = false;

      const rule = RewriteRule.fromParams(ruleId, {
        oldString,
        newString,
        urlPattern,
        isRegex,
        isActive: testCase.input.isActive,
      });

      const outputData = new ToggleRuleActiveOutputData(rule);

      expect(outputData.toggledRule).toBe(rule);
      expect(outputData.toggledRule.id).toBe(ruleId);
      expect(outputData.toggledRule.isActive).toBe(testCase.input.isActive);
    });
  });
});
