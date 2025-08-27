import { RewriteRule } from './RewriteRule';
import { NormalizedString } from '../value-objects/NormalizedString';
import { TextRange } from '../value-objects/TextRange';

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
      let currentHtml = this.originalHtml;
      let matchCount = 0;
      
      while (this.hasNormalizedMatchInHtml(currentHtml)) {
        // RewriteRuleに基づいて最初に見つかったマッチ箇所を置換
        currentHtml = this.replaceByNormalizedPosition(currentHtml);
        matchCount++;
        
        // 新しい文字列が検索対象を含む場合は無限ループになるので一度だけ置換して終了
        if (wouldCauseInfiniteLoop) break;
      }
      
      return new ReplaceResult(currentHtml, matchCount);
    }
  }

  /**
   * 指定した範囲を新しい文字列で置換
   * @param html 置換対象のHTML文字列
   * @param matchRange 置換対象の範囲
   * @param newString 置換する新しい文字列
   * @returns 置換後の文字列
   */
  private replaceRange(html: string, matchRange: TextRange, newString: string): string {
    return html.substring(0, matchRange.start) + 
           newString + 
           html.substring(matchRange.end);
  }

  /**
   * RewriteRuleに基づいて最初に見つかったマッチ箇所を置換
   * 冗長化された正規表現を使用してHTMLから直接マッチ位置を取得
   * @param html 置換対象のHTML文字列
   * @returns 置換後の文字列
   */
  private replaceByNormalizedPosition(html: string): string {
    // rule.oldStringを冗長化した正規表現を作成
    const redundantPattern = this.createRedundantPattern(this.rule.oldString);
    
    // 正規化前のHTMLから直接マッチ位置を取得
    const match = html.match(redundantPattern);
    if (!match) {
      // マッチしない場合は元のHTMLをそのまま返す
      return html;
    }
    
    const start = match.index!;
    const end = start + match[0].length;
    
    // TextRangeを内部で作成して、replaceRangeメソッドを使用して置換
    const range = new TextRange(start, end);
    return this.replaceRange(html, range, this.rule.newString);
  }

  /**
   * rule.oldStringを冗長化した正規表現パターンを作成
   * `<` → `\\s*<`、`>` → `>\\s*` の変換を行う
   * @param oldString 元の検索文字列
   * @returns 冗長化された正規表現
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
