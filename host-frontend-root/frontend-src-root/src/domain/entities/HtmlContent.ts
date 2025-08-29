import { RewriteRule } from './RewriteRule';

export class ReplaceResult {
  constructor(
    public readonly replacedHtml: string,
  ) {}
}

export class HtmlContent {
  private readonly originalHtml: string;
  private readonly rule: RewriteRule;

  /**
   * HtmlContentクラスのコンストラクタ
   * @param html 置換対象のHTML文字列
   * @param rule 置換ルール（RewriteRuleオブジェクト）
   * 使用するメンバ変数: originalHtml, rule
   */
  constructor(html: string, rule: RewriteRule) {
    this.originalHtml = html;
    this.rule = rule;
  }

  /**
   * HTMLコンテンツの置換を実行する
   * 正規表現ルールの場合は通常の正規表現置換を行い、
   * 通常ルールの場合は改行コードを無視する冗長化パターンマッチングを使用する
   * @returns ReplaceResult 置換結果（置換後HTML文字列）
   * 使用するメンバ変数: originalHtml, rule
   */
  public replace(): ReplaceResult {
    const oldString = this.rule.oldString;
    const newString = this.rule.newString;

    if (this.rule.isRegex) {
      // 正規表現ルールの場合：改行コードを無視する正規表現置換
      // 正規表現パターンに対して改行コードを無視する変換を適用
      const redundantRegexPattern = this.createRedundantRegexPattern(oldString);
      const regex = new RegExp(redundantRegexPattern, 'gs');
      const replacedHtml = this.originalHtml.replace(regex, newString);
      return new ReplaceResult(replacedHtml);
    } else {
      
      // 冗長化された正規表現パターンを作成（改行コード無視）
      const redundantPattern = this.createRedundantPattern(this.rule.oldString);
      
      const regex = new RegExp(redundantPattern, 'gs');
      const replacedHtml = this.originalHtml.replace(regex, newString);
      return new ReplaceResult(replacedHtml);
    }
  }

  /**
   * 正規表現パターンを改行コードを無視するように変換
   * 正規表現内の `<` → `\\s*<`、`>` → `>\\s*` の変換でHTML要素間の改行コードを無視
   * @param regexPattern 元の正規表現パターン文字列
   * @returns 改行コードを無視する正規表現パターン文字列
   */
  private createRedundantRegexPattern(regexPattern: string): string {
    // `<` → `\\s*<`、`>` → `>\\s*` の変換を適用
    return regexPattern
      .replace(/</g, '\\s*<')
      .replace(/>/g, '>\\s*');
  }

  /**
   * rule.oldStringを冗長化した正規表現パターンを作成
   * 改行コードやスペースを無視するために以下の変換を行う：
   * - 正規表現の特殊文字をエスケープ
   * - `<` → `\\\\s*<`、`>` → `>\\\\s*` の変換でHTML要素間の改行コードを無視
   * @param oldString 元の検索文字列
   * @returns 冗長化された正規表現オブジェクト
   */
  private createRedundantPattern(oldString: string): RegExp {
    // 正規表現の特殊文字をエスケープ
    const escaped = oldString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // `<` → `\\s*<`、`>` → `>\\s*` の変換を適用
    const redundantPattern = escaped
      .replace(/</g, '\\s*<')
      .replace(/>/g, '>\\s*');
    
    return new RegExp(redundantPattern);
  }
}
