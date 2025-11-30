/**
 * DOM要素を管理するファーストクラスコレクション
 */
export class Elements {
  private nodes: Set<Element>;

  constructor() {
    this.nodes = new Set();
  }

  /**
   * 要素を追加する
   */
  addElement(element: Element): void {
    this.nodes.add(element);
  }

  /**
   * 各要素に対してコールバックを実行する
   */
  forEach(callback: (element: Element) => void): void {
    this.nodes.forEach(callback);
  }

  /**
   * 他のElementsコレクションの要素をマージする
   */
  merge(other: Elements): void {
    other.forEach((element) => this.nodes.add(element));
  }

  /**
   * 保持している要素のうち、documentに存在するものを配列として取り出し、コレクションをクリアする
   */
  extractAttachedElements(): Element[] {
    const elements = Array.from(this.nodes).filter((element) => document.body.contains(element));
    this.nodes.clear();
    return elements;
  }
}
