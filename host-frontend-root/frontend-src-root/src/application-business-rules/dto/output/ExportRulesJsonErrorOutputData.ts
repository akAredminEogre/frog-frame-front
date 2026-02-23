/**
 * ルールJSONエクスポートエラーの出力データ
 */
export class ExportRulesJsonErrorOutputData {
  public readonly message: string;

  constructor(error: unknown) {
    this.message = error instanceof Error ? error.message : String(error);
  }
}
