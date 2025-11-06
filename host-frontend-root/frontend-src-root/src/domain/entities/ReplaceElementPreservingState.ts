import { RegexConstants } from 'src/domain/constants/RegexConstants';
import { ParserContextStrategyFactory } from 'src/domain/entities/ParserContextStrategy';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * 要素の状態を保持しながら置換を実行するクラス
 * DOM要素を置換する際に、周囲のDOM状態（イベントリスナーやスタイルなど）を保持する
 */
export class ReplaceElementPreservingState {
  private element: Element;
  private rule: RewriteRule;

  constructor(element: Element, rule: RewriteRule) {
    this.element = element;
    this.rule = rule;
  }

  /**
   * 要素の状態を保持しながら置換を実行する
   */
  public exec(): void {
    const parent = this.element.parentNode;
    if (!parent) return;

    // 実際の置換コンテンツを取得（必要に応じて正規表現置換を適用）
    const replacementContent = this.getReplacementContent();
    
    // 置換コンテンツを解析して置換ノードを作成するためのHTMLパーサーコンテナ
    const htmlParserContainer = ParserContextStrategyFactory.createContainer(this.element);
    htmlParserContainer.innerHTML = replacementContent;
    
    // すべての置換ノードを挿入
    const replacementNodes = Array.from(htmlParserContainer.childNodes);
    
    // 元の要素の前に置換ノードを挿入
    replacementNodes.forEach(node => {
      parent.insertBefore(node.cloneNode(true), this.element);
    });
    
    // 元の要素を削除
    parent.removeChild(this.element);
  }

  /**
   * ルールのパターンを使用して実際の置換コンテンツを取得
   * @returns 置換が適用された最終的な置換コンテンツ
   */
  private getReplacementContent(): string {
    const elementHtml = this.element.outerHTML;
    const redundantPattern = this.rule.createRedundantPattern();
    const redundantRegex = new RegExp(redundantPattern, RegexConstants.REGEX_FLAGS_GLOBAL_MULTILINE);
    return elementHtml.replace(redundantRegex, this.rule.newString);
  }
}