import { NormalizedString } from 'src/domain/value-objects/NormalizedString';
import { describe, it, expect } from 'vitest';

describe('NormalizedString', () => {
  describe('constructor and normalization', () => {
    it('should normalize whitespace characters', () => {
      const normalizedString = new NormalizedString('<h1>test\n content</h1>');
      expect(normalizedString.toString()).toBe('<h1>testcontent</h1>');
    });

    it('should remove multiple spaces', () => {
      const normalizedString = new NormalizedString('<div>   multiple    spaces   </div>');
      expect(normalizedString.toString()).toBe('<div>multiplespaces</div>');
    });

    it('should remove tabs and newlines', () => {
      const normalizedString = new NormalizedString('<span>\t\n  test\t\n</span>');
      expect(normalizedString.toString()).toBe('<span>test</span>');
    });

    it('should handle empty string', () => {
      const normalizedString = new NormalizedString('');
      expect(normalizedString.toString()).toBe('');
    });

    it('should handle only whitespace', () => {
      const normalizedString = new NormalizedString('   \n\t  ');
      expect(normalizedString.toString()).toBe('');
    });

    it('should preserve non-whitespace characters', () => {
      const normalizedString = new NormalizedString('hello world');
      expect(normalizedString.toString()).toBe('helloworld');
    });
  });

  describe('equals', () => {
    it('should return true for strings with same normalized content', () => {
      const str1 = new NormalizedString('<h1>アジャイルソフトウェア開発宣言</h1>');
      const str2 = new NormalizedString('<h1>アジャイルソフトウェア\n開発宣言</h1>');
      expect(str1.equals(str2)).toBe(true);
    });

    it('should return false for strings with different normalized content', () => {
      const str1 = new NormalizedString('<h1>test1</h1>');
      const str2 = new NormalizedString('<h1>test2</h1>');
      expect(str1.equals(str2)).toBe(false);
    });

    it('should handle complex whitespace differences', () => {
      const str1 = new NormalizedString('<div>\n  <p>content</p>\n</div>');
      const str2 = new NormalizedString('<div><p>content</p></div>');
      expect(str1.equals(str2)).toBe(true);
    });
  });

  describe('indexOf', () => {
    it('should find normalized string in normalized content', () => {
      const haystack = new NormalizedString('<h1>\nアジャイルソフトウェア\n開発宣言\n</h1>');
      const needle = new NormalizedString('アジャイルソフトウェア開発宣言');
      expect(haystack.indexOf(needle)).toBe(4); // '<h1>' has 4 characters
    });

    it('should return -1 when string is not found', () => {
      const haystack = new NormalizedString('<h1>test content</h1>');
      const needle = new NormalizedString('notfound');
      expect(haystack.indexOf(needle)).toBe(-1);
    });

    it('should find string at beginning', () => {
      const haystack = new NormalizedString('testcontent');
      const needle = new NormalizedString('test');
      expect(haystack.indexOf(needle)).toBe(0);
    });
  });

  describe('replace', () => {
    it('should replace normalized string in normalized content', () => {
      const original = new NormalizedString('<h1>test content</h1>');
      const searchString = new NormalizedString('test');
      const result = original.replace(searchString, 'replaced');
      expect(result).toBe('<h1>replacedcontent</h1>');
    });

    it('should replace first occurrence only', () => {
      const original = new NormalizedString('test test test');
      const searchString = new NormalizedString('test');
      const result = original.replace(searchString, 'replaced');
      expect(result).toBe('replacedtesttest');
    });

    it('should return original string if search string not found', () => {
      const original = new NormalizedString('original content');
      const searchString = new NormalizedString('notfound');
      const result = original.replace(searchString, 'replacement');
      expect(result).toBe('originalcontent');
    });
  });

  describe('toString', () => {
    it('should return the normalized string value', () => {
      const html = '<div>\n  <p>test</p>\n</div>';
      const normalizedString = new NormalizedString(html);
      expect(normalizedString.toString()).toBe('<div><p>test</p></div>');
    });

    it('should consistently return the same value', () => {
      const normalizedString = new NormalizedString('<span>  content  </span>');
      const firstCall = normalizedString.toString();
      const secondCall = normalizedString.toString();
      expect(firstCall).toBe(secondCall);
      expect(firstCall).toBe('<span>content</span>');
    });
  });
});
