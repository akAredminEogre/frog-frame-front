import { HtmlString } from '../HtmlString';
import { describe, it, expect } from 'vitest';

describe('HtmlString', () => {
  describe('constructor', () => {
    it('should create an instance for a valid HTML string', () => {
      expect(() => new HtmlString('<div>hello</div>')).not.toThrow();
    });

  });

  describe('toString', () => {
    it('should return the original string value', () => {
      const html = '<div><p>test</p></div>';
      const htmlString = new HtmlString(html);
      expect(htmlString.toString()).toBe(html);
    });
  });

  describe('equals', () => {
    it('should return true for equal HtmlString objects', () => {
      const html1 = new HtmlString('<span>test</span>');
      const html2 = new HtmlString('<span>test</span>');
      expect(html1.equals(html2)).toBe(true);
    });

    it('should return false for different HtmlString objects', () => {
      const html1 = new HtmlString('<a>test</a>');
      const html2 = new HtmlString('<b>test</b>');
      expect(html1.equals(html2)).toBe(false);
    });
  });

});
