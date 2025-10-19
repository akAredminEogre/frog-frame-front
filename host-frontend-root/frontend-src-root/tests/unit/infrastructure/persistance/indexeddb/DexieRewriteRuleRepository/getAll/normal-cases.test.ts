import '../../setup';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { dexieDatabase } from 'src/infrastructure/persistance/indexeddb/DexieDatabase';

/**
 * 1. 複数のルールが保存されている場合、すべてのルールをRewriteRulesインスタンスとして取得し、Promise型で返却
 * 2. データベースが空の場合、空のRewriteRulesインスタンスを返却
 *
 * 注意: DB側で自動採番されるため、IDは予測不可能
 * テストではID値ではなくレコード数と内容を検証
 */
describe('DexieRewriteRuleRepository.getAll - 正常系', () => {
  let repository: DexieRewriteRuleRepository;

  beforeEach(async () => {
    // データベーステーブルをクリア
    await dexieDatabase.rewriteRules.clear();

    repository = new DexieRewriteRuleRepository();
  });

  afterEach(async () => {
    await dexieDatabase.rewriteRules.clear();
  });

  it('should return RewriteRules instance with stored data and return Promise', async () => {
    // Arrange
    const rule1 = new RewriteRule(
      'rule-1',
      'pattern1',
      'replacement1',
      '',
      false
    );
    const rule2 = new RewriteRule(
      'rule-2',
      'pattern2',
      'replacement2',
      '',
      false
    );

    await repository.create(rule1);
    await repository.create(rule2);

    // Act
    const result = repository.getAll();

    // Assert - Promise型であることを確認
    expect(result).toBeInstanceOf(Promise);

    // Act & Assert - 実際の結果をテスト
    const actualResult = await result;

    // Assert - RewriteRulesインスタンスが返されることを確認
    expect(actualResult).toBeInstanceOf(RewriteRules);

    // Assert - 取得されたデータが正しくRewriteRuleインスタンスに変換されることを確認
    const rulesArray = actualResult.toArray();

    // 2つのルールが取得されることを確認
    expect(rulesArray).toHaveLength(2);

    // 各ルールがRewriteRuleインスタンスであることを確認
    expect(rulesArray[0]).toBeInstanceOf(RewriteRule);
    expect(rulesArray[1]).toBeInstanceOf(RewriteRule);

    // 内容を検証（IDは自動採番のため、oldStringで識別）
    const rule1InDb = rulesArray.find(r => r.oldString === 'pattern1')!;
    const rule2InDb = rulesArray.find(r => r.oldString === 'pattern2')!;

    expect(rule1InDb).toBeDefined();
    expect(rule1InDb.oldString).toBe('pattern1');
    expect(rule1InDb.newString).toBe('replacement1');

    expect(rule2InDb).toBeDefined();
    expect(rule2InDb.oldString).toBe('pattern2');
    expect(rule2InDb.newString).toBe('replacement2');
  });

  it('should correctly handle empty database and return empty RewriteRules', async () => {
    // Act
    const result = await repository.getAll();

    // Assert - 空のRewriteRulesインスタンスが返されることを確認
    expect(result).toBeInstanceOf(RewriteRules);

    // Assert - 空の配列が返されることを確認
    const resultArray = result.toArray();
    expect(resultArray).toHaveLength(0);
  });
});
