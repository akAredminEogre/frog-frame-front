/**
 * ルールJSONインポートの入力データ
 * byteSize は frameworks-and-drivers 層（Blob API）で計算し、
 * Use-case 層がインフラ詳細（Blob）に依存しないよう注入する。
 */
export class ImportRulesJsonInputData {
  constructor(
    public readonly jsonString: string,
    public readonly byteSize: number
  ) {}
}
