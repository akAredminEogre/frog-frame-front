import type { Tagged } from 'type-fest';

import { InvalidRuleIdError } from 'src/enterprise-business-rules/errors/InvalidRuleIdError';

// type-fest 5.x では Opaque は非推奨（Tagged への別名）。後継の Tagged を用いる。
export type RuleId = Tagged<number, 'RuleId'>;

export const createRuleId = (raw: unknown): RuleId => {
  // Number.isSafeInteger を用いる: Number.isInteger は安全整数範囲(±2^53-1)外も許可するが、
  // その範囲外の値は JSON.parse で丸められ元IDを保持できず、リストア時にID同一性が壊れうる。
  // 安全整数のみ受け入れることで、丸めによるID衝突/取り違えを防ぐ。
  if (typeof raw !== 'number' || !Number.isSafeInteger(raw) || raw < 0) {
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
 * ただし 0 は未採番sentinel（UNASSIGNED_RULE_ID）と衝突するため拒否する（実データのIDは1始まり）。
 */
export const createImportRuleId = (raw: unknown): RuleId => {
  if (raw === undefined || raw === null) {
    return UNASSIGNED_RULE_ID;
  }
  const ruleId = createRuleId(raw);
  if (isUnassignedRuleId(ruleId)) {
    throw new InvalidRuleIdError(raw);
  }
  return ruleId;
};
