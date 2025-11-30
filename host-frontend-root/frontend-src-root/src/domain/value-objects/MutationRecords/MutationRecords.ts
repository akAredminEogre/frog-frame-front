import { AddedNodes } from 'src/domain/value-objects/AddedNodes/AddedNodes';

/**
 * MutationRecord配列を管理するファーストクラスコレクション
 */
export class MutationRecords {
  private addedElements: Element[];

  constructor(records: MutationRecord[]) {
    this.addedElements = records.flatMap((record) => new AddedNodes(record.addedNodes).filterElements());
  }

  /**
   * 全てのMutationRecordから追加されたElement要素を抽出して配列として返す
   */
  extractAddedElements(): Element[] {
    return this.addedElements;
  }
}
