/**
 * パターン処理戦略の共通インターフェース
 * 異なるパターン処理方式を統一的に扱うためのStrategy pattern実装
 */
export interface PatternProcessingStrategy {
  /**
   * メンバ変数として保持したoldStringを参照して処理を行う
   * @returns 変換されたパターン文字列
   */
  processPattern(): string;
}
