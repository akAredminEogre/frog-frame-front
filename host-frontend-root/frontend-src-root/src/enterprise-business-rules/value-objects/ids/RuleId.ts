import type { Opaque } from 'type-fest';

import { InvalidRuleIdError } from 'src/enterprise-business-rules/errors/InvalidRuleIdError';

export type RuleId = Opaque<number, 'RuleId'>;

export const createRuleId = (raw: unknown): RuleId => {
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0) {
    throw new InvalidRuleIdError(raw);
  }
  return raw as RuleId;
};

/**
 * 未採番を表す予約RuleId。
 * インポートJSONに id が無いルールへ割り当て、永続化時はDB側の自動採番に委ねる。
 * Dexie(IndexedDB)の自動採番は1始まりのため、実データのIDと衝突しない。
 */
export const UNASSIGNED_RULE_ID = 0 as RuleId;

export const isUnassignedRuleId = (ruleId: RuleId): boolean => ruleId === UNASSIGNED_RULE_ID;

/**
 * インポートJSON用のRuleId生成。
 * id 未指定（undefined/null）の場合は UNASSIGNED_RULE_ID を返しDB側の自動採番に委ねる。
 * id 指定がある場合は createRuleId と同一の検証を行い、そのIDを採用する（リストアユースケース）。
 */
export const createImportRuleId = (raw: unknown): RuleId => {
  if (raw === undefined || raw === null) {
    return UNASSIGNED_RULE_ID;
  }
  return createRuleId(raw);
};
