/**
 * ルールJSONインポート成功時の出力データ
 * インポートされたルール件数と置換前の件数を保持する
 */
export class ImportRulesJsonOutputData {
  constructor(
    public readonly importedCount: number,
    public readonly previousCount: number
  ) {}
}
