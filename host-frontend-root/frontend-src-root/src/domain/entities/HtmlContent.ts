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
      let workingHtml = this.originalHtml;
      let matchCount = 0;
      
      while (this.hasNormalizedMatchInHtml(workingHtml)) {
        // マッチの範囲を取得
        const matchRange = this.findActualRangeInString(workingHtml);

        // 新しいHTMLを作成（元の変数を再利用せずに新しい変数に代入）
        const updatedHtml = workingHtml.substring(0, matchRange.start) + 
                           newString + 
          workingHtml.substring(matchRange.end);
        
        workingHtml = updatedHtml;
        matchCount++;
        
        // 新しい文字列が検索対象を含む場合は無限ループになるので一度だけ置換して終了
        if (wouldCauseInfiniteLoop) {
          break;
        }
      }
      
      return new ReplaceResult(workingHtml, matchCount);
    }
  }

  /**
   * HTML文字列内で実際の置換範囲を特定する
   * @param html 検索対象のHTML文字列
   * @returns TextRange 実際の開始・終了位置を含む範囲オブジェクト
   * 使用するメンバ変数: normalizedOldString
   */
  private findActualRangeInString(html: string): TextRange {
    const normalizedHtml = new NormalizedString(html);

    // 正規化されたインデックスを取得
    const normalizedStart = normalizedHtml.indexOf(this.normalizedOldString);

    // 開始位置を取得
    const start = this.findActualIndexFromNormalizedIndex(html, normalizedStart);

    // 正規化された文字列の長さを取得
    const normalizedLength = this.normalizedOldString.toString().length;

    // 終了位置を取得（正規化された開始位置 + 長さ）
    const end = this.findActualIndexFromNormalizedIndex(html, normalizedStart + normalizedLength);

    return new TextRange(start, end);
  }

  /**
   * 正規化されたインデックスから実際のHTML文字列内のインデックスを取得
   * @param html 対象のHTML文字列
   * @param normalizedIndex 正規化された文字列でのインデックス
   * @returns 実際のHTML文字列内のインデックス
   * 使用するメンバ変数: なし（このメソッドはヘルパーメソッドisWhitespaceBeforeTag, isWhitespaceAfterTagを呼び出す）
   */
  private findActualIndexFromNormalizedIndex(html: string, normalizedIndex: number): number {
    let actualIndex = 0;
    let currentNormalizedIndex = 0;
    
    while (currentNormalizedIndex < normalizedIndex && actualIndex < html.length) {
      // '<'の前の空白をスキップ
      if (this.isWhitespaceBeforeTag(html, actualIndex)) {
        actualIndex++;
        continue;
      }
      
      // '>'の後の空白をスキップ
      if (this.isWhitespaceAfterTag(html, actualIndex)) {
        actualIndex++;
        continue;
      }
      
      // 通常の文字はカウントして進む
      currentNormalizedIndex++;
      actualIndex++;
    }
    
    return actualIndex;
  }

  /**
   * 指定されたインデックスから始まる2文字が'空白+<'のパターンかを判定
   * @param html 対象のHTML文字列
   * @param index 判定開始位置のインデックス
   * @returns boolean 空白+<のパターンの場合はtrue
   * 使用するメンバ変数: なし
   */
  private isWhitespaceBeforeTag(html: string, index: number): boolean {
    if (index + 1 >= html.length) return false;
    const twoLetters = html.substring(index, index + 2);
    return /\s</.test(twoLetters);
  }

  /**
   * 指定されたインデックスの前の文字から2文字が'>+空白'のパターンかを判定
   * @param html 対象のHTML文字列
   * @param index 判定対象位置のインデックス
   * @returns boolean >+空白のパターンの場合はtrue
   * 使用するメンバ変数: なし
   */
  private isWhitespaceAfterTag(html: string, index: number): boolean {
    if (index <= 0) return false;
    const twoLetters = html.substring(index - 1, index + 1);
    return />\s/.test(twoLetters);
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
