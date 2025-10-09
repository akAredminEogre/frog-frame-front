/**
 * RewriteRule.matchesUrl - 正常系テスト (falseを返すケース)
 * 1. URLパターンが空文字列の場合はfalseを返す
 * 2. 前方一致の境界値テスト - 類似パスで不一致
 * 3. URLが前方一致しない場合はfalseを返す - 異なるドメイン
 * 4. URLが前方一致しない場合はfalseを返す - 異なるプロトコル
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

describe('RewriteRule.matchesUrl - 正常系 (falseを返すケース)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const testCases = [
    {
      description: 'URLパターンが空文字列の場合はfalseを返す',
      input: {
        urlPattern: '',
        targetUrl: 'https://example.com/page',
      },
    },
    {
      description: '前方一致の境界値テスト - 類似パスで不一致',
      input: {
        urlPattern: 'https://example.com/api',
        targetUrl: 'https://example.com/app',
      },
    },
    {
      description: 'URLが前方一致しない場合はfalseを返す - 異なるドメイン',
      input: {
        urlPattern: 'https://example.com',
        targetUrl: 'https://other.com/page',
      },
    },
    {
      description: 'URLが前方一致しない場合はfalseを返す - 異なるプロトコル',
      input: {
        urlPattern: 'https://example.com',
        targetUrl: 'http://example.com/page',
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

      // このファイルは全てfalseを期待するテスト
      const expectedResult = false;
      expect(rule.matchesUrl(testCase.input.targetUrl)).toBe(expectedResult);
    });
  });
});
