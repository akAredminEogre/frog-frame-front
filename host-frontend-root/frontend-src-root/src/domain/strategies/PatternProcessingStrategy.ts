import { HtmlWhitespacePatternProcessor } from "src/domain/utils/HtmlWhitespacePatternProcessor";

/**
 * パターン処理戦略の共通インターフェース
 * 異なるパターン処理方式を統一的に扱うためのStrategy pattern実装
 */
export interface PatternProcessingStrategy {
  /**
   * HTML要素間改行コード無視処理を行うプロセッサ
   * 使用するメンバ変数: htmlWhitespaceProcessor
   */
  readonly htmlWhitespaceProcessor: HtmlWhitespacePatternProcessor;

  /**
   * パターン文字列を処理して改行コード無視パターンに変換する
   * メンバ変数として保持したoldStringを参照して処理を行う
   * @returns 変換されたパターン文字列
   */
  processPattern(): string;
}
