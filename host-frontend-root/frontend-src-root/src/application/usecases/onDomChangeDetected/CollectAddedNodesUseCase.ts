/**
 * MutationRecordから追加されたElementノードを収集するユースケース
 */
export class CollectAddedNodesUseCase {
  private pendingNodes: Set<Element>;

  constructor(pendingNodes: Set<Element>) {
    this.pendingNodes = pendingNodes;
  }

  /**
   * MutationRecordから追加されたElementノードを収集してpendingNodesに追加する
   * @param mutations MutationObserverから渡されるMutationRecord配列
   */
  exec(mutations: MutationRecord[]): void {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof Element) {
          this.pendingNodes.add(node);
        }
      });
    });
  }
}
