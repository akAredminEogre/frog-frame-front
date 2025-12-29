/**
 * DeleteRuleErrorOutputData.constructor - 正常系テスト
 * 1. Errorオブジェクトからmessageを抽出できる
 * 2. Error以外のオブジェクトを文字列に変換できる
 */
import { describe, expect, it } from 'vitest';

import { DeleteRuleErrorOutputData } from 'src/application-business-rules/dto/output/DeleteRuleErrorOutputData';

describe('DeleteRuleErrorOutputData.constructor - 正常系', () => {
  const testCases = [
    {
      description: 'Errorオブジェクトからmessageを抽出できる',
      input: {
        ruleId: 1,
        error: new Error('テストエラーメッセージ'),
      },
      expected: {
        ruleId: 1,
        message: 'テストエラーメッセージ',
      },
    },
    {
      description: 'Error以外のオブジェクトを文字列に変換できる',
      input: {
        ruleId: 2,
        error: 'エラー文字列',
      },
      expected: {
        ruleId: 2,
        message: 'エラー文字列',
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const errorOutputData = new DeleteRuleErrorOutputData(
        testCase.input.ruleId,
        testCase.input.error
      );

      expect(errorOutputData.ruleId).toBe(testCase.expected.ruleId);
      expect(errorOutputData.message).toBe(testCase.expected.message);
    });
  });
});
