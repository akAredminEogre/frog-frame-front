/**
 * StringPatternProcessingStrategy.processPattern - 正常系テスト
 * 1. 基本的な文字列パターン内の正規表現特殊文字エスケープ処理
 * 2. クラス属性等複雑パターンでの正規表現特殊文字エスケープ処理
 * 3. 全正規表現特殊文字を含むパターンの包括的エスケープ処理
 * 4. 特殊文字を含まない通常文字列の無変更処理
 * 5. HTML要素を含むパターンでの角括弧の適切な処理
 */
import { describe, expect,it } from 'vitest';

import { StringPatternProcessingStrategy } from 'src/domain/entities/RewriteRule/StringPatternProcessingStrategy';

const stringPatternProcessingCases = [
  {
    description: 'should escape regex special characters correctly',
    input: 'test[0-9]+',
    expected: 'test\\[0-9\\]\\+'
  },
  {
    description: 'should handle complex patterns with regex special characters',
    input: '<div class="test[*]">',
    expected: '<div class="test\\[\\*\\]">'
  },
  {
    description: 'should escape all regex special characters correctly',
    input: '.*+?^${}()|[]\\test',
    expected: '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\test'
  },
  {
    description: 'should preserve non-special characters',
    input: 'simpletext123',
    expected: 'simpletext123'
  },
  {
    description: 'should handle HTML elements without escaping angle brackets unnecessarily',
    input: '<div>test</div>',
    expected: '<div>test</div>'
  }
];

describe('StringPatternProcessingStrategy.processPattern - 正常系', () => {
  stringPatternProcessingCases.forEach((testCase) => {
    it(testCase.description, () => {
      const strategy = new StringPatternProcessingStrategy(testCase.input);
      const result = strategy.processPattern();
      expect(result).toBe(testCase.expected);
    });
  });
});
