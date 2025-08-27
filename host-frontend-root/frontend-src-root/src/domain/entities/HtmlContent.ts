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
   * @returns ReplaceResult 置換結果（置換後HTML文字列とマッチ数）
   * 使用するメンバ変数: originalHtml, rule
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
      
      // 冗長化された正規表現パターンを作成
      const redundantPattern = this.createRedundantPattern(this.rule.oldString);
      
      // 全ての一致箇所を見つけて置換
      let currentHtml = this.originalHtml;
      let matchCount = 0;
      
      while (redundantPattern.test(currentHtml)) {
        // 正規表現の置換を使用して最初のマッチのみを置換
        currentHtml = currentHtml.replace(redundantPattern, this.rule.newString);
        matchCount++;
        
        // 新しい文字列が検索対象を含む場合は無限ループになるので一度だけ置換して終了
        if (wouldCauseInfiniteLoop) break;
      }
      
      return new ReplaceResult(currentHtml, matchCount);
    }
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
}
