import { AddedNodes } from 'src/domain/value-objects/AddedNodes/AddedNodes';
import { Elements } from 'src/domain/value-objects/Elements/Elements';

/**
 * MutationRecord配列を管理するファーストクラスコレクション
 */
export class MutationRecords {
  private records: MutationRecord[];
  private addedElements: Elements;

  constructor(records: MutationRecord[]) {
    this.records = records;
    this.addedElements = new Elements();
    this.extractAddedElements();
  }

  /**
   * 全てのMutationRecordから追加されたElement要素を抽出してElementsとして返す
   */
  extractAddedElements(): Elements {
    this.records
      .flatMap((record) => new AddedNodes(record.addedNodes).filterElements())
      .forEach((element) => this.addedElements.addElement(element));
    return this.addedElements;
  }
}
