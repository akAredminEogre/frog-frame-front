import '../../setup';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { dexieDatabase } from 'src/infrastructure/persistance/indexeddb/DexieDatabase';

/**
 * 1. 既存ルールがある状態で新規ルールを作成し、Promise型で返却
 * 2. 空のデータベースに最初のルールを作成
 * 3. すべてのプロパティを持つルールを正しく作成
 *
 * 注意: DB側で自動採番されるため、IDは予測不可能
 * テストではID値ではなくレコード数と内容を検証
 */
describe('DexieRewriteRuleRepository.create - 正常系', () => {
  let repository: DexieRewriteRuleRepository;
  let testRule: RewriteRule;

  beforeEach(async () => {
    // データベーステーブルをクリア
    await dexieDatabase.rewriteRules.clear();

    repository = new DexieRewriteRuleRepository();
    testRule = new RewriteRule(
      'test-rule-1',
      'test-pattern',
      'test-replacement',
      ''
    );
  });

  afterEach(async () => {
    await dexieDatabase.rewriteRules.clear();
  });

  it('should correctly add new rule to existing rules and return Promise', async () => {
    // Arrange
    const existingRule = new RewriteRule(
      'existing-rule-1',
      'existing-pattern',
      'existing-replacement',
      '',
      false
    );

    // 既存データを追加
    await repository.create(existingRule);

    // Act
    const result = repository.create(testRule);

    // Assert - Promise型であることを確認
    expect(result).toBeInstanceOf(Promise);

    // Act & Assert - 実際の処理をテスト
    await result;

    // Assert - データが正しく保存されることを確認
    const allRules = await repository.getAll();
    const rulesArray = allRules.toArray();

    // 2つのルールが保存されていることを確認
    expect(rulesArray).toHaveLength(2);

    // 各ルールが正しいデータを持つことを確認
    const existingRuleInDb = rulesArray.find(r => r.oldString === 'existing-pattern');
    const testRuleInDb = rulesArray.find(r => r.oldString === 'test-pattern');

    expect(existingRuleInDb).toBeDefined();
    expect(testRuleInDb).toBeDefined();
    expect(existingRuleInDb).toBeInstanceOf(RewriteRule);
    expect(testRuleInDb).toBeInstanceOf(RewriteRule);
  });

  it('should correctly handle empty database and save first rule', async () => {
    // Act
    await repository.create(testRule);

    // Assert - 空のデータベースでも正しく保存されることを確認
    const allRules = await repository.getAll();
    const rulesArray = allRules.toArray();

    expect(rulesArray).toHaveLength(1);
    expect(rulesArray[0]).toBeInstanceOf(RewriteRule);
    expect(rulesArray[0].oldString).toBe('test-pattern');
    expect(rulesArray[0].newString).toBe('test-replacement');
  });

  it('should correctly create rule with all properties', async () => {
    // Arrange
    const ruleWithAllProps = new RewriteRule(
      'rule-with-all-props',
      'old',
      'new',
      'https://test.com/*',
      true
    );

    // Act
    await repository.create(ruleWithAllProps);

    // Assert
    const allRules = await repository.getAll();
    const rulesArray = allRules.toArray();

    expect(rulesArray).toHaveLength(1);
    expect(rulesArray[0]).toBeInstanceOf(RewriteRule);
    expect(rulesArray[0].oldString).toBe('old');
    expect(rulesArray[0].newString).toBe('new');
    expect(rulesArray[0].urlPattern).toBe('https://test.com/*');
    expect(rulesArray[0].isRegex).toBe(true);
  });
});
