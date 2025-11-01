/**
 * RegexPatternProcessingStrategy.escapeCssAttributeBrackets - 正常系テスト
 * CSS属性値内の角括弧のみエスケープする機能のテスト
 * private メソッドのため、processPattern経由でテストを実行
 */
import { describe, expect, it } from 'vitest';

import { RegexPatternProcessingStrategy } from 'src/domain/entities/RewriteRule/RegexPatternProcessingStrategy';

const escapeCssAttributeBracketsCases = [
  {
    description: 'should escape Tailwind CSS width brackets w-[200px]',
    pattern: '<span class="book-isbn13 w-[200px]" itemprop="isbn13">(.+?)</span>',
    expected: '<span class="book-isbn13 w-\\[200px\\]" itemprop="isbn13">(.+?)</span>'
  },
  {
    description: 'should escape Tailwind CSS height brackets h-[100px]',
    pattern: '<div class="h-[100px] w-full">content</div>',
    expected: '<div class="h-\\[100px\\] w-full">content</div>'
  },
  {
    description: 'should escape multiple Tailwind CSS bracket patterns',
    pattern: '<div class="m-[10px] p-[5px] text-[#ff0000]">content</div>',
    expected: '<div class="m-\\[10px\\] p-\\[5px\\] text-\\[#ff0000\\]">content</div>'
  },
  {
    description: 'should escape arbitrary margin ml-[32px]',
    pattern: '<span class="ml-[32px] font-bold">text</span>',
    expected: '<span class="ml-\\[32px\\] font-bold">text</span>'
  },
  {
    description: 'should escape arbitrary padding pt-[12rem]',
    pattern: '<div class="pt-[12rem] bg-blue-500">content</div>',
    expected: '<div class="pt-\\[12rem\\] bg-blue-500">content</div>'
  },
  {
    description: 'should preserve regex character classes unchanged',
    pattern: '<p[^>]*>.*?</p>',
    expected: '<p[^>]*>.*?</p>'
  },
  {
    description: 'should preserve regex character range [a-z] unchanged',
    pattern: '^.*[a-z]+$',
    expected: '^.*[a-z]+$'
  },
  {
    description: 'should preserve regex character set [0-9] unchanged',
    pattern: 'test[0-9]+pattern',
    expected: 'test[0-9]+pattern'
  },
  {
    description: 'should handle mixed CSS brackets and regex character classes',
    pattern: '<span class="w-[200px]"[^>]*>(.+?)</span>',
    expected: '<span class="w-\\[200px\\]"[^>]*>(.+?)</span>'
  },
  {
    description: 'should handle CSS brackets at start of class attribute',
    pattern: '<div class="[&>*]:mb-4 container">content</div>',
    expected: '<div class="[&>*]:mb-4 container">content</div>'
  },
  {
    description: 'should escape only word-dash prefix brackets, not arbitrary brackets',
    pattern: '<div class="grid-cols-[1fr_2fr] [&>*]:gap-4">content</div>',
    expected: '<div class="grid-cols-\\[1fr_2fr\\] [&>*]:gap-4">content</div>'
  },
  {
    description: 'should handle no brackets pattern unchanged',
    pattern: '<div class="container mx-auto">content</div>',
    expected: '<div class="container mx-auto">content</div>'
  }
];

describe('RegexPatternProcessingStrategy.escapeCssAttributeBrackets - 正常系', () => {
  escapeCssAttributeBracketsCases.forEach((testCase) => {
    it(testCase.description, () => {
      const strategy = new RegexPatternProcessingStrategy(testCase.pattern);
      const result = strategy.processPattern();
      expect(result).toBe(testCase.expected);
    });
  });
});