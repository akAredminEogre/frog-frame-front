import { describe, expect, it } from 'vitest';

import {
  createImportRuleId,
  UNASSIGNED_RULE_ID,
} from 'src/enterprise-business-rules/value-objects/ids/RuleId';

/**
 * createImportRuleId 正常系（案A: リストア用ID採用ルール）
 * 1. id 未指定（undefined）は UNASSIGNED_RULE_ID を返す（DB側で自動採番）
 * 2. id 未指定（null）は UNASSIGNED_RULE_ID を返す（DB側で自動採番）
 * 3. id 指定（正の整数）はそのIDをそのまま採用する
 */
describe('createImportRuleId - 正常系', () => {
  it('undefined の場合は UNASSIGNED_RULE_ID を返す', () => {
    expect(createImportRuleId(undefined)).toBe(UNASSIGNED_RULE_ID);
  });

  it('null の場合は UNASSIGNED_RULE_ID を返す', () => {
    expect(createImportRuleId(null)).toBe(UNASSIGNED_RULE_ID);
  });

  it('正の整数はそのIDをそのまま採用する', () => {
    expect(createImportRuleId(42)).toBe(42);
  });
});
