/**
 * ImportRulesJsonユースケースのカスタムエラークラス群
 * エラーメッセージの詳細をInteractorに知らせない設計。
 * Interactorはこれらのエラークラスをnewして投げるだけでよく、
 * メッセージ文字列を直接知る必要はない。
 */

/** ルール件数上限（ビジネスルール）*/
export const MAX_RULE_COUNT = 1000;

/** 不正なJSON形式 */
export class InvalidJsonImportError extends Error {
  constructor() {
    super('不正なJSONファイルです');
    this.name = 'InvalidJsonImportError';
  }
}

/** スキーマ不正（versionとrulesが必要） */
export class InvalidSchemaImportError extends Error {
  constructor() {
    super('JSONスキーマが不正です（versionとrulesが必要です）');
    this.name = 'InvalidSchemaImportError';
  }
}

/** 未対応バージョン */
export class UnsupportedVersionImportError extends Error {
  constructor(version: unknown) {
    super(`未対応のバージョンです: ${String(version)}`);
    this.name = 'UnsupportedVersionImportError';
  }
}

/** ルールが0件 */
export class EmptyRulesImportError extends Error {
  constructor() {
    super('インポートするルールがありません');
    this.name = 'EmptyRulesImportError';
  }
}

/** ルール件数上限超過 */
export class RuleCountExceededImportError extends Error {
  constructor() {
    super(`ルール件数が上限（${MAX_RULE_COUNT}件）を超えています`);
    this.name = 'RuleCountExceededImportError';
  }
}

/** oldStringが欠落または空白 */
export class MissingFieldImportError extends Error {
  constructor(ruleIndex: number) {
    super(`ルール #${ruleIndex}: oldStringが欠落または空白です`);
    this.name = 'MissingFieldImportError';
  }
}

/** ストレージ操作エラー */
export class StorageImportError extends Error {
  constructor(cause: unknown) {
    super(`インポート処理中にエラーが発生しました: ${cause instanceof Error ? cause.message : String(cause)}`);
    this.name = 'StorageImportError';
  }
}
