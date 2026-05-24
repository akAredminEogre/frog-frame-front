/**
 * ToggleRuleActivePresenter.presentError - 正常系テスト（コールバック呼び出し）
 * 1. エラーデータでshowErrorInViewコールバックが呼び出され、ruleIdとmessageが正しく渡される
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ToggleRuleActiveErrorOutputData } from 'src/application-business-rules/dto/output/ToggleRuleActiveErrorOutputData';
import { ToggleRuleActivePresenter } from 'src/interface-adapters/presenters/ToggleRuleActivePresenter';

describe('ToggleRuleActivePresenter.presentError - 正常系（コールバック呼び出し）', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases = [
    {
      description: 'Errorオブジェクト由来のエラーでコールバックが呼び出され、ruleIdとmessageが正しく渡される',
      input: {
        ruleId: 1,
        error: new Error('テストエラー'),
      },
      expected: {
        ruleId: 1,
        message: 'テストエラー',
      },
    },
    {
      description: '文字列由来のエラーでコールバックが呼び出され、ruleIdとmessageが正しく渡される',
      input: {
        ruleId: 2,
        error: '文字列エラー',
      },
      expected: {
        ruleId: 2,
        message: '文字列エラー',
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const mockUpdateRuleInView = vi.fn();
      const mockShowErrorInView = vi.fn();

      const presenter = new ToggleRuleActivePresenter(mockUpdateRuleInView, mockShowErrorInView);
      const errorData = new ToggleRuleActiveErrorOutputData(
        testCase.input.ruleId,
        testCase.input.error
      );

      presenter.presentError(errorData);

      expect(mockShowErrorInView).toHaveBeenCalledTimes(1);
      expect(mockShowErrorInView).toHaveBeenCalledWith(
        testCase.expected.ruleId,
        testCase.expected.message
      );
      expect(mockUpdateRuleInView).not.toHaveBeenCalled();
    });
  });
});
