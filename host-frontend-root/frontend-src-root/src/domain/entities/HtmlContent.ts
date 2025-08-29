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
      // 正規表現ルールの場合：通常の正規表現置換
      const regex = new RegExp(oldString, 'gs');
      const replacedHtml = this.originalHtml.replace(regex, newString);
      return new ReplaceResult(replacedHtml);
    } else {
      // 通常ルールの場合：改行コードを無視する冗長化パターンマッチング
      // 無限ループチェックを先に実行（ループ中に値は変化しないため）
      const wouldCauseInfiniteLoop = this.rule.wouldCauseInfiniteLoop();
      
      // 冗長化された正規表現パターンを作成（改行コード無視）
      const redundantPattern = this.createRedundantPattern(this.rule.oldString);
      
      // whileループで冗長化パターンによる条件確認と置換を実行
      let currentHtml = this.originalHtml;
      
      while (redundantPattern.test(currentHtml)) {
        // 正規表現の置換を使用して最初のマッチのみを置換
        currentHtml = currentHtml.replace(redundantPattern, this.rule.newString);
        
        // 新しい文字列が検索対象を含む場合は無限ループになるので一度だけ置換して終了
        if (wouldCauseInfiniteLoop) break;
      }
      
      return new ReplaceResult(currentHtml);
    }
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
