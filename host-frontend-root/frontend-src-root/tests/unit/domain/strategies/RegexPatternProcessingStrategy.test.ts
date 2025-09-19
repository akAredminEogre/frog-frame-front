import { describe, it, expect } from 'vitest';
import { RegexPatternProcessingStrategy } from 'src/domain/strategies/RegexPatternProcessingStrategy';

describe('RegexPatternProcessingStrategy', () => {
  it('should process regex pattern with HTML whitespace ignoring', () => {
    const pattern = '<div>.*</div>';
    const strategy = new RegexPatternProcessingStrategy(pattern);
    const result = strategy.processPattern(pattern);
    expect(result).toBe('(?:\\s*)<div>(?:\\s*).*(?:\\s*)</div>(?:\\s*)');
  });

  it('should handle complex regex patterns', () => {
    const pattern = '<p[^>]*>.*?</p>';
    const strategy = new RegexPatternProcessingStrategy(pattern);
    const result = strategy.processPattern(pattern);
    expect(result).toBe('(?:\\s*)<p[^>(?:\\s*)]*>(?:\\s*).*?(?:\\s*)</p>(?:\\s*)');
  });

  it('should have htmlWhitespaceProcessor as member variable', () => {
    const pattern = '<div>test</div>';
    const strategy = new RegexPatternProcessingStrategy(pattern);
    expect(strategy.htmlWhitespaceProcessor).toBeDefined();
  });
});
