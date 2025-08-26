import { WorkingHtml } from 'src/domain/value-objects/WorkingHtml';
import { TextRange } from 'src/domain/value-objects/TextRange';
import { describe, it, expect } from 'vitest';

describe('WorkingHtml', () => {
  describe('replaceRange', () => {
    it('should replace text within the specified range', () => {
      const workingHtml = new WorkingHtml('hello world');
      const range = new TextRange(6, 11); // "world"
      const result = workingHtml.replaceRange(range, 'test');
      expect(result.toString()).toBe('hello test');
    });

    it('should replace HTML content within the specified range', () => {
      const workingHtml = new WorkingHtml('<div>old</div>');
      const range = new TextRange(5, 8); // "old"
      const result = workingHtml.replaceRange(range, 'new');
      expect(result.toString()).toBe('<div>new</div>');
    });

    it('should handle replacement at the beginning of the string', () => {
      const workingHtml = new WorkingHtml('start middle end');
      const range = new TextRange(0, 5); // "start"
      const result = workingHtml.replaceRange(range, 'begin');
      expect(result.toString()).toBe('begin middle end');
    });

    it('should handle replacement at the end of the string', () => {
      const workingHtml = new WorkingHtml('start middle end');
      const range = new TextRange(13, 16); // "end"
      const result = workingHtml.replaceRange(range, 'finish');
      expect(result.toString()).toBe('start middle finish');
    });
  });
});
