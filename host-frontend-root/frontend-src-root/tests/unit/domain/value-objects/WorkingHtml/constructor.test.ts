import { WorkingHtml } from 'src/domain/value-objects/WorkingHtml';
import { RewriteRule } from 'src/domain/entities/RewriteRule';
import { describe, it, expect } from 'vitest';

describe('WorkingHtml', () => {
  describe('constructor', () => {
    it('should create an instance for a valid HTML string', () => {
      const rule = new RewriteRule('test-id', 'old', 'new');
      expect(() => new WorkingHtml('<div>hello</div>', rule)).not.toThrow();
    });

    it('should create an instance for an empty string', () => {
      const rule = new RewriteRule('test-id', 'old', 'new');
      expect(() => new WorkingHtml('', rule)).not.toThrow();
    });

    it('should create an instance for plain text', () => {
      const rule = new RewriteRule('test-id', 'old', 'new');
      expect(() => new WorkingHtml('hello world', rule)).not.toThrow();
    });
  });
});
