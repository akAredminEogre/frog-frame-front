import 'tests/unit/infrastructure/persistence/indexeddb/setup';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';

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
    const rule1 = RewriteRule.fromParams(1, {
      oldString: 'old-pattern',
      newString: 'old-replacement',
      urlPattern: '',
      isRegex: false,
    });
    const rule2 = RewriteRule.fromParams(2, {
      oldString: 'pattern2',
      newString: 'replacement2',
      urlPattern: '',
      isRegex: false,
    });

    await repository.create(rule1);
    await repository.create(rule2);

    // 作成されたルールのIDを取得
    const createdRules = await repository.getAll();
    const createdRulesArray = createdRules.toArray();
    const rule1InDb = createdRulesArray.find(r => r.oldString === 'old-pattern')!;

    const updatedRule = RewriteRule.fromParams(rule1InDb.id, {
      oldString: 'new-pattern',
      newString: 'new-replacement',
      urlPattern: 'https://example.com',
      isRegex: true,
      isActive: false,
    });

    // Act
    await repository.update(updatedRule);

    // Assert - 更新されたルールが正しく保存されることを確認
    const updatedRuleInDb = await repository.getById(rule1InDb.id);

    expect(updatedRuleInDb.id).toBe(rule1InDb.id);
    expect(updatedRuleInDb.oldString).toBe('new-pattern');
    expect(updatedRuleInDb.newString).toBe('new-replacement');
    expect(updatedRuleInDb.urlPattern).toBe('https://example.com');
    expect(updatedRuleInDb.isRegex).toBe(true);
    expect(updatedRuleInDb.isActive).toBe(false);

    // Assert - 他のルールが変更されていないことを確認
    const allRules = await repository.getAll();
    const rulesArray = allRules.toArray();
    const rule2InDb = rulesArray.find(r => r.oldString === 'pattern2')!;
    expect(rule2InDb.oldString).toBe('pattern2');
    expect(rule2InDb.newString).toBe('replacement2');
  });

  it('should update only specified properties while preserving others', async () => {
    // Arrange
    const existingRule = RewriteRule.fromParams(3, {
      oldString: 'pattern',
      newString: 'replacement',
      urlPattern: 'https://old.com',
      isRegex: false,
    });

    await repository.create(existingRule);

    // 作成されたルールのIDを取得
    const createdRules = await repository.getAll();
    const createdRulesArray = createdRules.toArray();
    const ruleInDb = createdRulesArray[0];

    const updatedRule = RewriteRule.fromParams(ruleInDb.id, {
      oldString: 'new-pattern',
      newString: 'replacement',
      urlPattern: 'https://old.com',
      isRegex: false,
    });

    // Act
    await repository.update(updatedRule);

    // Assert
    const updatedRuleInDb = await repository.getById(ruleInDb.id);

    expect(updatedRuleInDb.oldString).toBe('new-pattern');
    expect(updatedRuleInDb.newString).toBe('replacement');
    expect(updatedRuleInDb.urlPattern).toBe('https://old.com');
    expect(updatedRuleInDb.isRegex).toBe(false);
    expect(updatedRuleInDb.isActive).toBe(true);
  });

  it('should preserve all rules when updating one rule', async () => {
    // Arrange
    const rule1 = RewriteRule.fromParams(4, {
      oldString: 'pattern1',
      newString: 'replacement1',
      urlPattern: '',
      isRegex: false,
    });
    const rule2 = RewriteRule.fromParams(5, {
      oldString: 'pattern2',
      newString: 'replacement2',
      urlPattern: '',
      isRegex: false,
    });
    const rule3 = RewriteRule.fromParams(6, {
      oldString: 'pattern3',
      newString: 'replacement3',
      urlPattern: '',
      isRegex: false,
    });

    await repository.create(rule1);
    await repository.create(rule2);
    await repository.create(rule3);

    // 作成されたルールのIDを取得
    const createdRules = await repository.getAll();
    const createdRulesArray = createdRules.toArray();
    const rule2InDb = createdRulesArray.find(r => r.oldString === 'pattern2')!;

    const updatedRule = RewriteRule.fromParams(rule2InDb.id, {
      oldString: 'updated-pattern2',
      newString: 'updated-replacement2',
      urlPattern: '',
      isRegex: false,
    });

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
