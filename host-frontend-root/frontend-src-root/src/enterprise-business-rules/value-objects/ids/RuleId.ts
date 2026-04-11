import type { Opaque } from 'type-fest';

export type RuleId = Opaque<number, 'RuleId'>;

export const createRuleId = (raw: unknown): RuleId => {
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0) {
    throw new Error(`Invalid RuleId: ${String(raw)}`);
  }
  return raw as RuleId;
};
