import { PatternProcessingStrategy } from "src/domain/strategies/PatternProcessingStrategy";
import { HtmlWhitespacePatternProcessor } from "src/domain/utils/HtmlWhitespacePatternProcessor";

/**
 * 正規表現パターン処理戦略
 * 正規表現フラグがtrueの場合のパターン処理を担当
 */
export class RegexPatternProcessingStrategy implements PatternProcessingStrategy {
  public readonly htmlWhitespaceProcessor: HtmlWhitespacePatternProcessor;

  constructor(pattern: string) {
    this.htmlWhitespaceProcessor = new HtmlWhitespacePatternProcessor(pattern);
  }

  /**
   * 正規表現パターンを改行コード無視パターンに変換する
   * 正規表現の場合はエスケープ処理を行わずに直接変換する
   * @param pattern 正規表現パターン文字列
   * @returns HTML要素間改行コード無視処理を適用したパターン文字列
   * 使用するメンバ変数: htmlWhitespaceProcessor
   */
  public processPattern(pattern: string): string {
    const processor = new HtmlWhitespacePatternProcessor(pattern);
    return processor.addHtmlWhitespaceIgnoringPattern();
  }
}
