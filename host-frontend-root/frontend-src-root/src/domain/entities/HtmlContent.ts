import { RewriteRule } from './RewriteRule';
import { NormalizedString } from '../value-objects/NormalizedString';
import { TextRange } from '../value-objects/TextRange';
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
      let workingHtml = new WorkingHtml(this.originalHtml);
      let matchCount = 0;
      
      while (this.hasNormalizedMatchInHtml(workingHtml.toString())) {
        // マッチの範囲を取得
        const matchRange = this.findActualRangeInString(workingHtml.toString());

        // WorkingHtmlのreplaceRangeメソッドを使用して置換
        workingHtml = workingHtml.replaceRange(matchRange, newString);
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
   * HTML文字列内で実際の置換範囲を特定する
   * @param html 検索対象のHTML文字列
   * @returns TextRange 実際の開始・終了位置を含む範囲オブジェクト
   * 使用するメンバ変数: normalizedOldString
   */
  private findActualRangeInString(html: string): TextRange {
    const workingHtml = new WorkingHtml(html);
    const normalizedHtml = new NormalizedString(html);

    // 正規化されたインデックスを取得
    const normalizedStart = normalizedHtml.indexOf(this.normalizedOldString);

    // 開始位置を取得
    const start = workingHtml.findActualIndexFromNormalizedIndex(normalizedStart);

    // 正規化された文字列の長さを取得
    const normalizedLength = this.normalizedOldString.toString().length;

    // 終了位置を取得（正規化された開始位置 + 長さ）
    const end = workingHtml.findActualIndexFromNormalizedIndex(normalizedStart + normalizedLength);

    return new TextRange(start, end);
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
