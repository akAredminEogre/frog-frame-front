import { HtmlContent } from 'src/domain/entities/HtmlContent';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { describe, it, expect } from 'vitest';

describe('HtmlContent', () => {
  describe('replaceWith', () => {
    it('should replace all occurrences of oldString with newString', () => {
      const html = '<div>hello world, hello</div>';
      const rule = new RewriteRule('1', 'hello', 'hi', '');
      const content = new HtmlContent(html, rule);
      const result = content.replace();
      expect(result.replacedHtml).toBe('<div>hi world, hi</div>');
    });

    it('should return original html if no match found', () => {
      const html = '<div>hello world</div>';
      const rule = new RewriteRule('1', 'test', 'hi', '');
      const content = new HtmlContent(html, rule);
      const result = content.replace();
      expect(result.replacedHtml).toBe(html);
    });

    it('should handle special characters in oldString', () => {
      const html = '<div>a.b*c+d</div>';
      const rule = new RewriteRule('1', 'a.b*c+d', 'replaced', '');
      const content = new HtmlContent(html, rule);
      const result = content.replace();
      expect(result.replacedHtml).toBe('<div>replaced</div>');
    });

    it('should accept invalid html as oldString in rule', () => {
      const html = '<div>hello</div>';
      const rule = new RewriteRule('1', '<div', 'hi', '');
      const content = new HtmlContent(html, rule);
      expect(() => content.replace()).not.toThrow();
    });

    describe('with regex rule', () => {
      it('should replace based on regex pattern', () => {
        const html = '<h1>hello</h1><h2>world</h2>';
        const rule = new RewriteRule('1', '<h1>(.*?)</h1>', '<h3>$1</h3>', "", true);
        const content = new HtmlContent(html, rule);
        const result = content.replace();
        expect(result.replacedHtml).toBe('<h3>hello</h3><h2>world</h2>');
      });

      it('should handle multiple matches', () => {
        const html = '<h1>hello</h1><h1>world</h1>';
        const rule = new RewriteRule('1', '<h1>(.*?)</h1>', '<h3>$1</h3>', "", true);
        const content = new HtmlContent(html, rule);
        const result = content.replace();
        expect(result.replacedHtml).toBe('<h3>hello</h3><h3>world</h3>');
      });

      it('should not replace if pattern does not match', () => {
        const html = '<div>hello</div>';
        const rule = new RewriteRule('1', '<h1>(.*?)</h1>', '<h3>$1</h3>', "", true);
        const content = new HtmlContent(html, rule);
        const result = content.replace();
        expect(result.replacedHtml).toBe(html);
      });

      it('should handle the manual test case pattern', () => {
        const html = '<h1>アジャイルソフトウェア開発宣言</h1>';
        const rule = new RewriteRule('1', '<h1>(.+?)</h1>', '<h2>$1</h2>', "", true);
        const content = new HtmlContent(html, rule);
        const result = content.replace();
        expect(result.replacedHtml).toBe('<h2>アジャイルソフトウェア開発宣言</h2>');
      });

  it('should handle the incorrect manual test case pattern', () => {
    const html = '<h1>アジャイルソフトウェア開発宣言</h1>';
    const rule = new RewriteRule('1', '<h1>(.+?)</h1>', '<h1>$1</h1>', "", true); // 手動テストでの誤った設定
    const content = new HtmlContent(html, rule);
    const result = content.replace();
    expect(result.replacedHtml).toBe('<h1>アジャイルソフトウェア開発宣言</h1>');
  });

  it('should handle multiline HTML tags with s flag', () => {
    const html = `<h1>アジャイルソフトウェア開発宣言
</h1>`;
    const rule = new RewriteRule('1', '<h1>(.+?)</h1>', '<h2>$1</h2>', "", true);
    const content = new HtmlContent(html, rule);
    const result = content.replace();
    expect(result.replacedHtml).toBe(`<h2>アジャイルソフトウェア開発宣言</h2>`);
  });
    });
  });
});
