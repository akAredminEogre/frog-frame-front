/**
 * ルールJSONインポートの入力データ
 * fileSizeBytes, fileText は F&D 境界で変換済みの値を受け取る（DOM File は ABR 層に持ち込まない）
 */
export class ImportRulesJsonInputData {
  constructor(
    public readonly fileSizeBytes: number,
    public readonly fileText: string
  ) {}
}
