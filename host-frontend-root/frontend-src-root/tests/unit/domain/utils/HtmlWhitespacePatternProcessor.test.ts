import { describe, it, expect } from 'vitest';
import { HtmlWhitespacePatternProcessor } from 'src/domain/utils/HtmlWhitespacePatternProcessor';

describe('HtmlWhitespacePatternProcessor', () => {
  it('should add HTML whitespace ignoring pattern for simple tag', () => {
    const input = '<div>content</div>';
    const processor = new HtmlWhitespacePatternProcessor(input);
    const result = processor.addHtmlWhitespaceIgnoringPattern();
    expect(result).toBe('(?:\\s*)<div>(?:\\s*)content(?:\\s*)</div>(?:\\s*)');
  });

  it('should add HTML whitespace ignoring pattern for multiple tags', () => {
    const input = '<p><span>text</span></p>';
    const processor = new HtmlWhitespacePatternProcessor(input);
    const result = processor.addHtmlWhitespaceIgnoringPattern();
    expect(result).toBe('(?:\\s*)<p>(?:\\s*)(?:\\s*)<span>(?:\\s*)text(?:\\s*)</span>(?:\\s*)(?:\\s*)</p>(?:\\s*)');
  });

  it('should handle empty string', () => {
    const input = '';
    const processor = new HtmlWhitespacePatternProcessor(input);
    const result = processor.addHtmlWhitespaceIgnoringPattern();
    expect(result).toBe('');
  });

  it('should handle pattern without HTML tags', () => {
    const input = 'plain text';
    const processor = new HtmlWhitespacePatternProcessor(input);
    const result = processor.addHtmlWhitespaceIgnoringPattern();
    expect(result).toBe('plain text');
  });

  it('should handle nested tags correctly', () => {
    const input = '<div><p>nested</p></div>';
    const processor = new HtmlWhitespacePatternProcessor(input);
    const result = processor.addHtmlWhitespaceIgnoringPattern();
    expect(result).toBe('(?:\\s*)<div>(?:\\s*)(?:\\s*)<p>(?:\\s*)nested(?:\\s*)</p>(?:\\s*)(?:\\s*)</div>(?:\\s*)');
  });

  it('should handle self-closing tags', () => {
    const input = '<img src="test.jpg" />';
    const processor = new HtmlWhitespacePatternProcessor(input);
    const result = processor.addHtmlWhitespaceIgnoringPattern();
    expect(result).toBe('(?:\\s*)<img src="test.jpg" />(?:\\s*)');
  });
});
