/**
 * バイトサイズ計算のポートインターフェース
 * CA準拠: Use-case層がBlob APIに直接依存しないよう抽象化する
 */
export interface IByteSizeCalculator {
  /**
   * テキスト文字列のバイトサイズを計算する
   * @param text バイト数計算対象のテキスト文字列
   * @returns バイト数
   */
  calculateByteSize(text: string): number;
}
