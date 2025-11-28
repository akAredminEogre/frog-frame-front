/**
 * MutationRecordのaddedNodesを管理するファーストクラスコレクション
 */
export class AddedNodes {
  private nodes: NodeList;

  constructor(nodes: NodeList) {
    this.nodes = nodes;
  }

  /**
   * Element要素のみに対して処理を実行する
   */
  forEachElement(callback: (element: Element) => void): void {
    this.nodes.forEach((node) => {
      if (node instanceof Element) {
        callback(node);
      }
    });
  }
}
