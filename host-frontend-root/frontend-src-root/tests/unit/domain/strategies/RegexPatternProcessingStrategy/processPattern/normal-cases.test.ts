/**
 * RegexPatternProcessingStrategy.processPattern - 正常系テスト
 * RegexPatternProcessingStrategyでは、正規表現パターンをそのまま使用するため、エスケープ処理は行わない
 * 1. 基本的な正規表現パターンの無変更処理
 * 2. 複雑な正規表現パターンの保持
 * 3. 正規表現特殊文字の保持確認
 */
import { describe, it, expect } from 'vitest';
import { RegexPatternProcessingStrategy } from 'src/domain/strategies/RegexPatternProcessingStrategy';

const regexPatternProcessingCases = [
  {
    description: 'should return regex pattern as-is without escaping',
    pattern: '<div>.*</div>',
    expected: '<div>.*</div>'
  },
  {
    description: 'should handle complex regex patterns without modification',
    pattern: '<p[^>]*>.*?</p>',
    expected: '<p[^>]*>.*?</p>'
  },
  {
    description: 'should preserve special regex characters',
    pattern: '^.*[a-z]+$',
    expected: '^.*[a-z]+$'
  }
];

describe('RegexPatternProcessingStrategy.processPattern - 正常系', () => {
  regexPatternProcessingCases.forEach((testCase) => {
    it(testCase.description, () => {
      const strategy = new RegexPatternProcessingStrategy(testCase.pattern);
      const result = strategy.processPattern();
      expect(result).toBe(testCase.expected);
    });
  });
});
