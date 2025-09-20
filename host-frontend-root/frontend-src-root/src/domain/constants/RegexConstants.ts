/**
 * 正規表現関連の定数クラス
 * 正規表現パターンとマジックナンバーを管理し、保守性と可読性を向上
 */
export class RegexConstants {
  /**
   * 正規表現特殊文字のエスケープ用パターン
   * StringPatternProcessingStrategyでの特殊文字エスケープに使用
   */
  public static readonly REGEX_SPECIAL_CHARACTERS_PATTERN = /[.*+?^${}()|[\]\\]/g;

  /**
   * 正規表現特殊文字のエスケープ用置換文字列
   * エスケープされた文字列への置換に使用
   */
  public static readonly ESCAPED_SPECIAL_CHARACTER_REPLACEMENT = '\\$&';

  /**
   * HTML開始タグ検索パターン
   * RewriteRuleでのHTML要素間改行コード無視処理に使用
   */
  public static readonly HTML_OPEN_TAG_PATTERN = /</g;

  /**
   * HTML終了タグ検索パターン
   * RewriteRuleでのHTML要素間改行コード無視処理に使用
   */
  public static readonly HTML_CLOSE_TAG_PATTERN = />/g;

  /**
   * HTML開始タグ前の空白無視パターン
   * 開始タグの前に任意の空白文字を許可する正規表現パターン
   */
  public static readonly HTML_WHITESPACE_BEFORE_OPEN_TAG = '(?:\\s*)<';

  /**
   * HTML終了タグ後の空白無視パターン
   * 終了タグの後に任意の空白文字を許可する正規表現パターン
   */
  public static readonly HTML_WHITESPACE_AFTER_CLOSE_TAG = '>(?:\\s*)';

  /**
   * 正規表現フラグ：グローバル検索とマルチライン
   * HtmlContentでのRegExp作成時に使用
   */
  public static readonly REGEX_FLAGS_GLOBAL_MULTILINE = 'gs';
}
