import { HtmlContent } from 'src/domain/entities/HtmlContent';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * HtmlContent正規表現パターンでのキャプチャグループ置換テスト
 * 正規表現を使ったキャプチャグループ機能の検証
 */
describe('HtmlContent - 正規表現パターンでのキャプチャグループ置換', () => {
  /**
   * 正規表現パターンでのキャプチャグループ置換テストケース
   * input: テスト入力データ（html, rewriteRule）
   * expected: 期待される結果（replacedHtml）
   */
  const regexPatternTestCases = [
    {
      description: '正規表現でISBN番号を取得してリンクに置換する',
      input: {
        html: '<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue">9784065396209</span></li>',
        rewriteRule: {
          id: 'test-rule-1',
          oldString: '<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue">(.+?)</span></li>',
          newString: '<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue"><a href="https://www01.hanmoto.com/bd/isbn/$1">$1</a></span></li>',
          url: 'https://books.rakuten.co.jp',
          isRegex: true
        }
      },
      expected: {
        replacedHtml: '<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue"><a href="https://www01.hanmoto.com/bd/isbn/9784065396209">9784065396209</a></span></li>'
      }
    },
    {
      description: '正規表現で改行を含むHTMLでもキャプチャグループが正しく動作する',
      input: {
        html: `<li class="productInfo">
        <span class="category">ISBN</span>：&nbsp;&nbsp;
        <span class="categoryValue">9784065396209</span>
      </li>`,
        rewriteRule: {
          id: 'test-rule-2',
          oldString: '<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue">(.+?)</span></li>',
          newString: '<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue"><a href="https://www01.hanmoto.com/bd/isbn/$1">$1</a></span></li>',
          url: 'https://books.rakuten.co.jp',
          isRegex: true
        }
      },
      expected: {
        replacedHtml: '<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue"><a href="https://www01.hanmoto.com/bd/isbn/9784065396209">9784065396209</a></span></li>'
      }
    },
    {
      description: '複数のキャプチャグループを使用した正規表現置換',
      input: {
        html: '<div><span class="title">書籍名</span><span class="isbn">9784065396209</span></div>',
        rewriteRule: {
          id: 'test-rule-3',
          oldString: '<div><span class="title">(.+?)</span><span class="isbn">(.+?)</span></div>',
          newString: '<div><span class="title">$1</span><span class="isbn"><a href="https://www01.hanmoto.com/bd/isbn/$2">$2</a></span></div>',
          url: 'https://books.rakuten.co.jp',
          isRegex: true
        }
      },
      expected: {
        replacedHtml: '<div><span class="title">書籍名</span><span class="isbn"><a href="https://www01.hanmoto.com/bd/isbn/9784065396209">9784065396209</a></span></div>'
      }
    }
  ];

  /**
   * 正規表現パターンでのキャプチャグループ置換の検証
   * 1. ISBN番号の正規表現リンク置換
   * 2. 改行含むHTMLでのキャプチャグループ動作
   * 3. 複数キャプチャグループの正規表現置換
   */
  regexPatternTestCases.forEach((testCase) => {
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
