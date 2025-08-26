import { RewriteRule } from './RewriteRule';
import { NormalizedString } from '../value-objects/NormalizedString';
import { WorkingHtml } from '../value-objects/WorkingHtml';

export class ReplaceResult {
  constructor(
    public readonly replacedHtml: string,
    public readonly matchCount: number,
  ) {}
}

export class HtmlContent {
  private readonly originalHtml: string;
  private readonly rule: RewriteRule;
  private readonly normalizedOldString: NormalizedString;

  /**
   * HtmlContentクラスのコンストラクタ
   * @param html 置換対象のHTML文字列
   * @param rule 置換ルール（RewriteRuleオブジェクト）
   * 使用するメンバ変数: originalHtml, rule, normalizedOldString（初期化）
   */
  constructor(html: string, rule: RewriteRule) {
    this.originalHtml = html;
    this.rule = rule;
    this.normalizedOldString = new NormalizedString(rule.oldString);
  }

  /**
   * HTMLコンテンツの置換を実行する
   * @returns ReplaceResult 置換結果（置換後HTML文字列とマッチ数）
   * 使用するメンバ変数: originalHtml, rule, normalizedOldString
   */
  public replace(): ReplaceResult {
    const oldString = this.rule.oldString;
    const newString = this.rule.newString;

    if (this.rule.isRegex) {
      // 既存の正規表現ロジック（変更なし）
      const regex = new RegExp(oldString, 'gs');
      const matches = [...this.originalHtml.matchAll(regex)];
      const matchCount = matches.length;
      if (matchCount === 0) {
        return new ReplaceResult(this.originalHtml, 0);
      }
      const replacedHtml = this.originalHtml.replace(regex, newString);
      return new ReplaceResult(replacedHtml, matchCount);
    } else {
      // 新しい改行コード無視ロジック
      // 無限ループチェックを先に実行（ループ中に値は変化しないため）
      const wouldCauseInfiniteLoop = this.rule.wouldCauseInfiniteLoop();
      
      // 全ての一致箇所を見つけて置換
      let workingHtml = new WorkingHtml(this.originalHtml, this.rule);
      let matchCount = 0;
      
      while (this.hasNormalizedMatchInHtml(workingHtml.toString())) {
        // WorkingHtmlのreplaceByNormalizedPositionメソッドを使用して置換
        workingHtml = workingHtml.replaceByNormalizedPosition();
        matchCount++;
        
        // 新しい文字列が検索対象を含む場合は無限ループになるので一度だけ置換して終了
        if (wouldCauseInfiniteLoop) {
          break;
        }
      }
      
      return new ReplaceResult(workingHtml.toString(), matchCount);
    }
  }


  /**
   * 正規化されたマッチが存在するかを確認
   * @param html 検索対象のHTML文字列
   * @returns boolean マッチが存在する場合はtrue
   * 使用するメンバ変数: normalizedOldString
   */
  private hasNormalizedMatchInHtml(html: string): boolean {
    const normalizedHtml = new NormalizedString(html);
    return normalizedHtml.indexOf(this.normalizedOldString) !== -1;
  }
}
