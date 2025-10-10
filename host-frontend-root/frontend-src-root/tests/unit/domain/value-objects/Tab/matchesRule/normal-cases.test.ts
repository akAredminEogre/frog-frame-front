import { Tab } from 'src/domain/value-objects/Tab';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { describe, it, expect } from 'vitest';

/**
 * Tab.matchesRule メソッドの正常系テスト
 * 1. URLパターン完全一致でtrueを返す (https://example.com vs https://example.com)
 * 2. URLパターン前方一致(サブパス含む)でtrueを返す (https://example.com/path/to/page vs https://example.com/path)
 * 3. 異なるサブパスでfalseを返す (https://example.com/other/page vs https://example.com/specific)
 */
describe('Tab.matchesRule - 正常系', () => {
  const testCases = [
    {
      description: 'URLパターン完全一致でtrueを返す',
      input: {
        tabUrl: 'https://example.com',
        urlPattern: 'https://example.com',
      },
      expected: { result: true },
    },
    {
      description: 'URLパターン前方一致(サブパス含む)でtrueを返す',
      input: {
        tabUrl: 'https://example.com/path/to/page',
        urlPattern: 'https://example.com/path',
      },
      expected: { result: true },
    },
    {
      description: '異なるサブパスでfalseを返す',
      input: {
        tabUrl: 'https://example.com/other/page',
        urlPattern: 'https://example.com/specific',
      },
      expected: { result: false },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const tab = new Tab(1, testCase.input.tabUrl);
      const rule = new RewriteRule(
        'test-rule',
        'oldText',
        'newText',
        testCase.input.urlPattern,
        false
      );

      const result = tab.matchesRule(rule);
      expect(result).toBe(testCase.expected.result);
    });
  });
});
