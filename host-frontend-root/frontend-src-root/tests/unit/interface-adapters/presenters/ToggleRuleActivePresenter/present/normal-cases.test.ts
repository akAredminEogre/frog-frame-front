/**
 * ToggleRuleActivePresenter.present - 正常系テスト（コールバック呼び出し）
 * 1. isActive=trueのルールでコールバックが呼び出され、toggledRuleが正しく渡される
 * 2. isActive=falseのルールでコールバックが呼び出され、toggledRuleが正しく渡される
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToggleRuleActiveOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveOutputData';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { ToggleRuleActivePresenter } from 'src/interface-adapters/presenters/ToggleRuleActivePresenter';

describe('ToggleRuleActivePresenter.present - 正常系（コールバック呼び出し）', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'isActive=trueのルールでコールバックが呼び出され、toggledRuleが正しく渡される',
      input: {
        isActive: true,
      },
    },
    {
      description: 'isActive=falseのルールでコールバックが呼び出され、toggledRuleが正しく渡される',
      input: {
        isActive: false,
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

      const toggledRule = new RewriteRule(
        ruleId,
        oldString,
        newString,
        urlPattern,
        isRegex,
        testCase.input.isActive
      );
      const outputData = new ToggleRuleActiveOutputData(toggledRule);
      const mockUpdateRuleInView = vi.fn();
      const mockShowErrorInView = vi.fn();

      const presenter = new ToggleRuleActivePresenter(mockUpdateRuleInView, mockShowErrorInView);
      presenter.present(outputData);

      expect(mockUpdateRuleInView).toHaveBeenCalledTimes(1);
      expect(mockUpdateRuleInView).toHaveBeenCalledWith(toggledRule);
    });
  });
});
