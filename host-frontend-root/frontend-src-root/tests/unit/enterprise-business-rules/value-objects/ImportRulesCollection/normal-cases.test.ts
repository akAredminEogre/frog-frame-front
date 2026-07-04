import { describe, expect, it } from 'vitest';

import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { UNASSIGNED_RULE_ID } from 'src/enterprise-business-rules/value-objects/ids/RuleId';
import { ImportRulesCollection } from 'src/enterprise-business-rules/value-objects/ImportRulesCollection';

const baseRuleFields = {
  oldString: 'pattern',
  newString: 'replacement',
  urlPattern: '',
  isRegex: false,
  isActive: true,
};

/**
 * ImportRulesCollection 正常系（案A: JSON内ID採用）
 * 1. id 指定ありのルールは JSON内IDをそのまま採用する
 * 2. id 未指定のルールは UNASSIGNED_RULE_ID（DB側で自動採番）を割り当てる
 * 3. isActive 未指定のルールも構築できる（省略可フィールド・デフォルト true）
 * 4. id 指定あり・未指定が混在してもそれぞれ正しく変換する
 */
describe('ImportRulesCollection - 正常系（案A: JSON内ID採用）', () => {
  it('id 指定ありのルールは JSON内IDをそのまま採用する', () => {
    const collection = new ImportRulesCollection([{ id: 7, ...baseRuleFields }]);

    const rules = collection.toArray();
    expect(rules).toHaveLength(1);
    expect(rules[0]).toBeInstanceOf(RewriteRule);
    expect(rules[0].id).toBe(7);
  });

  it('id 未指定のルールは UNASSIGNED_RULE_ID を割り当てる', () => {
    const collection = new ImportRulesCollection([{ ...baseRuleFields }]);

    const rules = collection.toArray();
    expect(rules).toHaveLength(1);
    expect(rules[0].id).toBe(UNASSIGNED_RULE_ID);
  });

  it('isActive 未指定のルールも構築できる（省略可フィールド）', () => {
    const { isActive, ...fieldsWithoutIsActive } = baseRuleFields;
    const collection = new ImportRulesCollection([{ id: 2, ...fieldsWithoutIsActive }]);

    const rules = collection.toArray();
    expect(rules).toHaveLength(1);
    expect(rules[0].isActive).toBe(true);
  });

  it('id 指定あり・未指定が混在してもそれぞれ正しく変換する', () => {
    const collection = new ImportRulesCollection([
      { id: 3, ...baseRuleFields, oldString: 'a' },
      { ...baseRuleFields, oldString: 'b' },
      { id: 5, ...baseRuleFields, oldString: 'c' },
    ]);

    const rules = collection.toArray();
    expect(rules).toHaveLength(3);
    expect(rules.find(r => r.oldString === 'a')!.id).toBe(3);
    expect(rules.find(r => r.oldString === 'b')!.id).toBe(UNASSIGNED_RULE_ID);
    expect(rules.find(r => r.oldString === 'c')!.id).toBe(5);
  });
});
