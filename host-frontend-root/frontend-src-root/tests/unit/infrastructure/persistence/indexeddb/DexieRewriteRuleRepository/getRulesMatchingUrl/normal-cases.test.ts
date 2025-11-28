import '../../setup';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';

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

  it('URLにマッチするルールのみを取得する', async () => {
    // Arrange
    const matchingRule = new RewriteRule(1, 'old1', 'new1', 'https://example.com', false);
    const nonMatchingRule = new RewriteRule(2, 'old2', 'new2', 'https://other.com', false);

    await repository.create(matchingRule);
    await repository.create(nonMatchingRule);

    // Act
    const result = await repository.getRulesMatchingUrl('https://example.com/page');

    // Assert
    expect(result).toBeInstanceOf(RewriteRules);
    const rulesArray = result.toArray();
    expect(rulesArray).toHaveLength(1);
    expect(rulesArray[0].oldString).toBe('old1');
  });

  it('マッチするルールがない場合は空のRewriteRulesを返す', async () => {
    // Arrange
    const rule = new RewriteRule(1, 'old1', 'new1', 'https://other.com', false);
    await repository.create(rule);

    // Act
    const result = await repository.getRulesMatchingUrl('https://example.com/page');

    // Assert
    expect(result).toBeInstanceOf(RewriteRules);
    expect(result.toArray()).toHaveLength(0);
  });

  it('空のurlPatternを持つルールは取得されない', async () => {
    // Arrange
    const emptyPatternRule = new RewriteRule(1, 'old1', 'new1', '', false);
    const matchingRule = new RewriteRule(2, 'old2', 'new2', 'https://example.com', false);

    await repository.create(emptyPatternRule);
    await repository.create(matchingRule);

    // Act
    const result = await repository.getRulesMatchingUrl('https://example.com/page');

    // Assert
    const rulesArray = result.toArray();
    expect(rulesArray).toHaveLength(1);
    expect(rulesArray[0].oldString).toBe('old2');
  });
});
