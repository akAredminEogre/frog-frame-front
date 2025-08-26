import { WorkingHtml } from 'src/domain/value-objects/WorkingHtml';
import { RewriteRule } from 'src/domain/entities/RewriteRule';
import { describe, it, expect } from 'vitest';

describe('WorkingHtml', () => {
  describe('isWhitespaceBeforeTag', () => {
    it('should return true when there is whitespace before a tag', () => {
      const rule = new RewriteRule('test-id', 'old', 'new');
      const workingHtml = new WorkingHtml('hello <div>', rule);
      expect(workingHtml.isWhitespaceBeforeTag(5)).toBe(true); // At space before <
    });

    it('should return false when there is no whitespace before a tag', () => {
      const rule = new RewriteRule('test-id', 'old', 'new');
      const workingHtml = new WorkingHtml('hello<div>', rule);
      expect(workingHtml.isWhitespaceBeforeTag(4)).toBe(false); // At 'o' before <
    });

    it('should return false when at the end of string', () => {
      const rule = new RewriteRule('test-id', 'old', 'new');
      const workingHtml = new WorkingHtml('hello ', rule);
      expect(workingHtml.isWhitespaceBeforeTag(5)).toBe(false); // At space at end
    });

    it('should return false for non-whitespace characters', () => {
      const rule = new RewriteRule('test-id', 'old', 'new');
      const workingHtml = new WorkingHtml('hello world', rule);
      expect(workingHtml.isWhitespaceBeforeTag(0)).toBe(false); // At 'h'
      expect(workingHtml.isWhitespaceBeforeTag(6)).toBe(false); // At 'w'
    });
  });
});
