import { TextRange } from 'src/domain/value-objects/TextRange';
import { describe, it, expect } from 'vitest';

describe('TextRange', () => {
  describe('constructor', () => {
    it('should create a valid range', () => {
      const range = new TextRange(5, 10);
      expect(range.start).toBe(5);
      expect(range.end).toBe(10);
    });

    it('should allow start and end to be equal', () => {
      const range = new TextRange(5, 5);
      expect(range.start).toBe(5);
      expect(range.end).toBe(5);
    });

    it('should throw error if start is negative', () => {
      expect(() => new TextRange(-1, 10)).toThrow('開始位置は0以上である必要があります');
    });

    it('should throw error if end is less than start', () => {
      expect(() => new TextRange(10, 5)).toThrow('終了位置は開始位置以上である必要があります');
    });
  });
});
