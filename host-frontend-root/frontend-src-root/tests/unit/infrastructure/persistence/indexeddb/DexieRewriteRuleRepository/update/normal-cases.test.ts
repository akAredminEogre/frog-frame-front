import '../../setup';

import { afterEach,beforeEach, describe, expect, it } from 'vitest';

import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';

/**
 * 1. 既存ルールを新しい値で更新
 * 2. 指定されたプロパティのみ更新し、他のプロパティは保持
 * 3. 1つのルールを更新する際に全てのルールを保持
 *
 * 注意: DB側で自動採番されるため、create後にgetAllでIDを取得してから更新
 */
describe('DexieRewriteRuleRepository.update - 正常系', () => {
  let repository: DexieRewriteRuleRepository;

  beforeEach(async () => {
    // データベーステーブルをクリア
    await dexieDatabase.rewriteRules.clear();

    repository = new DexieRewriteRuleRepository();
  });

  afterEach(async () => {
    await dexieDatabase.rewriteRules.clear();
  });

  it('should update existing rule with new values', async () => {
    // Arrange
    const rule1 = new RewriteRule(
      1,
      'old-pattern',
      'old-replacement',
      '',
      false
    );
    const rule2 = new RewriteRule(
      2,
      'pattern2',
      'replacement2',
      '',
      false
    );

    await repository.create(rule1);
    await repository.create(rule2);

    // 作成されたルールのIDを取得
    const createdRules = await repository.getAll();
    const createdRulesArray = createdRules.toArray();
    const rule1InDb = createdRulesArray.find(r => r.oldString === 'old-pattern')!;

    const updatedRule = new RewriteRule(
      rule1InDb.id,
      'new-pattern',
      'new-replacement',
      'https://example.com',
      true
    );

    // Act
    await repository.update(updatedRule);

    // Assert - 更新されたルールが正しく保存されることを確認
    const updatedRuleInDb = await repository.getById(rule1InDb.id);

    expect(updatedRuleInDb.id).toBe(rule1InDb.id);
    expect(updatedRuleInDb.oldString).toBe('new-pattern');
    expect(updatedRuleInDb.newString).toBe('new-replacement');
    expect(updatedRuleInDb.urlPattern).toBe('https://example.com');
    expect(updatedRuleInDb.isRegex).toBe(true);

    // Assert - 他のルールが変更されていないことを確認
    const allRules = await repository.getAll();
    const rulesArray = allRules.toArray();
    const rule2InDb = rulesArray.find(r => r.oldString === 'pattern2')!;
    expect(rule2InDb.oldString).toBe('pattern2');
    expect(rule2InDb.newString).toBe('replacement2');
  });

  it('should update only specified properties while preserving others', async () => {
    // Arrange
    const existingRule = new RewriteRule(
      3,
      'pattern',
      'replacement',
      'https://old.com',
      false
    );

    await repository.create(existingRule);

    // 作成されたルールのIDを取得
    const createdRules = await repository.getAll();
    const createdRulesArray = createdRules.toArray();
    const ruleInDb = createdRulesArray[0];

    const updatedRule = new RewriteRule(
      ruleInDb.id,
      'new-pattern',
      'replacement',
      'https://old.com',
      false
    );

    // Act
    await repository.update(updatedRule);

    // Assert
    const updatedRuleInDb = await repository.getById(ruleInDb.id);

    expect(updatedRuleInDb.oldString).toBe('new-pattern');
    expect(updatedRuleInDb.newString).toBe('replacement');
    expect(updatedRuleInDb.urlPattern).toBe('https://old.com');
    expect(updatedRuleInDb.isRegex).toBe(false);
  });

  it('should preserve all rules when updating one rule', async () => {
    // Arrange
    const rule1 = new RewriteRule(
      4,
      'pattern1',
      'replacement1',
      '',
      false
    );
    const rule2 = new RewriteRule(
      5,
      'pattern2',
      'replacement2',
      '',
      false
    );
    const rule3 = new RewriteRule(
      6,
      'pattern3',
      'replacement3',
      '',
      false
    );

    await repository.create(rule1);
    await repository.create(rule2);
    await repository.create(rule3);

    // 作成されたルールのIDを取得
    const createdRules = await repository.getAll();
    const createdRulesArray = createdRules.toArray();
    const rule2InDb = createdRulesArray.find(r => r.oldString === 'pattern2')!;

    const updatedRule = new RewriteRule(
      rule2InDb.id,
      'updated-pattern2',
      'updated-replacement2',
      '',
      false
    );

    // Act
    await repository.update(updatedRule);

    // Assert - すべてのルールが保存されることを確認
    const allRules = await repository.getAll();
    const rulesArray = allRules.toArray();

    expect(rulesArray).toHaveLength(3);

    // Assert - rule-2のみが更新されることを確認
    const updatedRule2InDb = await repository.getById(rule2InDb.id);
    expect(updatedRule2InDb.oldString).toBe('updated-pattern2');
    expect(updatedRule2InDb.newString).toBe('updated-replacement2');

    // Assert - 他のルールは変更されていないことを確認
    const rule1InDb = rulesArray.find(r => r.oldString === 'pattern1')!;
    const rule3InDb = rulesArray.find(r => r.oldString === 'pattern3')!;
    expect(rule1InDb.oldString).toBe('pattern1');
    expect(rule3InDb.oldString).toBe('pattern3');
  });
});
