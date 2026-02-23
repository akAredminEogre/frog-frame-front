/**
 * ルールJSONインポートエラーの出力データ
 * エラー種別とユーザー向けメッセージを保持する
 */
export class ImportRulesJsonErrorOutputData {
  private readonly _message: string;

  constructor(
    public readonly error: unknown,
    public readonly errorType: 'parse' | 'validation' | 'storage',
    userMessage: string
  ) {
    this._message = userMessage;
  }

  get message(): string {
    return this._message;
  }
}
