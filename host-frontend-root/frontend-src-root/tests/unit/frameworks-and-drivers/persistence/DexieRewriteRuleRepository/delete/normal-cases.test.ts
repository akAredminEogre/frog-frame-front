import 'tests/unit/infrastructure/persistence/indexeddb/setup';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';

/**
 * DexieRewriteRuleRepository.delete() 正常系テスト
 *
 * 1. 指定されたIDのルールがDBから削除される（単一削除）
 * 2. 複数ルールがある場合、指定したルールのみ削除される
 * 3. 他のルールのプロパティが変更されない（副作用なし）
 */
describe('DexieRewriteRuleRepository.delete - 正常系', () => {
  let repository: DexieRewriteRuleRepository;

  beforeEach(async () => {
    await dexieDatabase.rewriteRules.clear();
    repository = new DexieRewriteRuleRepository();
  });

  afterEach(async () => {
    await dexieDatabase.rewriteRules.clear();
  });

  it('should delete the rule with the specified ID', async () => {
    // Arrange
    const rule = new RewriteRule(
      1,
      'pattern-to-delete',
      'replacement',
      'https://example.com',
      false
    );
    await repository.create(rule);

    const createdRules = await repository.getAll();
    const createdRule = createdRules.toArray()[0];

    // Act
    await repository.delete(createdRule.id);

    // Assert
    const remainingRules = await repository.getAll();
    expect(remainingRules.toArray()).toHaveLength(0);
  });

  it('should delete only the specified rule when multiple rules exist', async () => {
    // Arrange
    const rule1 = new RewriteRule(1, 'pattern1', 'replacement1', '', false);
    const rule2 = new RewriteRule(2, 'pattern2', 'replacement2', '', false);
    const rule3 = new RewriteRule(3, 'pattern3', 'replacement3', '', false);

    await repository.create(rule1);
    await repository.create(rule2);
    await repository.create(rule3);

    const createdRules = await repository.getAll();
    const ruleToDelete = createdRules.toArray().find(r => r.oldString === 'pattern2')!;

    // Act
    await repository.delete(ruleToDelete.id);

    // Assert
    const remainingRules = await repository.getAll();
    const rulesArray = remainingRules.toArray();

    expect(rulesArray).toHaveLength(2);
    expect(rulesArray.find(r => r.oldString === 'pattern2')).toBeUndefined();
    expect(rulesArray.find(r => r.oldString === 'pattern1')).toBeDefined();
    expect(rulesArray.find(r => r.oldString === 'pattern3')).toBeDefined();
  });

  it('should preserve all properties of remaining rules after deletion', async () => {
    // Arrange
    const rule1 = new RewriteRule(
      1,
      'pattern1',
      'replacement1',
      'https://site1.com',
      true,
      false
    );
    const rule2 = new RewriteRule(
      2,
      'pattern2',
      'replacement2',
      'https://site2.com',
      false,
      true
    );

    await repository.create(rule1);
    await repository.create(rule2);

    const createdRules = await repository.getAll();
    const ruleToDelete = createdRules.toArray().find(r => r.oldString === 'pattern1')!;
    const ruleToKeep = createdRules.toArray().find(r => r.oldString === 'pattern2')!;

    // Act
    await repository.delete(ruleToDelete.id);

    // Assert
    const remainingRule = await repository.getById(ruleToKeep.id);

    expect(remainingRule.id).toBe(ruleToKeep.id);
    expect(remainingRule.oldString).toBe('pattern2');
    expect(remainingRule.newString).toBe('replacement2');
    expect(remainingRule.urlPattern).toBe('https://site2.com');
    expect(remainingRule.isRegex).toBe(false);
    expect(remainingRule.isActive).toBe(true);
  });
});
