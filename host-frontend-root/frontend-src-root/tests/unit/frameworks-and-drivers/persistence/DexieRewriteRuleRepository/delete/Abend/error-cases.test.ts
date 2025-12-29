import 'tests/unit/infrastructure/persistence/indexeddb/setup';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';

/**
 * DexieRewriteRuleRepository.delete() 異常系テスト
 *
 * 1. 存在しないIDを指定しても例外がスローされない（冪等性）
 * 2. DBが空の状態で削除しても例外がスローされない
 */
describe('DexieRewriteRuleRepository.delete - 異常系', () => {
  let repository: DexieRewriteRuleRepository;

  beforeEach(async () => {
    await dexieDatabase.rewriteRules.clear();
    repository = new DexieRewriteRuleRepository();
  });

  afterEach(async () => {
    await dexieDatabase.rewriteRules.clear();
  });

  it('should not throw an error when deleting a non-existent ID', async () => {
    // Arrange
    const rule = new RewriteRule(1, 'pattern', 'replacement', '', false);
    await repository.create(rule);

    const nonExistentId = 99999;

    // Act & Assert
    await expect(repository.delete(nonExistentId)).resolves.not.toThrow();

    // Verify original rule still exists
    const remainingRules = await repository.getAll();
    expect(remainingRules.toArray()).toHaveLength(1);
  });

  it('should not throw an error when deleting from an empty database', async () => {
    // Arrange - DB is already empty from beforeEach

    // Act & Assert
    await expect(repository.delete(1)).resolves.not.toThrow();

    // Verify DB is still empty
    const remainingRules = await repository.getAll();
    expect(remainingRules.toArray()).toHaveLength(0);
  });
});
