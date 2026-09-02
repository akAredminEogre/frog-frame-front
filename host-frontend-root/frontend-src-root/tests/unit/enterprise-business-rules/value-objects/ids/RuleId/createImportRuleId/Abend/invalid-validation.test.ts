import { describe, expect, it } from 'vitest';

import { createImportRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

/**
 * createImportRuleId 異常系
 * id 指定がある場合は createRuleId と同一の検証を行うため、
 * 不正な id（文字列・負数・小数）は InvalidRuleIdError をthrowする。
 * 0 は未採番sentinel（UNASSIGNED_RULE_ID）と衝突するため明示指定を拒否する。
 * （id 未指定 undefined/null は自動採番扱いのため throw しない → 正常系で検証）
 */
describe('createImportRuleId - 不正なid指定バリデーション', () => {
  it('文字列の場合はエラーをthrowする', () => {
    expect(() => createImportRuleId('abc')).toThrow('Invalid RuleId: abc');
  });

  it('0の場合は未採番sentinelと衝突するためエラーをthrowする', () => {
    expect(() => createImportRuleId(0)).toThrow('Invalid RuleId: 0');
  });

  it('負数の場合はエラーをthrowする', () => {
    expect(() => createImportRuleId(-1)).toThrow('Invalid RuleId: -1');
  });

  it('小数の場合はエラーをthrowする', () => {
    expect(() => createImportRuleId(1.5)).toThrow('Invalid RuleId: 1.5');
  });
});
