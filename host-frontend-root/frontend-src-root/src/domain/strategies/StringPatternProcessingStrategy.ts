import { PatternProcessingStrategy } from "src/domain/strategies/PatternProcessingStrategy";
import { HtmlWhitespacePatternProcessor } from "src/domain/utils/HtmlWhitespacePatternProcessor";

/**
 * 文字列パターン処理戦略
 * 正規表現フラグがfalseまたは未定義の場合のパターン処理を担当
 */
export class StringPatternProcessingStrategy implements PatternProcessingStrategy {
  public readonly htmlWhitespaceProcessor: HtmlWhitespacePatternProcessor;

  constructor(pattern: string) {
    this.htmlWhitespaceProcessor = new HtmlWhitespacePatternProcessor(pattern);
  }

  /**
   * 文字列パターンを改行コード無視パターンに変換する
   * 通常文字列の場合は特殊文字をエスケープしてから変換する
   * @param pattern 文字列パターン
   * @returns HTML要素間改行コード無視処理を適用したパターン文字列
   * 使用するメンバ変数: htmlWhitespaceProcessor
   */
  public processPattern(pattern: string): string {
    const escapedPattern = this.escapeRegexSpecialChars(pattern);
    const processor = new HtmlWhitespacePatternProcessor(escapedPattern);
    return processor.addHtmlWhitespaceIgnoringPattern();
  }

  /**
   * 正規表現特殊文字をエスケープする
   * @param input エスケープ対象の文字列
   * @returns エスケープされた文字列
   */
  private escapeRegexSpecialChars(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
