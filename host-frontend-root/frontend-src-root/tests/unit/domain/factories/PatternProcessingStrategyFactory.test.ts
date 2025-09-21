import { describe, it, expect } from 'vitest';
import { PatternProcessingStrategyFactory } from 'src/domain/entities/RewriteRule/PatternProcessingStrategyFactory';
import { RegexPatternProcessingStrategy } from 'src/domain/entities/RewriteRule/RegexPatternProcessingStrategy';
import { StringPatternProcessingStrategy } from 'src/domain/entities/RewriteRule/StringPatternProcessingStrategy';

/**
 * PatternProcessingStrategyFactoryのテストケース
 * isRegexパラメータに基づく適切なストラテジー生成の検証
 */
interface PatternProcessingStrategyFactoryTestCase {
  description: string;
  input: {
    isRegex?: boolean;
    pattern?: string;
  };
  expectedStrategyType: typeof RegexPatternProcessingStrategy | typeof StringPatternProcessingStrategy;
}

const strategyFactoryTestCases: PatternProcessingStrategyFactoryTestCase[] = [
  {
    description: 'should create RegexPatternProcessingStrategy when isRegex is true',
    input: {
      isRegex: true,
      pattern: '<div>test</div>'
    },
    expectedStrategyType: RegexPatternProcessingStrategy
  },
  {
    description: 'should create StringPatternProcessingStrategy when isRegex is false',
    input: {
      isRegex: false,
      pattern: '<span>test</span>'
    },
    expectedStrategyType: StringPatternProcessingStrategy
  },
  {
    description: 'should create StringPatternProcessingStrategy when isRegex is undefined',
    input: {
      isRegex: undefined,
      pattern: '<p>test</p>'
    },
    expectedStrategyType: StringPatternProcessingStrategy
  },
  {
    description: 'should create strategy with default empty pattern when pattern is not provided',
    input: {
      isRegex: true,
      pattern: undefined
    },
    expectedStrategyType: RegexPatternProcessingStrategy
  }
];

/**
 * PatternProcessingStrategyFactoryクラスのテスト
 * isRegexフラグに基づく適切なストラテジー生成の検証
 * 1. 正規表現フラグtrueでのRegexPatternProcessingStrategy生成
 * 2. 正規表現フラグfalseでのStringPatternProcessingStrategy生成  
 * 3. 正規表現フラグ未定義でのStringPatternProcessingStrategy生成
 * 4. パターン未指定での適切なストラテジー生成
 */
describe('PatternProcessingStrategyFactory', () => {
  strategyFactoryTestCases.forEach((testCase) => {
    it(testCase.description, () => {
      // Arrange & Act
      const strategy = PatternProcessingStrategyFactory.createStrategy(
        testCase.input.isRegex,
        testCase.input.pattern
      );

      // Assert
      expect(strategy).toBeInstanceOf(testCase.expectedStrategyType);
    });
  });
});
