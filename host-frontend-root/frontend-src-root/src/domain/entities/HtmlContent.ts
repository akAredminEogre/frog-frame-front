import { RewriteRule } from './RewriteRule';

class ReplaceResult {
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

    // 統合されたパターン作成メソッドを使用
    const regexPattern = this.createRedundantPattern(oldString, this.rule.isRegex ?? false);
    
    const regex = new RegExp(regexPattern, 'gs');
    const replacedHtml = this.originalHtml.replace(regex, newString);
    return new ReplaceResult(replacedHtml);
  }

  /**
   * パターンを改行コードを無視するように変換する統合メソッド
   * 正規表現ルールと通常ルールの両方に対応し、改行コードやスペースを無視する変換を行う
   * @param pattern 元のパターン文字列（正規表現または通常文字列）
   * @param isRegex パターンが正規表現かどうかのフラグ
   * @returns 改行コードを無視する正規表現パターン文字列
   */
  private createRedundantPattern(pattern: string, isRegex: boolean): string {
    // 正規表現でない場合は特殊文字をエスケープ
    const processedPattern = isRegex 
      ? pattern 
      : pattern.replace(/[.*+?^${}()|\\[\]]/g, '\\$&');
    
    // `<` → `\s*<`、`>` → `>\s*` の変換でHTML要素間の改行コードを無視
    return processedPattern
      .replace(/</g, '\\s*<')
      .replace(/>/g, '>\\s*');
  }
}
