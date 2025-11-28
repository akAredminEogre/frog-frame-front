import { AddedNodes } from 'src/domain/value-objects/AddedNodes/AddedNodes';

/**
 * MutationRecord配列を管理するファーストクラスコレクション
 */
export class MutationRecords {
  private records: MutationRecord[];

  constructor(records: MutationRecord[]) {
    this.records = records;
  }

  /**
   * 各MutationRecordのaddedNodesに対して処理を実行する
   */
  forEachAddedNodes(callback: (addedNodes: AddedNodes) => void): void {
    this.records.forEach((record) => {
      callback(new AddedNodes(record.addedNodes));
    });
  }
}
