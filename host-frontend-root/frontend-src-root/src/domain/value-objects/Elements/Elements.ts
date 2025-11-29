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
    mutationRecords.extractAddedElements().forEach((element) => this.nodes.add(element));
  }

  /**
   * 保持している要素のうち、documentに存在するものを配列として取り出し、コレクションをクリアする
   */
  extractAttachedElements(): Element[] {
    const elements = Array.from(this.nodes).filter((element) => document.body.contains(element));
    this.nodes.clear();
    return elements;
  }

  /**
   * 要素があるかどうかを確認する
   */
  hasElements(): boolean {
    return this.nodes.size > 0;
  }

  /**
   * 各要素に対して非同期処理を実行する
   */
  async forEachAsync(callback: (element: Element) => Promise<void>): Promise<void> {
    const elements = this.extractAttachedElements();
    for (const element of elements) {
      await callback(element);
    }
  }
}
