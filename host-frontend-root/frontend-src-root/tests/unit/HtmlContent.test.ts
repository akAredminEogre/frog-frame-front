import { HtmlContent } from '../../src/domain/entities/HtmlContent';
import { RewriteRule } from '../../src/domain/entities/RewriteRule';

describe('HtmlContent', () => {
  describe('正規表現パターンでのキャプチャグループ置換', () => {
    it('正規表現でISBN番号を取得してリンクに置換する', () => {
      // Arrange
      const html = '<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue">9784065396209</span></li>';
      const rule = new RewriteRule(
        'test-rule-1', // id
        '<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue">(.+?)</span></li>',
        '<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue"><a href="https://www01.hanmoto.com/bd/isbn/$1">$1</a></span></li>',
        'https://books.rakuten.co.jp',
        true // 正規表現フラグ
      );
      const htmlContent = new HtmlContent(html, rule);

      // Act
      const result = htmlContent.replace();

      // Assert
      expect(result.replacedHtml).toBe(
        '<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue"><a href="https://www01.hanmoto.com/bd/isbn/9784065396209">9784065396209</a></span></li>'
      );
    });

    it('正規表現で改行を含むHTMLでもキャプチャグループが正しく動作する', () => {
      // Arrange
      const html = `<li class="productInfo">
        <span class="category">ISBN</span>：&nbsp;&nbsp;
        <span class="categoryValue">9784065396209</span>
      </li>`;
      const rule = new RewriteRule(
        'test-rule-2', // id
        '<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue">(.+?)</span></li>',
        '<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue"><a href="https://www01.hanmoto.com/bd/isbn/$1">$1</a></span></li>',
        'https://books.rakuten.co.jp',
        true
      );
      const htmlContent = new HtmlContent(html, rule);

      // Act
      const result = htmlContent.replace();

      // Assert
      expect(result.replacedHtml).toContain('<a href="https://www01.hanmoto.com/bd/isbn/9784065396209">9784065396209</a>');
    });

    it('複数のキャプチャグループを使用した正規表現置換', () => {
      // Arrange
      const html = '<div><span class="title">書籍名</span><span class="isbn">9784065396209</span></div>';
      const rule = new RewriteRule(
        'test-rule-3', // id
        '<div><span class="title">(.+?)</span><span class="isbn">(.+?)</span></div>',
        '<div><span class="title">$1</span><span class="isbn"><a href="https://www01.hanmoto.com/bd/isbn/$2">$2</a></span></div>',
        'https://books.rakuten.co.jp',
        true
      );
      const htmlContent = new HtmlContent(html, rule);

      // Act
      const result = htmlContent.replace();

      // Assert
      expect(result.replacedHtml).toBe(
        '<div><span class="title">書籍名</span><span class="isbn"><a href="https://www01.hanmoto.com/bd/isbn/9784065396209">9784065396209</a></span></div>'
      );
    });
  });

  describe('通常文字列での置換の回帰テスト', () => {
    it('通常文字列での置換が正しく動作する', () => {
      // Arrange
      const html = '<div class="test">元のテキスト</div>';
      const rule = new RewriteRule(
        'test-rule-4', // id
        '<div class="test">元のテキスト</div>',
        '<div class="test">置換されたテキスト</div>',
        'https://example.com',
        false // 通常文字列
      );
      const htmlContent = new HtmlContent(html, rule);

      // Act
      const result = htmlContent.replace();

      // Assert
      expect(result.replacedHtml).toBe('<div class="test">置換されたテキスト</div>');
    });

    it('通常文字列で改行を含むHTMLでも置換が動作する', () => {
      // Arrange
      const html = `<div class="test">
        元のテキスト
      </div>`;
      const rule = new RewriteRule(
        'test-rule-5', // id
        '<div class="test">元のテキスト</div>',
        '<div class="test">置換されたテキスト</div>',
        'https://example.com',
        false
      );
      const htmlContent = new HtmlContent(html, rule);

      // Act
      const result = htmlContent.replace();

      // Assert
      expect(result.replacedHtml).toBe('<div class="test">置換されたテキスト</div>');
    });
  });
});
