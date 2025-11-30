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
   * 保持している要素のうち、documentに存在するものを新しいElementsとして取り出し、コレクションをクリアする
   */
  extractAttachedElements(): Elements {
    const attachedElements = new Elements();
    Array.from(this.nodes)
      .filter((element) => document.body.contains(element))
      .forEach((element) => attachedElements.addElement(element));
    this.nodes.clear();
    return attachedElements;
  }

  /**
   * 各要素に対して非同期でルール適用処理を実行する
   * @param createApplyRule ルール適用関数を生成するファクトリ関数
   */
  async applyRules(createApplyRule: () => (element: Element) => Promise<void>): Promise<void> {
    const applyRule = createApplyRule();
    for (const element of this.nodes) {
      await applyRule(element);
    }
  }
}
