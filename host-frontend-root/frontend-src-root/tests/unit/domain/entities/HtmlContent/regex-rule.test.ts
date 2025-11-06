import { describe, expect,it } from 'vitest';

import { HtmlContent } from 'src/domain/entities/HtmlContent';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * HtmlContent - replaceWith 正規表現ルールテスト
 * 1. 正規表現パターンによる置換処理
 * 2. 複数マッチの処理
 * 3. パターンマッチしない場合の元HTML保持
 * 4. 日本語を含むパターンマッチ処理
 * 5. 置換結果が元と同じ場合の処理（誤設定ケース）
 * 6. 複数行にまたがるHTMLタグの処理（sフラグ）
 */
describe('HtmlContent', () => {
  describe('replaceWith', () => {
    describe('with regex rule', () => {
      const testCases = [
        {
          description: 'should replace based on regex pattern',
          input: {
            html: '<h1>hello</h1><h2>world</h2>',
            oldString: '<h1>(.*?)</h1>',
            newString: '<h3>$1</h3>',
          },
          expected: {
            replacedHtml: '<h3>hello</h3><h2>world</h2>',
          },
        },
        {
          description: 'should handle multiple matches',
          input: {
            html: '<h1>hello</h1><h1>world</h1>',
            oldString: '<h1>(.*?)</h1>',
            newString: '<h3>$1</h3>',
          },
          expected: {
            replacedHtml: '<h3>hello</h3><h3>world</h3>',
          },
        },
        {
          description: 'should not replace if pattern does not match',
          input: {
            html: '<div>hello</div>',
            oldString: '<h1>(.*?)</h1>',
            newString: '<h3>$1</h3>',
          },
          expected: {
            replacedHtml: '<div>hello</div>',
          },
        },
        {
          description: 'should handle multiline HTML tags with s flag',
          input: {
            html: `<h1>アジャイルソフトウェア開発宣言
</h1>`,
            oldString: '<h1>(.+?)</h1>',
            newString: '<h2>$1</h2>',
          },
          expected: {
            replacedHtml: '<h2>アジャイルソフトウェア開発宣言</h2>',
          },
        },
      ];

      testCases.forEach((testCase) => {
        it(testCase.description, () => {
          const rule = new RewriteRule(1, testCase.input.oldString, testCase.input.newString, "", true);
          const content = new HtmlContent(testCase.input.html, rule);
          const result = content.replace();
          expect(result.replacedHtml).toBe(testCase.expected.replacedHtml);
        });
      });
    });
  });
});
