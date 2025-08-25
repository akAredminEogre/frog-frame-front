import { RewriteRule } from './RewriteRule';
import { NormalizedString } from '../value-objects/NormalizedString';

export class ReplaceResult {
  constructor(
    public readonly replacedHtml: string,
    public readonly matchCount: number,
  ) {}
}

export class HtmlContent {
  private readonly originalHtml: string;
  private readonly rule: RewriteRule;

  constructor(html: string, rule: RewriteRule) {
    this.originalHtml = html;
    this.rule = rule;
  }

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
      if (!this.hasNormalizedMatch()) {
        return new ReplaceResult(this.originalHtml, 0);
      }
      
      // 無限ループチェックを先に実行（ループ中に値は変化しないため）
      const wouldCauseInfiniteLoop = this.rule.wouldCauseInfiniteLoop();
      
      // 全ての一致箇所を見つけて置換
      let currentHtml = this.originalHtml;
      let matchCount = 0;
      
      while (true) {
        const matchResult = this.findNormalizedMatch(currentHtml);
        
        if (matchResult === null) {
          break;
        }
        
        // 元のHTMLの該当範囲を新しい文字列で置換
        currentHtml = currentHtml.substring(0, matchResult.start) + 
                      newString + 
                      currentHtml.substring(matchResult.end);
        
        matchCount++;
        
        // 新しい文字列が検索対象を含む場合は無限ループになるので一度だけ置換して終了
        if (wouldCauseInfiniteLoop) {
          break;
        }
      }
      
      return new ReplaceResult(currentHtml, matchCount);
    }
  }

  private hasNormalizedMatch(): boolean {
    const normalizedHtml = new NormalizedString(this.originalHtml);
    const normalizedSearchString = new NormalizedString(this.rule.oldString);
    
    return normalizedHtml.indexOf(normalizedSearchString) !== -1;
  }


  /**
   * 指定されたインデックスから始まる2文字が'空白+<'のパターンかを判定
   */
  private isWhitespaceBeforeTag(html: string, index: number): boolean {
    if (index + 1 >= html.length) return false;
    const twoLetters = html.substring(index, index + 2);
    return /\s</.test(twoLetters);
  }

  /**
   * 指定されたインデックスの前の文字から2文字が'>+空白'のパターンかを判定
   */
  private isWhitespaceAfterTag(html: string, index: number): boolean {
    if (index <= 0) return false;
    const twoLetters = html.substring(index - 1, index + 1);
    return />\s/.test(twoLetters);
  }

  private findActualRangeInString(html: string, normalizedStart: number, normalizedLength: number): { start: number, end: number } {
    // 限定的正規化のマッピング：HTMLタグの前後の空白のみを除去
    let actualIndex = 0;
    let normalizedIndex = 0;
    
    // normalizedStartまでの実際の位置を特定
    while (normalizedIndex < normalizedStart && actualIndex < html.length) {
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
      normalizedIndex++;
      actualIndex++;
    }
    
    const start = actualIndex;
    
    // normalizedLengthに対応する実際の終了位置を特定
    let remainingLength = normalizedLength;
    while (remainingLength > 0 && actualIndex < html.length) {
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
      remainingLength--;
      actualIndex++;
    }
    
    return { start, end: actualIndex };
  }

  private findNormalizedMatch(html: string): { start: number, end: number } | null {
    const normalizedHtml = new NormalizedString(html);
    const normalizedOldString = new NormalizedString(this.rule.oldString);
    const index = normalizedHtml.indexOf(normalizedOldString);
    
    if (index === -1) {
      return null;
    }
    
    // 正規化されたインデックスを実際のHTMLのインデックスにマッピング
    const range = this.findActualRangeInString(html, index, normalizedOldString.toString().length);
    return range;
  }
}
