import 'tests/unit/infrastructure/persistence/indexeddb/setup';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';

/**
 * DexieRewriteRuleRepository.getRulesMatchingUrl - 正常系テスト
 * 1. URLにマッチするルールのみを取得する
 * 2. マッチするルールがない場合は空のRewriteRulesを返す
 * 3. 空のurlPatternを持つルールは取得されない
 */
describe('DexieRewriteRuleRepository.getRulesMatchingUrl - 正常系', () => {
  let repository: DexieRewriteRuleRepository;

  beforeEach(async () => {
    await dexieDatabase.rewriteRules.clear();
    repository = new DexieRewriteRuleRepository();
  });

  afterEach(async () => {
    await dexieDatabase.rewriteRules.clear();
  });

  const testCases = [
    {
      description: 'URLにマッチするルールのみを取得する',
      rulesToCreate: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://example.com', isRegex: false },
        { id: 2, oldString: 'old2', newString: 'new2', urlPattern: 'https://other.com', isRegex: false },
      ],
      currentUrl: 'https://example.com/page',
      expectedLength: 1,
      expectedOldStrings: ['old1'],
    },
    {
      description: 'マッチするルールがない場合は空のRewriteRulesを返す',
      rulesToCreate: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: 'https://other.com', isRegex: false },
      ],
      currentUrl: 'https://example.com/page',
      expectedLength: 0,
      expectedOldStrings: [],
    },
    {
      description: '空のurlPatternを持つルールは取得されない',
      rulesToCreate: [
        { id: 1, oldString: 'old1', newString: 'new1', urlPattern: '', isRegex: false },
        { id: 2, oldString: 'old2', newString: 'new2', urlPattern: 'https://example.com', isRegex: false },
      ],
      currentUrl: 'https://example.com/page',
      expectedLength: 1,
      expectedOldStrings: ['old2'],
    },
  ];

  testCases.forEach(({ description, rulesToCreate, currentUrl, expectedLength, expectedOldStrings }) => {
    it(description, async () => {
      // Arrange
      for (const ruleData of rulesToCreate) {
        const rule = new RewriteRule(
          ruleData.id,
          ruleData.oldString,
          ruleData.newString,
          ruleData.urlPattern,
          ruleData.isRegex
        );
        await repository.create(rule);
      }

      // Act
      const result = await repository.getRulesMatchingUrl(currentUrl);

      // Assert
      expect(result).toBeInstanceOf(RewriteRules);
      const rulesArray = result.toArray();
      expect(rulesArray).toHaveLength(expectedLength);
      expectedOldStrings.forEach((expectedOldString, index) => {
        expect(rulesArray[index].oldString).toBe(expectedOldString);
      });
    });
  });
});
