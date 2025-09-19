import { RewriteRule } from 'src/domain/entities/RewriteRule';

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
    const newString = this.rule.newString;

    // RewriteRuleのパターン処理メソッドを直接使用
    const regexPattern = this.rule.createRedundantPattern();
    
    const regex = new RegExp(regexPattern, 'gs');
    const replacedHtml = this.originalHtml.replace(regex, newString);
    return new ReplaceResult(replacedHtml);
  }
}
