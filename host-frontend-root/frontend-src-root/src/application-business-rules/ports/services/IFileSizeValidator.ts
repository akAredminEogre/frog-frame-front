/**
 * ファイルサイズ検証のポートインターフェース
 * CA準拠: Use-case層がFile.size APIに直接依存しないよう抽象化する
 */
export interface IFileSizeValidator {
  /**
   * ファイルが最大サイズを超えているか確認する
   * @param file 検証対象のFileオブジェクト
   * @returns 最大サイズを超えている場合はtrue
   */
  isExceedingMaxSize(file: File): boolean;

  /**
   * 許容する最大バイトサイズ
   */
  readonly maxSizeBytes: number;
}
