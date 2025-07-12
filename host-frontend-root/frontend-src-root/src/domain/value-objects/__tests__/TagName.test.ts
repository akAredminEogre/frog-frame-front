import { TagName } from '../TagName';
import { describe, it, expect } from 'vitest';

describe('TagName', () => {
  describe('constructor', () => {
    it('should create an instance for a valid tag name', () => {
      expect(() => new TagName('div')).not.toThrow();
    });

    it('should convert tag name to lower case', () => {
      const tagName = new TagName('DIV');
      expect(tagName.toString()).toBe('div');
    });

    it('should throw an error for an invalid tag name with numbers at the start', () => {
      expect(() => new TagName('1div')).toThrow('Invalid tag name');
    });

    it('should throw an error for an invalid tag name with special characters', () => {
      expect(() => new TagName('div!')).toThrow('Invalid tag name');
    });

    it('should throw an error for an empty string', () => {
      expect(() => new TagName('')).toThrow('Invalid tag name');
    });
  });

  describe('toString', () => {
    it('should return the lower-cased string value', () => {
      const tagName = new TagName('Header');
      expect(tagName.toString()).toBe('header');
    });
  });

  describe('equals', () => {
    it('should return true for equal TagName objects', () => {
      const tag1 = new TagName('p');
      const tag2 = new TagName('P');
      expect(tag1.equals(tag2)).toBe(true);
    });

    it('should return false for different TagName objects', () => {
      const tag1 = new TagName('p');
      const tag2 = new TagName('div');
      expect(tag1.equals(tag2)).toBe(false);
    });
  });

  describe('isTableRelated', () => {
    it('should return true for table related tags', () => {
      const tags = ['tr', 'td', 'th', 'tbody', 'thead', 'tfoot', 'caption'];
      tags.forEach(tag => {
        const tagName = new TagName(tag);
        expect(tagName.isTableRelated()).toBe(true);
      });
    });

    it('should return false for non-table related tags', () => {
      const tagName = new TagName('div');
      expect(tagName.isTableRelated()).toBe(false);
    });
  });
});
