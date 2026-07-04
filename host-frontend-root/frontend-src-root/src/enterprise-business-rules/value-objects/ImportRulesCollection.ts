import { RewriteRuleParams } from 'src/application/types/RewriteRuleParams';
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { createImportRuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

export const MAX_IMPORT_RULES_COUNT = 1000;

/**
 * ルール0件エラー
 */
export class EmptyRulesCollectionError extends Error {
  constructor() {
    super('インポートするルールがありません');
    this.name = 'EmptyRulesCollectionError';
  }
}

/**
 * ルール件数上限超過エラー
 */
export class RulesCollectionCountExceededError extends Error {
  constructor() {
    super(`ルール件数が上限（${MAX_IMPORT_RULES_COUNT}件）を超えています`);
    this.name = 'RulesCollectionCountExceededError';
  }
}

/**
 * rules配列エントリ構造不正エラー
 * rules 配列にオブジェクト以外（null/プリミティブ/配列）が混入した場合にスローする
 */
export class InvalidRuleEntryError extends Error {
  constructor(rawEntry: unknown) {
    super(`rules配列に不正なエントリが含まれています: ${JSON.stringify(rawEntry)}`);
    this.name = 'InvalidRuleEntryError';
  }
}

/**
 * ルールID重複エラー
 * インポートJSON内で同一IDのルールが複数存在する場合にスローする
 */
export class DuplicateRuleIdError extends Error {
  constructor(duplicatedIdList: string) {
    super(`インポートJSON内のルールIDが重複しています: ${duplicatedIdList}`);
    this.name = 'DuplicateRuleIdError';
  }
}

/**
 * インポートルール集合のValue Object
 * コンストラクタで0件チェック・件数上限チェック・エントリ構造チェック・ID重複チェックを行い、
 * RewriteRule[] を構築する。各チェック失敗時は対応するエラーをスローする。
 * ID採用ルール（リストアユースケース）: id有り=JSON内IDをそのまま採用 / id無し=UNASSIGNED_RULE_ID（DB側で自動採番）。
 * 各ルールのフィールドバリデーションは RewriteRule.fromParams() に委譲する。
 */
export class ImportRulesCollection {
  private readonly _rules: RewriteRule[];

  constructor(rawRules: unknown[]) {
    if (rawRules.length === 0) {
      throw new EmptyRulesCollectionError();
    }
    if (rawRules.length > MAX_IMPORT_RULES_COUNT) {
      throw new RulesCollectionCountExceededError();
    }
    ImportRulesCollection.validateEntriesAreObjects(rawRules);
    ImportRulesCollection.validateNoDuplicateIds(rawRules);
    this._rules = rawRules.map((raw) => ImportRulesCollection.toRewriteRule(raw));
  }

  toArray(): RewriteRule[] {
    return [...this._rules];
  }

  /**
   * rules 配列の各エントリがオブジェクトであることを検証する
   * @throws {InvalidRuleEntryError} null/プリミティブ/配列が混入している場合
   */
  private static validateEntriesAreObjects(rawRules: unknown[]): void {
    rawRules.forEach((raw) => {
      if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
        throw new InvalidRuleEntryError(raw);
      }
    });
  }

  /**
   * インポートJSON内の id 重複を事前検証する（id 未指定のエントリは対象外）
   * @throws {DuplicateRuleIdError} 同一 id が複数存在する場合
   */
  private static validateNoDuplicateIds(rawRules: unknown[]): void {
    const records = rawRules.map((raw) => raw as Record<string, unknown>);
    const ids = records.map((record) => record.id);
    const definedIds = ids.filter((id) => id !== undefined && id !== null);
    const duplicatedIds = definedIds.filter((id, index) => definedIds.indexOf(id) !== index);
    if (duplicatedIds.length === 0) {
      return;
    }
    const uniqueDuplicatedIds = [...new Set(duplicatedIds)];
    throw new DuplicateRuleIdError(uniqueDuplicatedIds.map(String).join(', '));
  }

  private static toRewriteRule(raw: unknown): RewriteRule {
    const ruleData = raw as Record<string, unknown>;
    const ruleId = createImportRuleId(ruleData.id);
    return RewriteRule.fromParams(ruleId, ruleData as unknown as RewriteRuleParams);
  }
}
