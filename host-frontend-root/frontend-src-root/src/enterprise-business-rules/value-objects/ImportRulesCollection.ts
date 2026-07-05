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
 * rules 配列にオブジェクト以外（null/プリミティブ/配列）が混入した場合、
 * または必須フィールド（oldString/newString/urlPattern/isRegex）の欠落・型不正の場合にスローする
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
 * 各ルールの必須フィールド（oldString/newString/urlPattern/isRegex）の有無・型もコンストラクタで検証する。
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
    ImportRulesCollection.validateEntryFields(rawRules);
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
   * rules 配列の各エントリが RewriteRule 構築に必要なフィールドを持つことを検証する
   * 必須: oldString/newString/urlPattern（文字列）・isRegex（真偽値）。isActive は省略可（指定時は真偽値）
   * @throws {InvalidRuleEntryError} 必須フィールドの欠落・型不正の場合
   */
  private static validateEntryFields(rawRules: unknown[]): void {
    rawRules.forEach((raw) => {
      const record = raw as Record<string, unknown>;
      if (!ImportRulesCollection.hasValidRuleFields(record)) {
        throw new InvalidRuleEntryError(raw);
      }
    });
  }

  private static hasValidRuleFields(record: Record<string, unknown>): boolean {
    const hasValidStringFields =
      typeof record.oldString === 'string' &&
      typeof record.newString === 'string' &&
      typeof record.urlPattern === 'string';
    const hasValidIsRegex = typeof record.isRegex === 'boolean';
    const hasValidIsActive = record.isActive === undefined || typeof record.isActive === 'boolean';
    return hasValidStringFields && hasValidIsRegex && hasValidIsActive;
  }

  /**
   * インポートJSON内の id 重複を事前検証する
   * 重複検知は「採番済みの有効なID（正の整数）」のみを対象とし、
   * 未採番sentinel(0)・型不正・undefined/null は後段の createImportRuleId/createRuleId の
   * 検証（InvalidRuleIdError）に委ねる。これによりエラーメッセージの責務を分離する。
   * @throws {DuplicateRuleIdError} 同一の採番済みIDが複数存在する場合
   */
  private static validateNoDuplicateIds(rawRules: unknown[]): void {
    const records = rawRules.map((raw) => raw as Record<string, unknown>);
    const ids = records.map((record) => record.id);
    const assignedIds = ids.filter(
      (id): id is number => typeof id === 'number' && Number.isInteger(id) && id > 0
    );
    const duplicatedIds = assignedIds.filter((id, index) => assignedIds.indexOf(id) !== index);
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
