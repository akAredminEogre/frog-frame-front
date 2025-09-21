/**
 * RewriteRule.createRedundantPattern - 正常系テスト
 * 1. 通常文字列パターンでの冗長パターン生成処理
 * 2. 正規表現パターンでの冗長パターン生成処理
 * 3. 特殊文字含有文字列パターンでのエスケープ付き冗長パターン生成処理
 */
import { describe, it, expect } from 'vitest';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

const createRedundantPatternCases = [
  {
    description: 'should create pattern for string replacement',
    id: '1',
    oldString: 'hello world',
    newString: 'hi world',
    isRegex: false,
    expected: 'hello world'
  },
  {
    description: 'should create pattern for regex replacement',
    id: '1',
    oldString: 'hello.*world',
    newString: 'hi world',
    isRegex: true,
    expected: 'hello.*world'
  },
  {
    description: 'should create pattern for string replacement with special characters',
    id: '1',
    oldString: 'hello(test)',
    newString: 'hi world',
    isRegex: false,
    expected: 'hello\\(test\\)'
  }
];

describe('RewriteRule.createRedundantPattern - 正常系', () => {
  createRedundantPatternCases.forEach((testCase) => {
    it(testCase.description, () => {
      const rule = new RewriteRule(
        testCase.id,
        testCase.oldString,
        testCase.newString,
        undefined,
        testCase.isRegex
      );
      const result = rule.createRedundantPattern();
      
      expect(result).toBe(testCase.expected);
    });
  });
});
