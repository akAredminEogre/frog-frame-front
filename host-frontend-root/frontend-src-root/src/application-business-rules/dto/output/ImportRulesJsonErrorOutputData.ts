/**
 * ルールJSONインポートエラーの出力データ
 * エラー種別とユーザー向けメッセージを保持する。
 * メッセージはエラーオブジェクトから自動抽出するため、
 * Interactorが直接メッセージ文字列を知る必要はない。
 */
export class ImportRulesJsonErrorOutputData {
  private readonly _message: string;

  constructor(
    public readonly error: unknown,
    public readonly errorType: 'parse' | 'validation' | 'storage'
  ) {
    this._message = error instanceof Error ? error.message : String(error);
  }

  get message(): string {
    return this._message;
  }
}
