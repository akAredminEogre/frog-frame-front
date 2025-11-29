import { describe, expect, it } from 'vitest';

import { MutationRecords } from 'src/domain/value-objects/MutationRecords/MutationRecords';

/**
 * MutationRecords.extractAddedElements - 正常系テスト
 *
 * 1. 全てのMutationRecordから追加されたElement要素を抽出する
 * 2. 空の配列の場合は空配列を返す
 * 3. 複数のMutationRecordからElement要素をフラットに抽出する
 */
describe('MutationRecords.extractAddedElements - 正常系', () => {
  it('should extract Element from MutationRecords', () => {
    // Arrange
    const element = document.createElement('div');
    const nodeList = [element] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element]);

    const mockRecord = {
      addedNodes: nodeList,
    } as MutationRecord;

    const mutationRecords = new MutationRecords([mockRecord]);

    // Act
    const result = mutationRecords.extractAddedElements();

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(element);
  });

  it('should return empty array for empty records array', () => {
    // Arrange
    const mutationRecords = new MutationRecords([]);

    // Act
    const result = mutationRecords.extractAddedElements();

    // Assert
    expect(result).toHaveLength(0);
  });

  it('should extract elements from multiple records and flatten', () => {
    // Arrange
    const element1 = document.createElement('div');
    const nodeList1 = [element1] as unknown as NodeList;
    (nodeList1 as any).forEach = Array.prototype.forEach.bind([element1]);

    const element2 = document.createElement('span');
    const nodeList2 = [element2] as unknown as NodeList;
    (nodeList2 as any).forEach = Array.prototype.forEach.bind([element2]);

    const mockRecord1 = { addedNodes: nodeList1 } as MutationRecord;
    const mockRecord2 = { addedNodes: nodeList2 } as MutationRecord;

    const mutationRecords = new MutationRecords([mockRecord1, mockRecord2]);

    // Act
    const result = mutationRecords.extractAddedElements();

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toContain(element1);
    expect(result).toContain(element2);
  });
});
