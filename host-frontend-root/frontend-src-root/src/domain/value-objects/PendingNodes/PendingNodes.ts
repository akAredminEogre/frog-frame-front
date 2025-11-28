/**
 * 処理待ちのDOM要素を管理するファーストクラスコレクション
 * MutationObserverで検出された追加要素を保持する
 */
export class PendingNodes {
  private nodes: Set<Element>;

  constructor() {
    this.nodes = new Set();
  }

  /**
   * MutationRecordから追加されたElement要素を収集してコレクションに追加する
   */
  collectFromMutations(mutations: MutationRecord[]): void {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          this.nodes.add(node);
        }
      });
    });
  }

  /**
   * 保持している要素を配列として取り出し、コレクションをクリアする
   */
  extractAll(): Element[] {
    const elements = Array.from(this.nodes);
    this.nodes.clear();
    return elements;
  }

  /**
   * 処理待ちの要素があるかどうかを確認する
   */
  hasNodes(): boolean {
    return this.nodes.size > 0;
  }
}
