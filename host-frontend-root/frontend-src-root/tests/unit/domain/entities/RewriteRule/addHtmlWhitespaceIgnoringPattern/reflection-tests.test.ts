/**
 * RewriteRule.addHtmlWhitespaceIgnoringPattern - リフレクションテスト
 * 1. 基本的なHTML要素を含むパターンの空白無視処理追加
 * 2. 複数のHTML要素を含むパターンの空白無視処理追加
 * 3. HTML要素を含まないプレーンテキストパターンの処理
 * 4. 開始タグのみのHTML要素パターンの空白無視処理追加
 * 5. 空文字列入力時の処理
 * 6. ネストしたHTML要素と混在コンテンツの空白無視処理追加
 * 7. 特殊文字・属性を含むHTML要素パターンの空白無視処理追加
 */
import { describe, expect,it } from 'vitest';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

const addHtmlWhitespaceIgnoringPatternCases = [
  {
    description: 'should add HTML whitespace ignoring pattern to basic pattern',
    input: 'hello<div>world</div>test',
    expected: 'hello(?:\\s*)<div>(?:\\s*)world(?:\\s*)</div>(?:\\s*)test'
  },
  {
    description: 'should handle pattern with multiple HTML elements',
    input: '<div><span>content</span></div>',
    expected: '(?:\\s*)<div>(?:\\s*)(?:\\s*)<span>(?:\\s*)content(?:\\s*)</span>(?:\\s*)(?:\\s*)</div>(?:\\s*)'
  },
  {
    description: 'should handle pattern with no HTML elements',
    input: 'plain text content',
    expected: 'plain text content'
  },
  {
    description: 'should handle pattern with only opening tags',
    input: 'before<br>after<hr>end',
    expected: 'before(?:\\s*)<br>(?:\\s*)after(?:\\s*)<hr>(?:\\s*)end'
  },
  {
    description: 'should handle empty string',
    input: '',
    expected: ''
  },
  {
    description: 'should handle pattern with mixed content',
    input: 'text<div>nested<span>deep</span>content</div>more',
    expected: 'text(?:\\s*)<div>(?:\\s*)nested(?:\\s*)<span>(?:\\s*)deep(?:\\s*)</span>(?:\\s*)content(?:\\s*)</div>(?:\\s*)more'
  },
  {
    description: 'should handle special characters in pattern',
    input: 'before<div class="test">content</div>after',
    expected: 'before(?:\\s*)<div class="test">(?:\\s*)content(?:\\s*)</div>(?:\\s*)after'
  }
];

describe('RewriteRule.addHtmlWhitespaceIgnoringPattern - リフレクションテスト', () => {
  addHtmlWhitespaceIgnoringPatternCases.forEach((testCase) => {
    it(testCase.description, () => {
      const rule = new RewriteRule(1, 'test', 'replacement', '');
      
      // リフレクションを使ってプライベートメソッドにアクセス
      const result = (rule as any).addHtmlWhitespaceIgnoringPattern(testCase.input);
      
      expect(result).toBe(testCase.expected);
    });
  });
});
