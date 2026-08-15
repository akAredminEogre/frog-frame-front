import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';
import { RewriteRuleParams } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRuleParams';
import { InvalidRuleIdError } from 'src/enterprise-business-rules/errors/InvalidRuleIdError';
import { createImportRuleId, RuleId } from 'src/enterprise-business-rules/value-objects/ids/RuleId';

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
 * インポート境界のルールID不正エラー（日本語・対象ルール番号付き）
 * US-021 AC-3-1 対応。低層 `createRuleId`/`createImportRuleId` は英語契約の
 * `InvalidRuleIdError`（型・メッセージ・error-strategy Map キー）を維持したまま、
 * index が既知の `ImportRulesCollection` 境界でのみ日本語のユーザー向け文言と
 * 「ルール#N」（1始まり）を付与して本エラーへラップする。
 * 低層の英語エラーは `cause` として保持し、契約・既存テストを非破壊に保つ。
 */
export class ImportRuleIdError extends Error {
  public readonly ruleNumber: number;
  public readonly cause?: InvalidRuleIdError;

  constructor(ruleNumber: number, rawId: unknown, cause: InvalidRuleIdError) {
    super(
      `ルール#${ruleNumber} の ID「${String(rawId)}」は無効です（IDは安全整数の範囲内の正の整数である必要があり、未採番を表す 0 は指定できません）`
    );
    Object.setPrototypeOf(this, ImportRuleIdError.prototype);
    this.name = 'ImportRuleIdError';
    this.ruleNumber = ruleNumber;
    this.cause = cause;
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
    this._rules = rawRules.map((raw, index) => ImportRulesCollection.toRewriteRule(raw, index));
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
   * 重複検知は「採番済みの有効なID（安全整数範囲内の正の整数）」のみを対象とし、
   * 未採番sentinel(0)・型不正・安全整数範囲外(Number.isSafeInteger=false)・undefined/null は
   * 後段の createImportRuleId/createRuleId の検証（InvalidRuleIdError）に委ねる。
   * createRuleId は Number.isSafeInteger で範囲外IDを拒否するため、ここでも同一基準を用いる。
   * これにより、安全整数範囲外の重複IDが DuplicateRuleIdError より先に検出される不整合を防ぎ、
   * エラーメッセージの責務（範囲外=InvalidRuleIdError / 範囲内重複=DuplicateRuleIdError）を分離する。
   * @throws {DuplicateRuleIdError} 同一の採番済みID（安全整数範囲内の正の整数）が複数存在する場合
   */
  private static validateNoDuplicateIds(rawRules: unknown[]): void {
    const records = rawRules.map((raw) => raw as Record<string, unknown>);
    const ids = records.map((record) => record.id);
    const assignedIds = ids.filter(
      (id): id is number => typeof id === 'number' && Number.isSafeInteger(id) && id > 0
    );
    const duplicatedIds = assignedIds.filter((id, index) => assignedIds.indexOf(id) !== index);
    if (duplicatedIds.length === 0) {
      return;
    }
    const uniqueDuplicatedIds = [...new Set(duplicatedIds)];
    throw new DuplicateRuleIdError(uniqueDuplicatedIds.map(String).join(', '));
  }

  /**
   * 1エントリを RewriteRule へ変換する。
   * ルールID生成で低層の英語 `InvalidRuleIdError` が発生した場合、index が既知の本境界で
   * 日本語＋「ルール#N」（1始まり）を付与した `ImportRuleIdError` にラップして再throwする。
   * @param ruleIndex rawRules 配列内の0始まりindex（メッセージには +1 した1始まり番号を用いる）
   * @throws {ImportRuleIdError} ルールID不正時（低層 InvalidRuleIdError を cause に保持）
   */
  private static toRewriteRule(raw: unknown, ruleIndex: number): RewriteRule {
    const ruleData = raw as Record<string, unknown>;
    let ruleId: RuleId;
    try {
      ruleId = createImportRuleId(ruleData.id);
    } catch (error) {
      if (error instanceof InvalidRuleIdError) {
        throw new ImportRuleIdError(ruleIndex + 1, ruleData.id, error);
      }
      throw error;
    }
    return RewriteRule.fromParams(ruleId, ruleData as unknown as RewriteRuleParams);
  }
}
