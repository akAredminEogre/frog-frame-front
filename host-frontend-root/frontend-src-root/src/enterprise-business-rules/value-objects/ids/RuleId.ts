import type { Opaque } from 'type-fest';

import { InvalidRuleIdError } from 'src/enterprise-business-rules/errors/InvalidRuleIdError';

export type RuleId = Opaque<number, 'RuleId'>;

export const createRuleId = (raw: unknown): RuleId => {
  if (typeof raw !== 'number' || !Number.isInteger(raw) || raw < 0) {
    throw new InvalidRuleIdError(raw);
  }
  return raw as RuleId;
};
