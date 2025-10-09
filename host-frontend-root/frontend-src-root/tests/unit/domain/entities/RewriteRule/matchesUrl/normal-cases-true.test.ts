/**
 * RewriteRule.matchesUrl - 正常系テスト (trueを返すケース)
 * 1. URLが前方一致する場合はtrueを返す - 基本的なケース
 * 2. URLが前方一致する場合はtrueを返す - 完全一致
 * 3. 前方一致の境界値テスト - パス付きURLで一致
 * 4. 前方一致の境界値テスト - パス完全一致
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('RewriteRule.matchesUrl - 正常系 (trueを返すケース)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const testCases = [
    {
      description: 'URLが前方一致する場合はtrueを返す - 基本的なケース',
      input: {
        urlPattern: 'https://example.com',
        targetUrl: 'https://example.com/page',
      },
    },
    {
      description: 'URLが前方一致する場合はtrueを返す - 完全一致',
      input: {
        urlPattern: 'https://example.com',
        targetUrl: 'https://example.com',
      },
    },
    {
      description: '前方一致の境界値テスト - パス付きURLで一致',
      input: {
        urlPattern: 'https://example.com/api',
        targetUrl: 'https://example.com/api/users',
      },
    },
    {
      description: '前方一致の境界値テスト - パス完全一致',
      input: {
        urlPattern: 'https://example.com/api',
        targetUrl: 'https://example.com/api',
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      // テストケースに本質的には無関係なパラメータ
      const ruleId = '1';
      const oldKeyword = 'old';
      const newKeyword = 'new';

      const rule = new RewriteRule(
        ruleId,
        oldKeyword,
        newKeyword,
        testCase.input.urlPattern
      );

      // このファイルは全てtrueを期待するテスト
      const expectedResult = true;
      expect(rule.matchesUrl(testCase.input.targetUrl)).toBe(expectedResult);
    });
  });
});
