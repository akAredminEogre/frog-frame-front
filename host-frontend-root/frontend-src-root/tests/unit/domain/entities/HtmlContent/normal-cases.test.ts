import { HtmlContent } from 'src/domain/entities/HtmlContent';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { describe, it, expect } from 'vitest';

/**
 * HtmlContent - replaceWith 正常系テスト
 * 1. 複数出現する文字列の全置換
 * 2. マッチしない場合の元HTML保持
 * 3. 特殊文字を含むoldStringの置換処理
 */
describe('HtmlContent', () => {
  describe('replaceWith', () => {
    const testCases = [
      {
        description: 'should replace all occurrences of oldString with newString',
        input: {
          html: '<div>hello world, hello</div>',
          oldString: 'hello',
          newString: 'hi',
        },
        expected: {
          replacedHtml: '<div>hi world, hi</div>',
        },
      },
      {
        description: 'should return original html if no match found',
        input: {
          html: '<div>hello world</div>',
          oldString: 'test',
          newString: 'hi',
        },
        expected: {
          replacedHtml: '<div>hello world</div>',
        },
      },
      {
        description: 'should handle special characters in oldString',
        input: {
          html: '<div>a.b*c+d</div>',
          oldString: 'a.b*c+d',
          newString: 'replaced',
        },
        expected: {
          replacedHtml: '<div>replaced</div>',
        },
      },
    ];

    testCases.forEach((testCase) => {
      it(testCase.description, () => {
        const rule = new RewriteRule(1, testCase.input.oldString, testCase.input.newString, '');
        const content = new HtmlContent(testCase.input.html, rule);
        const result = content.replace();
        expect(result.replacedHtml).toBe(testCase.expected.replacedHtml);
      });
    });
  });
});
