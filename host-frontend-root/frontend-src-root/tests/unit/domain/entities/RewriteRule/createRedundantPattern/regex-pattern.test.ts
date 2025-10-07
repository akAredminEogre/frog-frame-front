import { describe, it, expect } from 'vitest';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * RewriteRule.createRedundantPattern 正規表現パターンテストケース
 * 正規表現パターンでの改行コード無視処理追加とHTMLタグ無しケースの検証
 */
interface CreateRedundantPatternRegexTestCase {
  description: string;
  input: {
    id: string;
    oldString: string;
    newString: string;
    urlPattern?: string;
    isRegex: boolean;
  };
  expected: string;
}

const regexPatternTestCases: CreateRedundantPatternRegexTestCase[] = [
  {
    description: '正規表現パターンの場合は元のパターンに改行コード無視処理を追加する',
    input: {
      id: 'test-id',
      oldString: '<div>.*?</div>',
      newString: 'replacement',
      urlPattern: undefined,
      isRegex: true
    },
    expected: '(?:\\s*)<div>(?:\\s*).*?(?:\\s*)</div>(?:\\s*)'
  },
  {
    description: 'HTMLタグを含まない正規表現の場合はそのまま返す',
    input: {
      id: 'test-id',
      oldString: 'Hello.*World',
      newString: 'replacement',
      urlPattern: undefined,
      isRegex: true
    },
    expected: 'Hello.*World'
  }
];

/**
 * 正規表現パターンでのcreateRedundantPattern動作検証
 * 1. HTMLタグ含む正規表現での改行コード無視処理追加
 * 2. HTMLタグ無し正規表現でのそのまま返却
 */
describe('RewriteRule.createRedundantPattern - 正規表現パターン', () => {
  regexPatternTestCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Arrange
      const rule = new RewriteRule(
        testCase.input.id,
        testCase.input.oldString,
        testCase.input.newString,
        testCase.input.urlPattern || "",
        testCase.input.isRegex
      );

      // Act
      const result = rule.createRedundantPattern();

      // Assert
      expect(result).toBe(testCase.expected);
    });
  });
});
