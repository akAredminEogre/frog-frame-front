/**
 * PreviewRulesJsonPresenter.presentPreview - 正常系テスト
 * 1. onPreviewコールバックが正しい引数で呼ばれる
 * 2. showErrorInViewは呼ばれない
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { PreviewRulesJsonPreviewOutputData } from 'src/application-business-rules/dto/output/PreviewRulesJsonPreviewOutputData';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { PreviewRulesJsonPresenter } from 'src/interface-adapters/presenters/PreviewRulesJsonPresenter';

describe('PreviewRulesJsonPresenter.presentPreview - 正常系', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'currentRuleCount=0, importRuleCount=2でonPreviewが呼ばれる',
      input: {
        currentRuleCount: 0,
        importRuleCount: 2,
        validatedRules: [
          new RewriteRule(1, 'foo', 'bar', '', false, true),
          new RewriteRule(2, 'baz', 'qux', '', false, true),
        ],
      },
    },
    {
      description: 'currentRuleCount=5, importRuleCount=1でonPreviewが呼ばれる',
      input: {
        currentRuleCount: 5,
        importRuleCount: 1,
        validatedRules: [
          new RewriteRule(10, 'hello', 'world', 'https://example.com', false, true),
        ],
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const outputData = new PreviewRulesJsonPreviewOutputData(
        testCase.input.currentRuleCount,
        testCase.input.importRuleCount,
        testCase.input.validatedRules
      );
      const mockOnPreview = vi.fn();
      const mockShowErrorInView = vi.fn();

      const presenter = new PreviewRulesJsonPresenter(mockOnPreview, mockShowErrorInView);
      presenter.presentPreview(outputData);

      expect(mockOnPreview).toHaveBeenCalledTimes(1);
      expect(mockOnPreview).toHaveBeenCalledWith(
        testCase.input.currentRuleCount,
        testCase.input.importRuleCount,
        testCase.input.validatedRules
      );
      expect(mockShowErrorInView).not.toHaveBeenCalled();
    });
  });
});
