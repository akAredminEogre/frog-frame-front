import { TextRange } from './TextRange';

/**
 * 置換処理中のHTML文字列を表すValue Object
 * HTML文字列の操作に必要なメソッドをカプセル化する
 */
export class WorkingHtml {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
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
    return new WorkingHtml(updatedHtml);
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
