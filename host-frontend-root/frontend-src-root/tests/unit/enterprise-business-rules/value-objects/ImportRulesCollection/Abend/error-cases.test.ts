import { describe, expect, it } from 'vitest';

import {
  DuplicateRuleIdError,
  EmptyRulesCollectionError,
  ImportRulesCollection,
  InvalidRuleEntryError,
  MAX_IMPORT_RULES_COUNT,
  RulesCollectionCountExceededError,
} from 'src/enterprise-business-rules/value-objects/ImportRulesCollection';

const baseRuleFields = {
  oldString: 'pattern',
  newString: 'replacement',
  urlPattern: '',
  isRegex: false,
  isActive: true,
};

/**
 * ImportRulesCollection 異常系
 * 1. 0件は EmptyRulesCollectionError
 * 2. 上限超過は RulesCollectionCountExceededError
 * 3. rules 配列に非オブジェクト（null）混入は InvalidRuleEntryError（論点3）
 * 4. rules 配列にプリミティブ混入は InvalidRuleEntryError（論点3）
 * 5. rules 配列に配列混入は InvalidRuleEntryError（論点3）
 * 6. JSON内でIDが重複する場合は DuplicateRuleIdError（案A: 事前重複検証）
 */
describe('ImportRulesCollection - 異常系', () => {
  it('0件の場合は EmptyRulesCollectionError をthrowする', () => {
    expect(() => new ImportRulesCollection([])).toThrow(EmptyRulesCollectionError);
  });

  it('上限超過の場合は RulesCollectionCountExceededError をthrowする', () => {
    const tooMany = Array.from({ length: MAX_IMPORT_RULES_COUNT + 1 }, () => ({
      ...baseRuleFields,
    }));
    expect(() => new ImportRulesCollection(tooMany)).toThrow(RulesCollectionCountExceededError);
  });

  it('rules 配列に null が混入する場合は InvalidRuleEntryError をthrowする', () => {
    expect(() => new ImportRulesCollection([null])).toThrow(InvalidRuleEntryError);
  });

  it('rules 配列にプリミティブが混入する場合は InvalidRuleEntryError をthrowする', () => {
    expect(() => new ImportRulesCollection([42])).toThrow(InvalidRuleEntryError);
  });

  it('rules 配列に配列が混入する場合は InvalidRuleEntryError をthrowする', () => {
    expect(() => new ImportRulesCollection([[]])).toThrow(InvalidRuleEntryError);
  });

  it('JSON内でIDが重複する場合は DuplicateRuleIdError をthrowする', () => {
    const rules = [
      { id: 1, ...baseRuleFields },
      { id: 1, ...baseRuleFields },
    ];
    expect(() => new ImportRulesCollection(rules)).toThrow(DuplicateRuleIdError);
    expect(() => new ImportRulesCollection(rules)).toThrow('1');
  });
});
