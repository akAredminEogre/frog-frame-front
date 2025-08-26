import { WorkingHtml } from 'src/domain/value-objects/WorkingHtml';
import { describe, it, expect } from 'vitest';

describe('WorkingHtml', () => {
  describe('constructor', () => {
    it('should create an instance for a valid HTML string', () => {
      expect(() => new WorkingHtml('<div>hello</div>')).not.toThrow();
    });

    it('should create an instance for an empty string', () => {
      expect(() => new WorkingHtml('')).not.toThrow();
    });

    it('should create an instance for plain text', () => {
      expect(() => new WorkingHtml('hello world')).not.toThrow();
    });
  });
});
