import { HtmlContent } from 'src/domain/entities/HtmlContent';
import { RewriteRule } from 'src/domain/entities/RewriteRule';
import { describe, it, expect } from 'vitest';

describe('HtmlContent', () => {
  describe('replaceWith', () => {
    it('should replace all occurrences of oldString with newString', () => {
      const html = '<div>hello world, hello</div>';
      const rule: RewriteRule = { id: '1', oldString: 'hello', newString: 'hi' };
      const content = new HtmlContent(html, rule);
      const result = content.replace();
      expect(result.replacedHtml).toBe('<div>hi world, hi</div>');
      expect(result.matchCount).toBe(2);
    });

    it('should return original html if no match found', () => {
      const html = '<div>hello world</div>';
      const rule: RewriteRule = { id: '1', oldString: 'test', newString: 'hi' };
      const content = new HtmlContent(html, rule);
      const result = content.replace();
      expect(result.replacedHtml).toBe(html);
      expect(result.matchCount).toBe(0);
    });

    it('should handle special characters in oldString', () => {
      const html = '<div>a.b*c+d</div>';
      const rule: RewriteRule = { id: '1', oldString: 'a.b*c+d', newString: 'replaced' };
      const content = new HtmlContent(html, rule);
      const result = content.replace();
      expect(result.replacedHtml).toBe('<div>replaced</div>');
      expect(result.matchCount).toBe(1);
    });

    it('should accept invalid html as oldString in rule', () => {
      const html = '<div>hello</div>';
      const rule: RewriteRule = { id: '1', oldString: '<div', newString: 'hi' };
      const content = new HtmlContent(html, rule);
      expect(() => content.replace()).not.toThrow();
    });

    describe('with regex rule', () => {
      it('should replace based on regex pattern', () => {
        const html = '<h1>hello</h1><h2>world</h2>';
        const rule: RewriteRule = {
          id: '1',
          oldString: '<h1>(.*?)</h1>',
          newString: '<h3>$1</h3>',
          isRegex: true,
        };
        const content = new HtmlContent(html, rule);
        const result = content.replace();
        expect(result.replacedHtml).toBe('<h3>hello</h3><h2>world</h2>');
        expect(result.matchCount).toBe(1);
      });

      it('should handle multiple matches', () => {
        const html = '<h1>hello</h1><h1>world</h1>';
        const rule: RewriteRule = {
          id: '1',
          oldString: '<h1>(.*?)</h1>',
          newString: '<h3>$1</h3>',
          isRegex: true,
        };
        const content = new HtmlContent(html, rule);
        const result = content.replace();
        expect(result.replacedHtml).toBe('<h3>hello</h3><h3>world</h3>');
        expect(result.matchCount).toBe(2);
      });

      it('should not replace if pattern does not match', () => {
        const html = '<div>hello</div>';
        const rule: RewriteRule = {
          id: '1',
          oldString: '<h1>(.*?)</h1>',
          newString: '<h3>$1</h3>',
          isRegex: true,
        };
        const content = new HtmlContent(html, rule);
        const result = content.replace();
        expect(result.replacedHtml).toBe(html);
        expect(result.matchCount).toBe(0);
      });

      it('should handle the manual test case pattern', () => {
        const html = '<h1>アジャイルソフトウェア開発宣言</h1>';
        const rule: RewriteRule = {
          id: '1',
          oldString: '<h1>(.+?)</h1>',
          newString: '<h2>$1</h2>',
          isRegex: true,
        };
        const content = new HtmlContent(html, rule);
        const result = content.replace();
        expect(result.replacedHtml).toBe('<h2>アジャイルソフトウェア開発宣言</h2>');
        expect(result.matchCount).toBe(1);
      });

  it('should handle the incorrect manual test case pattern', () => {
    const html = '<h1>アジャイルソフトウェア開発宣言</h1>';
    const rule: RewriteRule = {
      id: '1',
      oldString: '<h1>(.+?)</h1>',
      newString: '<h1>$1</h1>',  // 手動テストでの誤った設定
      isRegex: true,
    };
    const content = new HtmlContent(html, rule);
    const result = content.replace();
    expect(result.replacedHtml).toBe('<h1>アジャイルソフトウェア開発宣言</h1>');
    expect(result.matchCount).toBe(1);
  });

  it('should handle multiline HTML tags with s flag', () => {
    const html = `<h1>アジャイルソフトウェア開発宣言
</h1>`;
    const rule: RewriteRule = {
      id: '1',
      oldString: '<h1>(.+?)</h1>',
      newString: '<h2>$1</h2>',
      isRegex: true,
    };
    const content = new HtmlContent(html, rule);
    const result = content.replace();
    expect(result.replacedHtml).toBe(`<h2>アジャイルソフトウェア開発宣言
</h2>`);
    expect(result.matchCount).toBe(1);
  });
    });
  });
});
