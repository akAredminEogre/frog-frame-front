import { HtmlContent } from 'src/domain/entities/HtmlContent';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * HtmlContent通常文字列での置換テスト
 * 通常文字列での置換機能の回帰テスト
 */
describe('HtmlContent - 通常文字列での置換の回帰テスト', () => {
  /**
   * 通常文字列での置換テストケース
   * input: テスト入力データ（html, rewriteRule）
   * expected: 期待される結果（replacedHtml）
   */
  const stringPatternTestCases = [
    {
      description: '通常文字列での置換が正しく動作する',
      input: {
        html: '<div class="test">元のテキスト</div>',
        rewriteRule: {
          id: 'test-rule-4',
          oldString: '<div class="test">元のテキスト</div>',
          newString: '<div class="test">置換されたテキスト</div>',
          url: 'https://example.com',
          isRegex: false
        }
      },
      expected: {
        replacedHtml: '<div class="test">置換されたテキスト</div>'
      }
    },
    {
      description: '通常文字列で改行を含むHTMLでも置換が動作する',
      input: {
        html: `<div class="test">
        元のテキスト
      </div>`,
        rewriteRule: {
          id: 'test-rule-5',
          oldString: '<div class="test">元のテキスト</div>',
          newString: '<div class="test">置換されたテキスト</div>',
          url: 'https://example.com',
          isRegex: false
        }
      },
      expected: {
        replacedHtml: '<div class="test">置換されたテキスト</div>'
      }
    }
  ];

  /**
   * 通常文字列での置換の検証
   * 1. 基本的な文字列置換動作
   * 2. 改行含むHTMLでの文字列置換動作
   */
  stringPatternTestCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Arrange
      const rule = new RewriteRule(
        testCase.input.rewriteRule.id,
        testCase.input.rewriteRule.oldString,
        testCase.input.rewriteRule.newString,
        testCase.input.rewriteRule.url,
        testCase.input.rewriteRule.isRegex
      );
      const htmlContent = new HtmlContent(testCase.input.html, rule);

      // Act
      const result = htmlContent.replace();

      // Assert
      expect(result.replacedHtml).toBe(testCase.expected.replacedHtml);
    });
  });
});
