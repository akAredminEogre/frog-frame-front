/**
 * ルールJSONエクスポート成功時の出力データ
 * エクスポート用JSON文字列とファイル名を保持
 */
export class ExportRulesJsonOutputData {
  constructor(
    public readonly jsonContent: string,
    public readonly fileName: string
  ) {}
}
