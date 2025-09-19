import { describe, it, expect } from 'vitest';
import { PatternProcessingStrategyFactory } from 'src/domain/factories/PatternProcessingStrategyFactory';
import { RegexPatternProcessingStrategy } from 'src/domain/strategies/RegexPatternProcessingStrategy';
import { StringPatternProcessingStrategy } from 'src/domain/strategies/StringPatternProcessingStrategy';

describe('PatternProcessingStrategyFactory', () => {
  it('should create RegexPatternProcessingStrategy when isRegex is true', () => {
    const pattern = '<div>test</div>';
    const strategy = PatternProcessingStrategyFactory.createStrategy(true, pattern);
    expect(strategy).toBeInstanceOf(RegexPatternProcessingStrategy);
    expect(strategy.htmlWhitespaceProcessor).toBeDefined();
  });

  it('should create StringPatternProcessingStrategy when isRegex is false', () => {
    const pattern = '<span>test</span>';
    const strategy = PatternProcessingStrategyFactory.createStrategy(false, pattern);
    expect(strategy).toBeInstanceOf(StringPatternProcessingStrategy);
    expect(strategy.htmlWhitespaceProcessor).toBeDefined();
  });

  it('should create StringPatternProcessingStrategy when isRegex is undefined', () => {
    const pattern = '<p>test</p>';
    const strategy = PatternProcessingStrategyFactory.createStrategy(undefined, pattern);
    expect(strategy).toBeInstanceOf(StringPatternProcessingStrategy);
    expect(strategy.htmlWhitespaceProcessor).toBeDefined();
  });

  it('should create strategy with default empty pattern when pattern is not provided', () => {
    const strategy = PatternProcessingStrategyFactory.createStrategy(true);
    expect(strategy).toBeInstanceOf(RegexPatternProcessingStrategy);
    expect(strategy.htmlWhitespaceProcessor).toBeDefined();
  });
});
