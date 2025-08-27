import { TextRange } from './TextRange';
import { RewriteRule } from '../entities/RewriteRule';
import { NormalizedString } from './NormalizedString';

/**
 * 置換処理中のHTML文字列を表すValue Object
 * HTML文字列の操作に必要なメソッドをカプセル化する
 */
export class WorkingHtml {
  private readonly value: string;
  private readonly rule: RewriteRule;
  private readonly normalizedOldString: NormalizedString;

  constructor(value: string, rule: RewriteRule) {
    this.value = value;
    this.rule = rule;
    this.normalizedOldString = new NormalizedString(rule.oldString);
  }

  /**
   * 文字列を取得
   */
  toString(): string {
    return this.value;
  }

  /**
   * 指定した範囲を新しい文字列で置換した新しいWorkingHtmlを返す
   * @param matchRange 置換対象の範囲
   * @param newString 置換する新しい文字列
   * @returns 置換後の新しいWorkingHtmlオブジェクト
   */
  replaceRange(matchRange: TextRange, newString: string): WorkingHtml {
    const updatedHtml = this.value.substring(0, matchRange.start) + 
                       newString + 
                       this.value.substring(matchRange.end);
    return new WorkingHtml(updatedHtml, this.rule);
  }

  /**
   * RewriteRuleに基づいて最初に見つかったマッチ箇所を置換
   * 冗長化された正規表現を使用して元のHTMLから直接マッチ位置を取得
   * @returns 置換後の新しいWorkingHtmlオブジェクト
   */
  replaceByNormalizedPosition(): WorkingHtml {
    // rule.oldStringを冗長化した正規表現を作成
    const redundantPattern = this.createRedundantPattern(this.rule.oldString);
    
    // 正規化前のHTMLから直接マッチ位置を取得
    const match = this.value.match(redundantPattern);
    if (!match) {
      // マッチしない場合は元のHTMLをそのまま返す
      return this;
    }
    
    const start = match.index!;
    const end = start + match[0].length;
    
    // TextRangeを内部で作成して、replaceRangeメソッドを使用して置換
    const range = new TextRange(start, end);
    return this.replaceRange(range, this.rule.newString);
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
   * 正規化されたインデックスから実際のHTML文字列内のインデックスを取得
   * @param normalizedIndex 正規化された文字列でのインデックス
   * @returns 実際のHTML文字列内のインデックス
   */
  findActualIndexFromNormalizedIndex(normalizedIndex: number): number {
    let actualIndex = 0;
    let currentNormalizedIndex = 0;
    
    while (currentNormalizedIndex < normalizedIndex && actualIndex < this.value.length) {
      // '<'の前の空白をスキップ
      if (this.isWhitespaceBeforeTag(actualIndex)) {
        actualIndex++;
        continue;
      }
      
      // '>'の後の空白をスキップ
      if (this.isWhitespaceAfterTag(actualIndex)) {
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
   * @param index 判定開始位置のインデックス
   * @returns boolean 空白+<のパターンの場合はtrue
   */
  isWhitespaceBeforeTag(index: number): boolean {
    if (index + 1 >= this.value.length) return false;
    const twoLetters = this.value.substring(index, index + 2);
    return /\s</.test(twoLetters);
  }

  /**
   * 指定されたインデックスの前の文字から2文字が'>+空白'のパターンかを判定
   * @param index 判定対象位置のインデックス
   * @returns boolean >+空白のパターンの場合はtrue
   */
  isWhitespaceAfterTag(index: number): boolean {
    if (index <= 0) return false;
    const twoLetters = this.value.substring(index - 1, index + 1);
    return />\s/.test(twoLetters);
  }

}
