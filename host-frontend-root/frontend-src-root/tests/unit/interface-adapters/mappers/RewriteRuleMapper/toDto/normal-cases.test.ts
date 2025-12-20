/**
 * RewriteRuleMapper.toDto - 正常系テスト
 * 1. 全プロパティを持つエンティティからDTOに変換できる
 * 2. isActive=trueのエンティティを変換できる
 * 3. isActive=falseのエンティティを変換できる
 * 4. isRegex=trueのエンティティを変換できる
 * 5. isRegex=falseのエンティティを変換できる
 */
import { describe, expect, it } from 'vitest';

import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

describe('RewriteRuleMapper.toDto - 正常系', () => {
  const testCases = [
    {
      description: '全プロパティを持つエンティティからDTOに変換できる',
      input: new RewriteRule(
        1,
        'old text',
        'new text',
        'https://example.com',
        false,
        true
      ),
      expected: {
        id: 1,
        oldString: 'old text',
        newString: 'new text',
        urlPattern: 'https://example.com',
        isRegex: false,
        isActive: true,
      },
    },
    {
      description: 'isActive=trueのエンティティを変換できる',
      input: new RewriteRule(
        2,
        'foo',
        'bar',
        'https://test.com',
        true,
        true
      ),
      expected: {
        id: 2,
        oldString: 'foo',
        newString: 'bar',
        urlPattern: 'https://test.com',
        isRegex: true,
        isActive: true,
      },
    },
    {
      description: 'isActive=falseのエンティティを変換できる',
      input: new RewriteRule(
        3,
        'disabled',
        'enabled',
        'https://disabled.com',
        false,
        false
      ),
      expected: {
        id: 3,
        oldString: 'disabled',
        newString: 'enabled',
        urlPattern: 'https://disabled.com',
        isRegex: false,
        isActive: false,
      },
    },
    {
      description: 'isRegex=trueのエンティティを変換できる',
      input: new RewriteRule(
        4,
        '\\d+',
        'NUMBER',
        'https://regex.com',
        true,
        true
      ),
      expected: {
        id: 4,
        oldString: '\\d+',
        newString: 'NUMBER',
        urlPattern: 'https://regex.com',
        isRegex: true,
        isActive: true,
      },
    },
    {
      description: 'isRegex=falseのエンティティを変換できる',
      input: new RewriteRule(
        5,
        'literal',
        'replaced',
        'https://literal.com',
        false,
        true
      ),
      expected: {
        id: 5,
        oldString: 'literal',
        newString: 'replaced',
        urlPattern: 'https://literal.com',
        isRegex: false,
        isActive: true,
      },
    },
  ];

  testCases.forEach((testCase) => {
    it(testCase.description, () => {
      const mapper = new RewriteRuleMapper();

      const result = mapper.toDto(testCase.input);

      expect(result.id).toBe(testCase.expected.id);
      expect(result.oldString).toBe(testCase.expected.oldString);
      expect(result.newString).toBe(testCase.expected.newString);
      expect(result.urlPattern).toBe(testCase.expected.urlPattern);
      expect(result.isRegex).toBe(testCase.expected.isRegex);
      expect(result.isActive).toBe(testCase.expected.isActive);
    });
  });
});
