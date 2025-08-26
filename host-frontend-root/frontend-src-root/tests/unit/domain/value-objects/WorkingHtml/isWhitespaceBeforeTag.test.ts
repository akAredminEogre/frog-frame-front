import { WorkingHtml } from 'src/domain/value-objects/WorkingHtml';
import { describe, it, expect } from 'vitest';

describe('WorkingHtml', () => {
  describe('isWhitespaceBeforeTag', () => {
    it('should return true when there is whitespace before a tag', () => {
      const workingHtml = new WorkingHtml('hello <div>');
      expect(workingHtml.isWhitespaceBeforeTag(5)).toBe(true); // At space before <
    });

    it('should return false when there is no whitespace before a tag', () => {
      const workingHtml = new WorkingHtml('hello<div>');
      expect(workingHtml.isWhitespaceBeforeTag(4)).toBe(false); // At 'o' before <
    });

    it('should return false when at the end of string', () => {
      const workingHtml = new WorkingHtml('hello ');
      expect(workingHtml.isWhitespaceBeforeTag(5)).toBe(false); // At space at end
    });

    it('should return false for non-whitespace characters', () => {
      const workingHtml = new WorkingHtml('hello world');
      expect(workingHtml.isWhitespaceBeforeTag(0)).toBe(false); // At 'h'
      expect(workingHtml.isWhitespaceBeforeTag(6)).toBe(false); // At 'w'
    });
  });
});
