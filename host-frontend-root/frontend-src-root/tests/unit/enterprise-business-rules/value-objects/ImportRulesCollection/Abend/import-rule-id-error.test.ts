import { describe, expect, it } from 'vitest';

import { ImportRulesJsonErrorOutputData } from 'src/application-business-rules/dto/output/ImportRulesJsonErrorOutputData';
import { InvalidRuleIdError } from 'src/enterprise-business-rules/errors/InvalidRuleIdError';
import {
  ImportRuleIdError,
  ImportRulesCollection,
} from 'src/enterprise-business-rules/value-objects/ImportRulesCollection';

const baseRuleFields = {
  oldString: 'pattern',
  newString: 'replacement',
  urlPattern: '',
  isRegex: false,
  isActive: true,
};

/**
 * ImportRuleIdError 境界ラッピング（US-021 AC-3-1）
 * 低層 createRuleId/createImportRuleId の英語契約（InvalidRuleIdError）は不変のまま、
 * index が既知の ImportRulesCollection 境界で日本語＋「ルール#N」（1始まり）に
 * ラップされることを検証する。低層 InvalidRuleIdError は cause として保持される。
 */
describe('ImportRuleIdError - 境界ラッピング（日本語・対象ルール番号）', () => {
  it('不正IDのルールは境界で ImportRuleIdError にラップされ日本語メッセージを持つ', () => {
    const rules = [{ id: -1, ...baseRuleFields }];
    let caught: unknown;
    try {
      new ImportRulesCollection(rules);
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(ImportRuleIdError);
    const err = caught as ImportRuleIdError;
    expect(err.message).toBe(
      'ルール#1 の ID「-1」は無効です（IDは安全整数の範囲内の正の整数である必要があり、未採番を表す 0 は指定できません）'
    );
  });

  it('対象ルール番号は1始まりで、不正エントリの位置（2件目）を指す', () => {
    const rules = [
      { id: 1, ...baseRuleFields },
      { id: -5, ...baseRuleFields },
    ];
    let caught: unknown;
    try {
      new ImportRulesCollection(rules);
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(ImportRuleIdError);
    const err = caught as ImportRuleIdError;
    expect(err.ruleNumber).toBe(2);
    expect(err.message).toContain('ルール#2 の ID「-5」は無効です');
  });

  it('低層の英語 InvalidRuleIdError を cause として保持する（低層契約は非破壊）', () => {
    const rules = [{ id: 1.5, ...baseRuleFields }];
    let caught: unknown;
    try {
      new ImportRulesCollection(rules);
    } catch (error) {
      caught = error;
    }
    const err = caught as ImportRuleIdError;
    expect(err.cause).toBeInstanceOf(InvalidRuleIdError);
    expect(err.cause?.message).toBe('Invalid RuleId: 1.5');
  });

  it('ImportRuleIdError は fromError で validation に分類され日本語メッセージを保持する', () => {
    const cause = new InvalidRuleIdError(-1);
    const error = new ImportRuleIdError(3, -1, cause);
    const output = ImportRulesJsonErrorOutputData.fromError(error);
    expect(output.errorType).toBe('validation');
    expect(output.message).toContain('ルール#3 の ID「-1」は無効です');
  });
});
