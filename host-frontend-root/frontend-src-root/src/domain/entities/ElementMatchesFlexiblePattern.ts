import { RegexConstants } from 'src/domain/constants/RegexConstants';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * 正規表現によるパターンマッチングを行う要素チェック
 * ユーザー指定の正規表現パターンとの厳密な一致判定を実行する
 */
export class ElementMatchesFlexiblePattern {
  private element: Element;
  private regex: RegExp;

  constructor(element: Element, rule: RewriteRule) {
    this.element = element;
    this.regex = new RegExp(
      rule.createRedundantPattern(), 
      RegexConstants.REGEX_FLAGS_GLOBAL_MULTILINE
    );
  }

  /**
   * 正規表現パターンマッチング実行
   * @returns 要素がルールパターンにマッチすればtrue
   */
  public exec(): boolean {
    const outerHTML = this.element.outerHTML;
    
    // アンカー付き正規表現による完全文字列マッチ
    const anchoredRegex = new RegExp(`^${this.regex.source}$`, this.regex.flags);
    return anchoredRegex.test(outerHTML);
  }
}