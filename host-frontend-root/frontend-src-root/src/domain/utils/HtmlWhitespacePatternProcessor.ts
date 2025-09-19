/**
 * HTML要素間の改行コードとスペースを無視するパターン処理ユーティリティ
 * 複数のStrategyクラス間で共通して使用される処理を提供
 */
export class HtmlWhitespacePatternProcessor {
  constructor(
    private readonly pattern: string
  ) {}

  /**
   * HTML要素間の改行コードとスペースを無視するパターンを追加する
   * @returns HTML要素間改行コード無視処理を適用したパターン文字列
   * 使用するメンバ変数: pattern
   */
  public addHtmlWhitespaceIgnoringPattern(): string {
    return this.pattern
      .replace(/</g, '(?:\\s*)<')
      .replace(/>/g, '>(?:\\s*)');
  }
}
