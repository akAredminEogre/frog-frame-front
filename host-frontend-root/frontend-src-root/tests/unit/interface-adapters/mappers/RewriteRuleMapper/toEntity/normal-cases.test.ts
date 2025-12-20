/**
 * RewriteRuleMapper.toEntity - 正常系テスト
 * 1. 全プロパティを持つDTOからエンティティに変換できる
 * 2. isActive=trueのDTOを変換できる
 * 3. isActive=falseのDTOを変換できる
 * 4. isRegex=trueのDTOを変換できる
 * 5. isRegex=falseのDTOを変換できる
 */
import { describe, expect, it } from 'vitest';

import { RewriteRuleMapper } from 'src/interface-adapters/mappers/RewriteRuleMapper';
import { RewriteRuleDTO } from 'src/frameworks-and-drivers/messaging/dto/RewriteRuleDTO';

describe('RewriteRuleMapper.toEntity - 正常系', () => {
  const testCases = [
    {
      description: '全プロパティを持つDTOからエンティティに変換できる',
      input: {
        id: 1,
        oldString: 'old text',
        newString: 'new text',
        urlPattern: 'https://example.com',
        isRegex: false,
        isActive: true,
      } as RewriteRuleDTO,
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
      description: 'isActive=trueのDTOを変換できる',
      input: {
        id: 2,
        oldString: 'foo',
        newString: 'bar',
        urlPattern: 'https://test.com',
        isRegex: true,
        isActive: true,
      } as RewriteRuleDTO,
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
      description: 'isActive=falseのDTOを変換できる',
      input: {
        id: 3,
        oldString: 'disabled',
        newString: 'enabled',
        urlPattern: 'https://disabled.com',
        isRegex: false,
        isActive: false,
      } as RewriteRuleDTO,
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
      description: 'isRegex=trueのDTOを変換できる',
      input: {
        id: 4,
        oldString: '\\d+',
        newString: 'NUMBER',
        urlPattern: 'https://regex.com',
        isRegex: true,
        isActive: true,
      } as RewriteRuleDTO,
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
      description: 'isRegex=falseのDTOを変換できる',
      input: {
        id: 5,
        oldString: 'literal',
        newString: 'replaced',
        urlPattern: 'https://literal.com',
        isRegex: false,
        isActive: true,
      } as RewriteRuleDTO,
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

      const result = mapper.toEntity(testCase.input);

      expect(result.id).toBe(testCase.expected.id);
      expect(result.oldString).toBe(testCase.expected.oldString);
      expect(result.newString).toBe(testCase.expected.newString);
      expect(result.urlPattern).toBe(testCase.expected.urlPattern);
      expect(result.isRegex).toBe(testCase.expected.isRegex);
      expect(result.isActive).toBe(testCase.expected.isActive);
    });
  });
});
