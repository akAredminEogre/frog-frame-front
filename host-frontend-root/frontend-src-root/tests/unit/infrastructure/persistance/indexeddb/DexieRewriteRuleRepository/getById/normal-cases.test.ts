import '../../setup';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { dexieDatabase } from 'src/infrastructure/persistance/indexeddb/DexieDatabase';

/**
 * 1. 指定されたIDのルールが存在する場合、そのRewriteRuleインスタンスを返却
 * 2. 全てのプロパティを持つルールを正しく取得
 *
 * 注意: DB側で自動採番されるため、create後にgetAllでIDを取得してからgetByIdを実行
 */
describe('DexieRewriteRuleRepository.getById - 正常系', () => {
  let repository: DexieRewriteRuleRepository;

  beforeEach(async () => {
    // データベーステーブルをクリア
    await dexieDatabase.rewriteRules.clear();

    repository = new DexieRewriteRuleRepository();
  });

  afterEach(async () => {
    await dexieDatabase.rewriteRules.clear();
  });

  it('should return RewriteRule instance when rule with specified ID exists', async () => {
    // Arrange
    const rule1 = new RewriteRule(
      1,
      'pattern1',
      'replacement1',
      '',
      false
    );
    const rule2 = new RewriteRule(
      2,
      'pattern2',
      'replacement2',
      'https://example.com',
      true
    );

    await repository.create(rule1);
    await repository.create(rule2);

    // 作成されたルールのIDを取得
    const createdRules = await repository.getAll();
    const createdRulesArray = createdRules.toArray();
    const rule1InDb = createdRulesArray.find(r => r.oldString === 'pattern1')!;

    // Act
    const result = await repository.getById(rule1InDb.id);

    // Assert
    expect(result).toBeInstanceOf(RewriteRule);
    expect(result.id).toBe(rule1InDb.id);
    expect(result.oldString).toBe('pattern1');
    expect(result.newString).toBe('replacement1');
    expect(result.urlPattern).toBe('');
    expect(result.isRegex).toBe(false);
  });

  it('should correctly retrieve rule with all properties', async () => {
    // Arrange
    const ruleWithAllProps = new RewriteRule(
      3,
      'old',
      'new',
      'https://test.com/*',
      true
    );

    await repository.create(ruleWithAllProps);

    // 作成されたルールのIDを取得
    const createdRules = await repository.getAll();
    const createdRulesArray = createdRules.toArray();
    const ruleInDb = createdRulesArray[0];

    // Act
    const result = await repository.getById(ruleInDb.id);

    // Assert
    expect(result).toBeInstanceOf(RewriteRule);
    expect(result.id).toBe(ruleInDb.id);
    expect(result.oldString).toBe('old');
    expect(result.newString).toBe('new');
    expect(result.urlPattern).toBe('https://test.com/*');
    expect(result.isRegex).toBe(true);
  });
});
