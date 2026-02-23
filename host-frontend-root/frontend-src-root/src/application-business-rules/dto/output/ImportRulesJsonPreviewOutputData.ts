/**
 * ルールJSONインポートのプレビュー確認ダイアログ用データ
 * 現在のルール件数とインポート後の件数を保持する
 */
export class ImportRulesJsonPreviewOutputData {
  constructor(
    public readonly currentRuleCount: number,
    public readonly importRuleCount: number
  ) {}
}
