import { WorkingHtml } from 'src/domain/value-objects/WorkingHtml';
import { RewriteRule } from 'src/domain/entities/RewriteRule';
import { describe, it, expect } from 'vitest';

describe('WorkingHtml', () => {
  describe('isWhitespaceAfterTag', () => {
    it('should return true when there is whitespace after a tag', () => {
      const rule = new RewriteRule('test-id', 'old', 'new');
      const workingHtml = new WorkingHtml('<div> hello', rule);
      expect(workingHtml.isWhitespaceAfterTag(5)).toBe(true); // At space after >
    });

    it('should return false when there is no whitespace after a tag', () => {
      const rule = new RewriteRule('test-id', 'old', 'new');
      const workingHtml = new WorkingHtml('<div>hello', rule);
      expect(workingHtml.isWhitespaceAfterTag(5)).toBe(false); // At 'h' after >
    });

    it('should return false when at the beginning of string', () => {
      const rule = new RewriteRule('test-id', 'old', 'new');
      const workingHtml = new WorkingHtml('> hello', rule);
      expect(workingHtml.isWhitespaceAfterTag(0)).toBe(false); // At beginning
    });

    it('should return false for non-whitespace characters', () => {
      const rule = new RewriteRule('test-id', 'old', 'new');
      const workingHtml = new WorkingHtml('hello world', rule);
      expect(workingHtml.isWhitespaceAfterTag(5)).toBe(false); // At space (not after >)
      expect(workingHtml.isWhitespaceAfterTag(7)).toBe(false); // At 'o'
    });
  });
});
