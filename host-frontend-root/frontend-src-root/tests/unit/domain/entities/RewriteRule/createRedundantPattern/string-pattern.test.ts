import { describe, it, expect } from 'vitest';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * RewriteRule.createRedundantPattern 文字列パターンテストケース
 * 通常文字列での特殊文字エスケープと改行コード無視処理、境界値ケースの検証
 */
interface CreateRedundantPatternStringTestCase {
  description: string;
  input: {
    oldString: string;
    isRegex?: boolean;
  };
  expected: string;
}

const stringPatternTestCases: CreateRedundantPatternStringTestCase[] = [
  {
    description: '通常文字列パターンの場合は特殊文字をエスケープして改行コード無視処理を追加する',
    input: {
      oldString: '<div>Hello World</div>',
      isRegex: false
    },
    expected: '(?:\\s*)<div>(?:\\s*)Hello World(?:\\s*)</div>(?:\\s*)'
  },
  {
    description: '特殊文字を含む通常文字列の場合は正しくエスケープする',
    input: {
      oldString: '<div class="test">.*?</div>',
      isRegex: false
    },
    expected: '(?:\\s*)<div class="test">(?:\\s*)\\.\\*\\?(?:\\s*)</div>(?:\\s*)'
  },
  {
    description: 'HTMLタグを含まない通常文字列の場合は特殊文字のエスケープのみ行う',
    input: {
      oldString: 'Hello.*World',
      isRegex: false
    },
    expected: 'Hello\\.\\*World'
  },
  {
    description: '空文字列の場合は空文字列を返す',
    input: {
      oldString: '',
      isRegex: false
    },
    expected: ''
  },
  {
    description: 'isRegexが未定義の場合はfalseとして扱う',
    input: {
      oldString: '<div>test</div>',
      isRegex: undefined
    },
    expected: '(?:\\s*)<div>(?:\\s*)test(?:\\s*)</div>(?:\\s*)'
  }
];

/**
 * 文字列パターンでのcreateRedundantPattern動作検証
 * 1. HTMLタグ含む文字列での特殊文字エスケープと改行コード無視処理追加
 * 2. 特殊文字含む文字列での正確なエスケープ処理
 * 3. HTMLタグ無し文字列での特殊文字エスケープのみ
 * 4. 境界値（空文字列）での処理
 * 5. isRegex未定義でのfalse扱い
 */
describe('RewriteRule.createRedundantPattern - 文字列パターン', () => {
  stringPatternTestCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Arrange
      const rule = new RewriteRule(
        'test-id',
        testCase.input.oldString,
        'replacement',
        '',
        testCase.input.isRegex
      );

      // Act
      const result = rule.createRedundantPattern();

      // Assert
      expect(result).toBe(testCase.expected);
    });
  });
});
