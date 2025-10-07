import { PatternProcessingStrategyFactory } from "./PatternProcessingStrategyFactory";
import { RegexConstants } from "src/domain/constants/RegexConstants";

export class RewriteRule {
  // HTML要素間改行コード無視処理用の正規表現定数をメンバ変数として保持
  private readonly htmlOpenTagPattern: RegExp;
  private readonly htmlCloseTagPattern: RegExp;
  private readonly htmlWhitespaceBeforeOpenTag: string;
  private readonly htmlWhitespaceAfterCloseTag: string;

  constructor(
    public readonly id: string,
    public readonly oldString: string,
    public readonly newString: string,
    public readonly urlPattern: string,
    public readonly isRegex: boolean = false
  ) {
    // 正規表現関連の定数をメンバ変数として初期化
    this.htmlOpenTagPattern = RegexConstants.HTML_OPEN_TAG_PATTERN;
    this.htmlCloseTagPattern = RegexConstants.HTML_CLOSE_TAG_PATTERN;
    this.htmlWhitespaceBeforeOpenTag = RegexConstants.HTML_WHITESPACE_BEFORE_OPEN_TAG;
    this.htmlWhitespaceAfterCloseTag = RegexConstants.HTML_WHITESPACE_AFTER_CLOSE_TAG;
  }

  /**
   * プレーンオブジェクトからRewriteRuleインスタンスを生成するファクトリーメソッド
   * @param ruleData プレーンオブジェクトのRewriteRuleデータ
   * @returns RewriteRuleインスタンス
   * @throws {Error} ruleDataがnull、undefined、非オブジェクト、または空オブジェクトの場合
   */
  static fromPlainObject(ruleData: any): RewriteRule {
    // null/undefinedチェック
    if (ruleData == null) {
      throw new Error('ruleData cannot be null or undefined');
    }

    // オブジェクトかどうかのチェック（配列は除く）
    if (typeof ruleData !== 'object' || Array.isArray(ruleData)) {
      throw new Error('ruleData must be an object');
    }

    // 空オブジェクトチェック
    if (Object.keys(ruleData).length === 0) {
      throw new Error('ruleData cannot be an empty object');
    }

    return new RewriteRule(
      ruleData.id,
      ruleData.oldString,
      ruleData.newString,
      ruleData.urlPattern,
      ruleData.isRegex
    );
  }

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
      .replace(this.htmlOpenTagPattern, this.htmlWhitespaceBeforeOpenTag)
      .replace(this.htmlCloseTagPattern, this.htmlWhitespaceAfterCloseTag);
  }
}
