import { WorkingHtml } from 'src/domain/value-objects/WorkingHtml';
import { RewriteRule } from 'src/domain/entities/RewriteRule';
import { describe, it, expect } from 'vitest';

describe('WorkingHtml', () => {
  describe('toString', () => {
    it('should return the original string value', () => {
      const html = '<div><p>test</p></div>';
      const rule = new RewriteRule('test-id', 'old', 'new');
      const workingHtml = new WorkingHtml(html, rule);
      expect(workingHtml.toString()).toBe(html);
    });
  });
});
