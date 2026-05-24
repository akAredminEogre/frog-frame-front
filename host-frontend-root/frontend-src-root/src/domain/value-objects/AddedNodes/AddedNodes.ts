/**
 * MutationRecordのaddedNodesを管理するファーストクラスコレクション
 */
export class AddedNodes {
  private nodes: NodeList;

  constructor(nodes: NodeList) {
    this.nodes = nodes;
  }

  /**
   * Element要素のみを抽出して配列として返す
   */
  filterElements(): Element[] {
    return Array.from(this.nodes).filter((node): node is Element => node instanceof Element);
  }
}
