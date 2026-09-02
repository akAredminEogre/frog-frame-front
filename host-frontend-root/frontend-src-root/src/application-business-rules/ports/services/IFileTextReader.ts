/**
 * ファイルテキスト読み取りのポートインターフェース
 * CA準拠: Use-case層がFileReader APIに直接依存しないよう抽象化する
 */
export interface IFileTextReader {
  /**
   * ファイルをテキストとして読み取る
   * @param file 読み取り対象のFileオブジェクト
   * @returns 読み取ったテキスト文字列
   * @throws Error 読み取りに失敗した場合
   */
  readAsText(file: File): Promise<string>;
}
