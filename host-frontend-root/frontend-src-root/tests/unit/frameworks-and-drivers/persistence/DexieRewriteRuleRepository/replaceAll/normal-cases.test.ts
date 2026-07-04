import 'tests/unit/infrastructure/persistence/indexeddb/setup';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { UNASSIGNED_RULE_ID } from 'src/enterprise-business-rules/value-objects/ids/RuleId';
import { DexieRewriteRuleRepository } from 'src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository';
import { dexieDatabase } from 'src/infrastructure/persistence/indexeddb/DexieDatabase';

const baseParams = {
  oldString: 'pattern',
  newString: 'replacement',
  urlPattern: '',
  isRegex: false,
};

/**
 * DexieRewriteRuleRepository.replaceAll - 正常系（案A: JSON内ID採用リストア）
 * 1. id 指定ありのルールは JSON内IDを保持してリストアされる（真のリストア）
 * 2. id 未指定（UNASSIGNED_RULE_ID）のルールは DB側で自動採番される
 * 3. id 指定あり・未指定が混在しても採番済IDと自動採番IDが衝突しない
 */
describe('DexieRewriteRuleRepository.replaceAll - 正常系（案A: JSON内ID採用）', () => {
  let repository: DexieRewriteRuleRepository;

  beforeEach(async () => {
    await dexieDatabase.rewriteRules.clear();
    repository = new DexieRewriteRuleRepository();
  });

  afterEach(async () => {
    await dexieDatabase.rewriteRules.clear();
  });

  it('id 指定ありのルールは JSON内IDを保持してリストアされる', async () => {
    const rules = [
      RewriteRule.fromParams(100, { ...baseParams, oldString: 'a' }),
      RewriteRule.fromParams(200, { ...baseParams, oldString: 'b' }),
    ];

    await repository.replaceAll(rules);

    const stored = (await repository.getAll()).toArray();
    expect(stored).toHaveLength(2);
    expect(stored.find(r => r.oldString === 'a')!.id).toBe(100);
    expect(stored.find(r => r.oldString === 'b')!.id).toBe(200);
  });

  it('id 未指定のルールは DB側で自動採番される', async () => {
    const rules = [
      RewriteRule.fromParams(UNASSIGNED_RULE_ID, { ...baseParams, oldString: 'a' }),
    ];

    await repository.replaceAll(rules);

    const stored = (await repository.getAll()).toArray();
    expect(stored).toHaveLength(1);
    // 自動採番されたIDは UNASSIGNED_RULE_ID(0) ではなく 1始まりの正の整数
    expect(stored[0].id).not.toBe(UNASSIGNED_RULE_ID);
    expect(stored[0].id).toBeGreaterThan(0);
  });

  it('id 指定あり・未指定が混在しても採番済IDと自動採番IDが衝突しない', async () => {
    const rules = [
      RewriteRule.fromParams(10, { ...baseParams, oldString: 'assigned' }),
      RewriteRule.fromParams(UNASSIGNED_RULE_ID, { ...baseParams, oldString: 'unassigned' }),
    ];

    await repository.replaceAll(rules);

    const stored = (await repository.getAll()).toArray();
    expect(stored).toHaveLength(2);
    const assigned = stored.find(r => r.oldString === 'assigned')!;
    const unassigned = stored.find(r => r.oldString === 'unassigned')!;
    expect(assigned.id).toBe(10);
    expect(unassigned.id).not.toBe(assigned.id);
    expect(unassigned.id).toBeGreaterThan(0);
  });
});
