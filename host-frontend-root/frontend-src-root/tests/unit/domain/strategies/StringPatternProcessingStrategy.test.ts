import { describe, it, expect } from 'vitest';
import { StringPatternProcessingStrategy } from 'src/domain/strategies/StringPatternProcessingStrategy';

describe('StringPatternProcessingStrategy', () => {
  it('should process string pattern with escaping and HTML whitespace ignoring', () => {
    const pattern = '<div>test</div>';
    const strategy = new StringPatternProcessingStrategy(pattern);
    const result = strategy.processPattern(pattern);
    expect(result).toBe('(?:\\s*)<div>(?:\\s*)test(?:\\s*)</div>(?:\\s*)');
  });

  it('should escape regex special characters', () => {
    const pattern = 'test[0-9]+';
    const strategy = new StringPatternProcessingStrategy(pattern);
    const result = strategy.processPattern(pattern);
    expect(result).toBe('test\\[0-9\\]\\+');
  });

  it('should handle complex patterns with HTML and regex chars', () => {
    const pattern = '<div class="test[*]">';
    const strategy = new StringPatternProcessingStrategy(pattern);
    const result = strategy.processPattern(pattern);
    expect(result).toBe('(?:\\s*)<div class="test\\[\\*\\]">(?:\\s*)');
  });

  it('should have htmlWhitespaceProcessor as member variable', () => {
    const pattern = '<div>test</div>';
    const strategy = new StringPatternProcessingStrategy(pattern);
    expect(strategy.htmlWhitespaceProcessor).toBeDefined();
  });

  it('should escape all regex special characters correctly', () => {
    const pattern = '.*+?^${}()|[]\\test';
    const strategy = new StringPatternProcessingStrategy(pattern);
    const result = strategy.processPattern(pattern);
    expect(result).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\test');
  });
});
