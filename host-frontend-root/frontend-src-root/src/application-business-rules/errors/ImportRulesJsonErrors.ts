/**
 * ImportRulesJsonユースケースのカスタムエラークラス群
 * エラーメッセージの詳細をInteractorに知らせない設計。
 * Interactorはこれらのエラークラスをnewして投げるだけでよく、
 * メッセージ文字列を直接知る必要はない。
 */

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

/** ストレージ操作エラー */
export class StorageImportError extends Error {
  constructor(cause: unknown) {
    super(`インポート処理中にエラーが発生しました: ${cause instanceof Error ? cause.message : String(cause)}`);
    this.name = 'StorageImportError';
  }
}
