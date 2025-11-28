import { MutationRecords } from 'src/domain/value-objects/MutationRecords/MutationRecords';

/**
 * DOM要素を管理するファーストクラスコレクション
 */
export class Elements {
  private nodes: Set<Element>;

  constructor() {
    this.nodes = new Set();
  }

  /**
   * MutationRecordsから追加されたElement要素を収集してコレクションに追加する
   */
  collectFromMutations(mutationRecords: MutationRecords): void {
    mutationRecords.forEachAddedNodes((addedNodes) => {
      addedNodes.forEachElement((element) => {
        this.nodes.add(element);
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
   * 要素があるかどうかを確認する
   */
  hasElements(): boolean {
    return this.nodes.size > 0;
  }
}
