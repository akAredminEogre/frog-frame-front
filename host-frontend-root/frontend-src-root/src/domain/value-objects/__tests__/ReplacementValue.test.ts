import { describe, it, expect } from 'vitest';
import { ReplacementValue } from '../ReplacementValue';

describe('ReplacementValue', () => {
  it('should return true for HTML string', () => {
    const htmlString = new ReplacementValue('<div>hello</div>');
    expect(htmlString.isHtml()).toBe(true);
  });

  it('should return false for plain text', () => {
    const plainText = new ReplacementValue('hello world');
    expect(plainText.isHtml()).toBe(false);
  });

  it('should return the original string', () => {
    const value = 'hello';
    const replacementValue = new ReplacementValue(value);
    expect(replacementValue.toString()).toBe(value);
  });
});
