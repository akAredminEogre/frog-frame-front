import { WorkingHtml } from 'src/domain/value-objects/WorkingHtml';
import { describe, it, expect } from 'vitest';

describe('WorkingHtml', () => {
  describe('toString', () => {
    it('should return the original string value', () => {
      const html = '<div><p>test</p></div>';
      const workingHtml = new WorkingHtml(html);
      expect(workingHtml.toString()).toBe(html);
    });
  });
});
