import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Elements } from 'src/domain/value-objects/Elements/Elements';
import { MutationRecords } from 'src/domain/value-objects/MutationRecords/MutationRecords';

/**
 * Elements.merge - 正常系テスト
 *
 * 1. 他のElementsコレクションから要素をマージする
 * 2. 空のElementsをマージしても何も変わらない
 * 3. 複数の要素を持つElementsをマージする
 * 4. 重複する要素は1つにまとめる
 */
describe('Elements.merge - 正常系', () => {
  let testContainer: HTMLElement;

  beforeEach(() => {
    testContainer = document.createElement('div');
    document.body.appendChild(testContainer);
  });

  afterEach(() => {
    document.body.removeChild(testContainer);
  });

  it('should merge Elements from MutationRecords', () => {
    // Arrange
    const element = document.createElement('div');
    testContainer.appendChild(element);

    const nodeList = [element] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element]);

    const mockRecord = { addedNodes: nodeList } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord]);
    const elements = new Elements();

    // Act
    elements.merge(mutationRecords.extractAddedElements());

    // Assert
    expect(elements.extractAttachedElements().toArray()).toEqual([element]);
  });

  it('should not change when merging empty Elements', () => {
    // Arrange
    const mutationRecords = new MutationRecords([]);
    const elements = new Elements();

    // Act
    elements.merge(mutationRecords.extractAddedElements());

    // Assert
    expect(elements.extractAttachedElements().toArray()).toEqual([]);
  });

  it('should merge elements from multiple MutationRecords', () => {
    // Arrange
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    testContainer.appendChild(element1);
    testContainer.appendChild(element2);

    const nodeList1 = [element1] as unknown as NodeList;
    (nodeList1 as any).forEach = Array.prototype.forEach.bind([element1]);

    const nodeList2 = [element2] as unknown as NodeList;
    (nodeList2 as any).forEach = Array.prototype.forEach.bind([element2]);

    const mockRecord1 = { addedNodes: nodeList1 } as MutationRecord;
    const mockRecord2 = { addedNodes: nodeList2 } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord1, mockRecord2]);
    const elements = new Elements();

    // Act
    elements.merge(mutationRecords.extractAddedElements());

    // Assert
    const extracted = elements.extractAttachedElements().toArray();
    expect(extracted).toHaveLength(2);
    expect(extracted).toContain(element1);
    expect(extracted).toContain(element2);
  });

  it('should deduplicate same element', () => {
    // Arrange
    const element = document.createElement('div');
    testContainer.appendChild(element);

    const nodeList1 = [element] as unknown as NodeList;
    (nodeList1 as any).forEach = Array.prototype.forEach.bind([element]);

    const nodeList2 = [element] as unknown as NodeList;
    (nodeList2 as any).forEach = Array.prototype.forEach.bind([element]);

    const mockRecord1 = { addedNodes: nodeList1 } as MutationRecord;
    const mockRecord2 = { addedNodes: nodeList2 } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord1, mockRecord2]);
    const elements = new Elements();

    // Act
    elements.merge(mutationRecords.extractAddedElements());

    // Assert
    expect(elements.extractAttachedElements().toArray()).toEqual([element]);
  });

  it('should ignore non-Element nodes', () => {
    // Arrange
    const textNode = document.createTextNode('test');
    const nodeList = [textNode] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([textNode]);

    const mockRecord = { addedNodes: nodeList } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord]);
    const elements = new Elements();

    // Act
    elements.merge(mutationRecords.extractAddedElements());

    // Assert
    expect(elements.extractAttachedElements().toArray()).toEqual([]);
  });
});
