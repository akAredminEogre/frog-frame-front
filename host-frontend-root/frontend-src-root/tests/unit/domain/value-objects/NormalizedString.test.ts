import { NormalizedString } from 'src/domain/value-objects/NormalizedString';
import { describe, it, expect } from 'vitest';

describe('NormalizedString', () => {
  describe('constructor and normalization', () => {
    it('should normalize whitespace around HTML tags only', () => {
      const normalizedString = new NormalizedString('  <h1>test\n content</h1>  ');
      expect(normalizedString.toString()).toBe('<h1>test\n content</h1>');
    });

    it('should remove whitespace before opening tags', () => {
      const normalizedString = new NormalizedString('   <div>content</div>');
      expect(normalizedString.toString()).toBe('<div>content</div>');
    });

    it('should remove whitespace after closing tags', () => {
      const normalizedString = new NormalizedString('<span>content</span>   ');
      expect(normalizedString.toString()).toBe('<span>content</span>');
    });

    it('should preserve whitespace in attributes', () => {
      const normalizedString = new NormalizedString('  <div class="test class">content</div>  ');
      expect(normalizedString.toString()).toBe('<div class="test class">content</div>');
    });

    it('should preserve whitespace in text content', () => {
      const normalizedString = new NormalizedString('<p>hello world</p>');
      expect(normalizedString.toString()).toBe('<p>hello world</p>');
    });

    it('should handle nested tags with whitespace', () => {
      const normalizedString = new NormalizedString('  <div>  <p>content</p>  </div>  ');
      expect(normalizedString.toString()).toBe('<div><p>content</p></div>');
    });

    it('should handle empty string', () => {
      const normalizedString = new NormalizedString('');
      expect(normalizedString.toString()).toBe('');
    });

    it('should preserve whitespace when no HTML tags present', () => {
      const normalizedString = new NormalizedString('   \n\t  ');
      expect(normalizedString.toString()).toBe('   \n\t  ');
    });

    it('should preserve text-only content with spaces', () => {
      const normalizedString = new NormalizedString('hello world');
      expect(normalizedString.toString()).toBe('hello world');
    });
  });

  describe('equals', () => {
    it('should return true for strings with same normalized content', () => {
      const str1 = new NormalizedString('  <h1>アジャイルソフトウェア開発宣言</h1>  ');
      const str2 = new NormalizedString('\n  <h1>アジャイルソフトウェア開発宣言</h1>\n  ');
      expect(str1.equals(str2)).toBe(true);
    });

    it('should return false for strings with different content', () => {
      const str1 = new NormalizedString('<h1>test1</h1>');
      const str2 = new NormalizedString('<h1>test2</h1>');
      expect(str1.equals(str2)).toBe(false);
    });

    it('should return false for strings with different whitespace in content', () => {
      const str1 = new NormalizedString('<h1>test content</h1>');
      const str2 = new NormalizedString('<h1>testcontent</h1>');
      expect(str1.equals(str2)).toBe(false);
    });

    it('should handle complex whitespace differences around tags', () => {
      const str1 = new NormalizedString('  <div>\n  <p>content</p>\n</div>  ');
      const str2 = new NormalizedString('<div><p>content</p></div>');
      expect(str1.equals(str2)).toBe(true);
    });
  });

  describe('indexOf', () => {
    it('should find normalized string in normalized content', () => {
      const haystack = new NormalizedString('  <h1>アジャイルソフトウェア開発宣言</h1>  ');
      const needle = new NormalizedString('アジャイルソフトウェア開発宣言');
      expect(haystack.indexOf(needle)).toBe(4); // '<h1>' has 4 characters
    });

    it('should return -1 when string is not found', () => {
      const haystack = new NormalizedString('<h1>test content</h1>');
      const needle = new NormalizedString('notfound');
      expect(haystack.indexOf(needle)).toBe(-1);
    });

    it('should find string at beginning', () => {
      const haystack = new NormalizedString('test content');
      const needle = new NormalizedString('test');
      expect(haystack.indexOf(needle)).toBe(0);
    });

    it('should find string with whitespace preserved', () => {
      const haystack = new NormalizedString('<p>hello world</p>');
      const needle = new NormalizedString('hello world');
      expect(haystack.indexOf(needle)).toBe(3); // '<p>' has 3 characters
    });
  });

  describe('replace', () => {
    it('should replace normalized string in normalized content', () => {
      const original = new NormalizedString('<h1>test content</h1>');
      const searchString = new NormalizedString('test');
      const result = original.replace(searchString, 'replaced');
      expect(result).toBe('<h1>replaced content</h1>');
    });

    it('should replace first occurrence only', () => {
      const original = new NormalizedString('test test test');
      const searchString = new NormalizedString('test');
      const result = original.replace(searchString, 'replaced');
      expect(result).toBe('replaced test test');
    });

    it('should return original string if search string not found', () => {
      const original = new NormalizedString('original content');
      const searchString = new NormalizedString('notfound');
      const result = original.replace(searchString, 'replacement');
      expect(result).toBe('original content');
    });
  });

  describe('toString', () => {
    it('should return the normalized string value', () => {
      const html = '<div>\n  <p>test</p>\n</div>';
      const normalizedString = new NormalizedString(html);
      expect(normalizedString.toString()).toBe('<div><p>test</p></div>');
    });

    it('should consistently return the same value', () => {
      const normalizedString = new NormalizedString('  <span>  content  </span>  ');
      const firstCall = normalizedString.toString();
      const secondCall = normalizedString.toString();
      expect(firstCall).toBe(secondCall);
      expect(firstCall).toBe('<span>content</span>');
    });
  });
});
