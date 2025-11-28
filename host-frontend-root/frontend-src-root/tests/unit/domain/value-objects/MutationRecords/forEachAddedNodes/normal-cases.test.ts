import { describe, expect, it, vi } from 'vitest';

import { MutationRecords } from 'src/domain/value-objects/MutationRecords/MutationRecords';

/**
 * MutationRecords.forEachAddedNodes - 正常系テスト
 *
 * 1. 各MutationRecordのaddedNodesに対してコールバックを実行する
 * 2. 空の配列の場合はコールバックを実行しない
 * 3. 複数のMutationRecordがある場合、それぞれに対してコールバックを実行する
 */
describe('MutationRecords.forEachAddedNodes - 正常系', () => {
  it('should call callback for each MutationRecord', () => {
    // Arrange
    const element = document.createElement('div');
    const nodeList = [element] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element]);

    const mockRecord = {
      addedNodes: nodeList,
    } as MutationRecord;

    const mutationRecords = new MutationRecords([mockRecord]);
    const callback = vi.fn();

    // Act
    mutationRecords.forEachAddedNodes(callback);

    // Assert
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should not call callback for empty records array', () => {
    // Arrange
    const mutationRecords = new MutationRecords([]);
    const callback = vi.fn();

    // Act
    mutationRecords.forEachAddedNodes(callback);

    // Assert
    expect(callback).not.toHaveBeenCalled();
  });

  it('should call callback for each record when multiple records exist', () => {
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
    const callback = vi.fn();

    // Act
    mutationRecords.forEachAddedNodes(callback);

    // Assert
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
