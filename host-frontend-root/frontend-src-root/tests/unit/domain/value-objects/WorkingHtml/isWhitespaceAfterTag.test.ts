import { WorkingHtml } from 'src/domain/value-objects/WorkingHtml';
import { describe, it, expect } from 'vitest';

describe('WorkingHtml', () => {
  describe('isWhitespaceAfterTag', () => {
    it('should return true when there is whitespace after a tag', () => {
      const workingHtml = new WorkingHtml('<div> hello');
      expect(workingHtml.isWhitespaceAfterTag(5)).toBe(true); // At space after >
    });

    it('should return false when there is no whitespace after a tag', () => {
      const workingHtml = new WorkingHtml('<div>hello');
      expect(workingHtml.isWhitespaceAfterTag(5)).toBe(false); // At 'h' after >
    });

    it('should return false when at the beginning of string', () => {
      const workingHtml = new WorkingHtml('> hello');
      expect(workingHtml.isWhitespaceAfterTag(0)).toBe(false); // At beginning
    });

    it('should return false for non-whitespace characters', () => {
      const workingHtml = new WorkingHtml('hello world');
      expect(workingHtml.isWhitespaceAfterTag(5)).toBe(false); // At space (not after >)
      expect(workingHtml.isWhitespaceAfterTag(7)).toBe(false); // At 'o'
    });
  });
});
