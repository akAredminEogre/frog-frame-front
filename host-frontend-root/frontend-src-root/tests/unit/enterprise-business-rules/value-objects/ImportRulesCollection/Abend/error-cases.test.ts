import { describe, expect, it } from 'vitest';

import {
  DuplicateRuleIdError,
  EmptyRulesCollectionError,
  ImportRuleIdError,
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
 * 7. 必須フィールド欠落・型不正は InvalidRuleEntryError（フィールド単位検証）
 * 8. id: 0 は未採番sentinelと衝突するため境界で ImportRuleIdError（日本語・ルール#N）に
 *    ラップして throw（低層 InvalidRuleIdError を cause 保持）
 * 9. 安全整数範囲外(Number.isSafeInteger=false)の重複IDは、重複検知の対象外となり
 *    境界の ImportRuleIdError を優先（重複検知基準を createRuleId と揃えた回帰テスト）
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

  it('必須フィールドが欠落する場合（id のみ）は InvalidRuleEntryError をthrowする', () => {
    expect(() => new ImportRulesCollection([{ id: 1 }])).toThrow(InvalidRuleEntryError);
  });

  it('oldString が文字列でない場合は InvalidRuleEntryError をthrowする', () => {
    const rules = [{ ...baseRuleFields, oldString: 123 }];
    expect(() => new ImportRulesCollection(rules)).toThrow(InvalidRuleEntryError);
  });

  it('isRegex が真偽値でない場合は InvalidRuleEntryError をthrowする', () => {
    const rules = [{ ...baseRuleFields, isRegex: 'false' }];
    expect(() => new ImportRulesCollection(rules)).toThrow(InvalidRuleEntryError);
  });

  it('isActive 指定ありで真偽値でない場合は InvalidRuleEntryError をthrowする', () => {
    const rules = [{ ...baseRuleFields, isActive: 'true' }];
    expect(() => new ImportRulesCollection(rules)).toThrow(InvalidRuleEntryError);
  });

  it('id: 0 は未採番sentinelと衝突するため境界で ImportRuleIdError（日本語・ルール#N付与）をthrowする', () => {
    const rules = [{ id: 0, ...baseRuleFields }];
    // 低層 createImportRuleId は英語 InvalidRuleIdError を投げるが、index が既知の
    // ImportRulesCollection 境界で日本語＋「ルール#1」付与の ImportRuleIdError にラップされる。
    expect(() => new ImportRulesCollection(rules)).toThrow(ImportRuleIdError);
    expect(() => new ImportRulesCollection(rules)).toThrow('ルール#1 の ID「0」は無効です');
  });

  it('id: 0 が重複していても、重複検知より先に未採番sentinel衝突の ImportRuleIdError を優先する', () => {
    const rules = [
      { id: 0, ...baseRuleFields },
      { id: 0, ...baseRuleFields },
    ];
    // 重複検知は「採番済みの有効なID（正の整数）」のみ対象のため 0 はスキップされ、
    // 後段の createImportRuleId 由来の InvalidRuleIdError が境界で ImportRuleIdError にラップされる。
    expect(() => new ImportRulesCollection(rules)).toThrow(ImportRuleIdError);
    expect(() => new ImportRulesCollection(rules)).toThrow('ルール#1 の ID「0」は無効です');
    expect(() => new ImportRulesCollection(rules)).not.toThrow(DuplicateRuleIdError);
  });

  it('id が型不正（文字列）で重複していても、DuplicateRuleIdError ではなく ImportRuleIdError を優先する', () => {
    const rules = [
      { id: '5', ...baseRuleFields },
      { id: '5', ...baseRuleFields },
    ];
    expect(() => new ImportRulesCollection(rules)).toThrow(ImportRuleIdError);
    expect(() => new ImportRulesCollection(rules)).toThrow('ルール#1 の ID「5」は無効です');
    expect(() => new ImportRulesCollection(rules)).not.toThrow(DuplicateRuleIdError);
  });

  it('id が安全整数範囲外で重複していても、DuplicateRuleIdError ではなく ImportRuleIdError を優先する', () => {
    // Number.isSafeInteger(unsafeId) === false のため重複検知の対象外となり、
    // createRuleId の Number.isSafeInteger ガードで InvalidRuleIdError → 境界で ImportRuleIdError となる。
    // （重複検知が Number.isInteger だと DuplicateRuleIdError が先に発火し優先順位が壊れる回帰）
    const unsafeId = Number.MAX_SAFE_INTEGER + 1;
    const rules = [
      { id: unsafeId, ...baseRuleFields },
      { id: unsafeId, ...baseRuleFields },
    ];
    expect(() => new ImportRulesCollection(rules)).toThrow(ImportRuleIdError);
    expect(() => new ImportRulesCollection(rules)).toThrow(`ルール#1 の ID「${unsafeId}」は無効です`);
    expect(() => new ImportRulesCollection(rules)).not.toThrow(DuplicateRuleIdError);
  });
});
