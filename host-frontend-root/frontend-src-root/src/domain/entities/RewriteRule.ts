import { PatternProcessingStrategyFactory } from "src/domain/factories/PatternProcessingStrategyFactory";

export class RewriteRule {
  constructor(
    public readonly id: string,
    public readonly oldString: string,
    public readonly newString: string,
    public readonly urlPattern?: string,
    public readonly isRegex: boolean = false
  ) {}

  /**
   * パターンを改行コードを無視するように変換する統合メソッド
   * Strategyパターンを使用してif句を除去し、将来のフラグ拡張に対応
   * @returns 改行コードを無視する正規表現パターン文字列
   * 使用するメンバ変数: oldString, isRegex
   */
  public createRedundantPattern(): string {
    const strategy = PatternProcessingStrategyFactory.createStrategy(this.isRegex, this.oldString);
    const processedPattern = strategy.processPattern();
    return this.addHtmlWhitespaceIgnoringPattern(processedPattern);
  }

  /**
   * HTML要素間の改行コードとスペースを無視するパターンを追加する
   * @param pattern 処理対象のパターン文字列
   * @returns HTML要素間改行コード無視処理を適用したパターン文字列
   */
  private addHtmlWhitespaceIgnoringPattern(pattern: string): string {
    return pattern
      .replace(/</g, '(?:\\s*)<')
      .replace(/>/g, '>(?:\\s*)');
  }
}
