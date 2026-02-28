/**
 * ルールJSONファイルのスキーマ型定義
 * インポート・エクスポート機能で共用し、両機能の整合性を保証する
 */

/**
 * ルールエントリの厳密な型（エクスポート時・バリデーション通過後）
 * フィールド定義を変更する際は、インポート・エクスポート両機能への影響を確認すること
 */
export interface RulesJsonRuleEntry {
  id: number;
  oldString: string;
  newString: string;
  urlPattern: string;
  isRegex: boolean;
  isActive: boolean;
}

/**
 * パース直後のルールエントリ型（インポート時のバリデーション前）
 * JSON.parse後は型が不確定なため、全フィールドをunknownとして扱う
 * RulesJsonRuleEntry と同一フィールドを持ち、インポート・エクスポートの整合性を担保する
 */
export type RulesJsonRuleEntryRaw = Partial<Record<keyof RulesJsonRuleEntry, unknown>>;

/**
 * ルールJSONファイル全体のスキーマ（エクスポート時）
 * version: スキーマ互換性管理用のバージョン識別子
 * exportedAt: エクスポート日時（ISO 8601形式、タイムゾーンオフセット付き）
 */
export interface RulesJsonFileSchema {
  version: string;
  exportedAt: string;
  rules: RulesJsonRuleEntry[];
}
