/**
 * HTML要素を作成するためのファクトリインターフェース。
 * 依存性の逆転の原則に従い、domain層がdocument.createElementに
 * 直接依存することなくHTML要素を生成できるようにします。
 */
export interface IElementFactory {
  /**
   * 指定されたタグ名のHTML要素を作成します。
   * @param tagName 作成する要素のタグ名（例: 'div', 'table', 'tr'）
   * @returns 作成されたHTML要素
   */
  createElement(tagName: string): HTMLElement;
}
