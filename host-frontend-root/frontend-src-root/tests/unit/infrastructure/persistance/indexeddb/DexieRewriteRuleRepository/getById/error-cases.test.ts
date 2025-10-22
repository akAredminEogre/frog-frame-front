import '../../setup';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository';
import { RewriteRuleNotFoundError } from 'src/domain/errors/RewriteRuleNotFoundError';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { dexieDatabase } from 'src/infrastructure/persistance/indexeddb/DexieDatabase';

/**
 * 注意: DB側で自動採番されるためIDは数値文字列（"1", "2", ...）
 * 存在しないIDのテストでは数値文字列を使用
 */
describe('DexieRewriteRuleRepository.getById - 異常系', () => {
  let repository: DexieRewriteRuleRepository;

  beforeEach(async () => {
    // データベーステーブルをクリア
    await dexieDatabase.rewriteRules.clear();

    repository = new DexieRewriteRuleRepository();
  });

  afterEach(async () => {
    await dexieDatabase.rewriteRules.clear();
  });

  it('should throw RewriteRuleNotFoundError when rule with specified ID does not exist', async () => {
    // Arrange
    const rule1 = new RewriteRule(
      1,
      'pattern1',
      'replacement1',
      '',
      false
    );

    await repository.create(rule1);

    // Act & Assert - 存在しないIDとして大きな数値を使用
    await expect(repository.getById(999)).rejects.toThrow(RewriteRuleNotFoundError);
    await expect(repository.getById(999)).rejects.toThrow('Rewrite rule with id "999" not found');
  });

  it('should throw RewriteRuleNotFoundError when database is empty', async () => {
    // Act & Assert
    await expect(repository.getById(1)).rejects.toThrow(RewriteRuleNotFoundError);
    await expect(repository.getById(1)).rejects.toThrow('Rewrite rule with id "1" not found');
  });

  // NOTE: Test removed because getById now only accepts number type
  // TypeScript prevents invalid string IDs at compile time
  // it('should throw Error when ID format is invalid (non-numeric string)', async () => {
  //   // Act & Assert - 数値に変換できないIDの場合はエラー
  //   await expect(repository.getById('invalid-id')).rejects.toThrow('Invalid ID format: invalid-id. Expected a numeric string or number.');
  // });
});
