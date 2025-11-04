import { RegexConstants } from 'src/domain/constants/RegexConstants';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

/**
 * 柔軟な属性処理でパターンマッチングを行う要素チェック
 * 正規表現パターン作成と様々なマッチング戦略を処理する
 */
export class ElementMatchesFlexiblePattern {
  private element: Element;
  private rule: RewriteRule;
  private regex: RegExp;

  constructor(element: Element, rule: RewriteRule) {
    this.element = element;
    this.rule = rule;
    this.regex = new RegExp(
      rule.createRedundantPattern(), 
      RegexConstants.REGEX_FLAGS_GLOBAL_MULTILINE
    );
  }

  /**
   * 柔軟なパターンマッチング実行
   * @returns 要素がルールパターンにマッチすればtrue
   */
  public exec(): boolean {
    const outerHTML = this.element.outerHTML;
    
    // 最初にアンカー付き正規表現で完全文字列マッチの厳密なパターンマッチングを試行
    const anchoredRegex = new RegExp(`^${this.regex.source}$`, this.regex.flags);
    return anchoredRegex.test(outerHTML);
  }

  /**
   * 要素が構造的にマッチするかチェック（タグ、必須属性、コンテンツ）、追加属性は許可
   * @returns 要素が構造的要件を満たせばtrue
   */
  private structuralElementMatch(): boolean {
    const ruleHtml = this.rule.oldString;
    
    // ルールの期待される要素をパース
    // 意図: ルールのHTML文字列を構造解析用のDOM要素に変換
    // このアプローチにより、エラーが起こりやすく複雑なカスタムHTML解析ロジックを実装する代わりに
    // ブラウザの内蔵HTMLパーサーを活用できる。
    // tempDivはメインDOMに影響を与えることなく、HTML文字列を安全に解析するコンテナとして機能する。
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = ruleHtml;
    const expectedElement = tempDiv.firstElementChild;
    
    // 意図: ルールがDOM要素に解析可能な有効なHTMLを含んでいることを確認
    // 解析が失敗した場合やルールがテキスト/空白のみを含む場合、マッチする構造的要素が存在しない
    if (!expectedElement) return false;
    
    // 意図: 構造的マッチングの第一段階 - HTMLタグ名が同一であることを確認
    // 異なる大文字小文字スタイルを処理するための大文字小文字を区別しない比較（例: 'DIV' vs 'div'）
    // これは基本的な要件: タグ名がマッチしない場合、要素は構造的に異なる
    if (this.element.tagName.toLowerCase() !== expectedElement.tagName.toLowerCase()) {
      return false;
    }
    
    // 正規表現パターンを使用して空白の違いを無視する拡張テキストコンテンツマッチ
    const expectedText = expectedElement.textContent || '';
    if (expectedText) {
      const elementText = this.element.textContent || '';
      // 空白の違いを無視する正規表現パターンを作成
      const whitespaceIgnoringPattern = expectedText.replace(/\s+/g, '(?:\\s*)');
      const regex = new RegExp(`^(?:\\s*)${whitespaceIgnoringPattern}(?:\\s*)$`);
      if (!regex.test(elementText)) {
        return false;
      }
    }
    return true;
    // 必須属性をチェック（要素はルールの全属性を持つ必要があるが、追加属性は許可してサイト機能を保持）
    //return this.hasRequiredAttributes(expectedElement);
  }

  /**
   * 現在の要素が期待される要素からすべての必須属性を持っているかチェック（追加属性は許可）
   * 
   * DOM置換時にスタイルやスクリプトが失われる問題を解決するため、ルールで指定された
   * 最小限の属性のみをチェックし、動的に追加された属性（イベントリスナー、CSSクラス等）
   * や既存サイトの属性を保持することで、元のサイト機能を維持する。
   * 
   * @param expectedElement 必須属性を含む期待される要素
   * @returns 要素がマッチする値を持つすべての必須属性を持っていればtrue（追加属性があってもtrue）
   */
  public hasRequiredAttributes(expectedElement: Element): boolean {
    const expectedAttributes = expectedElement.attributes;
    for (let i = 0; i < expectedAttributes.length; i++) {
      const attr = expectedAttributes[i];
      const elementAttrValue = this.element.getAttribute(attr.name);
      if (elementAttrValue !== attr.value) {
        return false;
      }
    }
    return true;
  }

}