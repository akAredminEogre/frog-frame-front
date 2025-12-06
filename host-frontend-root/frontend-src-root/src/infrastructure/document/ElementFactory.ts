import { IElementFactory } from 'src/domain/ports/IElementFactory';

/**
 * HTML要素を作成するインフラストラクチャサービス。
 * document.createElementへの直接アクセスをカプセル化し、テスト容易性を向上させます。
 * IElementFactoryインターフェースを実装し、依存性の逆転の原則に従います。
 */
export class ElementFactory implements IElementFactory {
  /**
   * 指定されたタグ名のHTML要素を作成します。
   * @param tagName 作成する要素のタグ名（例: 'div', 'table', 'tr'）
   * @returns 作成されたHTML要素
   */
  public createElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }
}
