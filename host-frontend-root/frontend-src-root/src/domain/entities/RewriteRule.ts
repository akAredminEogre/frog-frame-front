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
    return strategy.processPattern(this.oldString);
  }
}
