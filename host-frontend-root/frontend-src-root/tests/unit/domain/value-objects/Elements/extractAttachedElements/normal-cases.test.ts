import { describe, expect, it } from 'vitest';

import { Elements } from 'src/domain/value-objects/Elements/Elements';
import { MutationRecords } from 'src/domain/value-objects/MutationRecords/MutationRecords';

/**
 * Elements.extractAttachedElements - 正常系テスト
 *
 * 1. 保持している要素のうちdocument.bodyに存在するものをElementsとして取り出す
 * 2. 取り出し後はコレクションをクリアする
 * 3. 空の場合は空のElementsを返す
 * 4. document.bodyに存在しない要素は除外する
 */
describe('Elements.extractAttachedElements - 正常系', () => {
  const toArray = (elements: Elements): Element[] => {
    const result: Element[] = [];
    elements.forEach((el) => result.push(el));
    return result;
  };

  it('should return collected elements that are in document body', () => {
    // Arrange
    const element = document.createElement('div');
    document.body.appendChild(element);

    const nodeList = [element] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element]);

    const mockRecord = { addedNodes: nodeList } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord]);
    const elements = new Elements();
    elements.merge(mutationRecords.extractAddedElements());

    // Act
    const result = elements.extractAttachedElements();

    // Assert
    expect(toArray(result)).toEqual([element]);

    // Cleanup
    document.body.removeChild(element);
  });

  it('should clear collection after extraction', () => {
    // Arrange
    const element = document.createElement('div');
    document.body.appendChild(element);

    const nodeList = [element] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element]);

    const mockRecord = { addedNodes: nodeList } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord]);
    const elements = new Elements();
    elements.merge(mutationRecords.extractAddedElements());

    // Act
    elements.extractAttachedElements();

    // Assert
    expect(toArray(elements.extractAttachedElements())).toEqual([]);

    // Cleanup
    document.body.removeChild(element);
  });

  it('should return empty Elements when no elements collected', () => {
    // Arrange
    const elements = new Elements();

    // Act
    const result = elements.extractAttachedElements();

    // Assert
    expect(toArray(result)).toEqual([]);
  });

  it('should exclude elements not in document body', () => {
    // Arrange
    const attachedElement = document.createElement('div');
    document.body.appendChild(attachedElement);
    const detachedElement = document.createElement('span');

    const nodeList = [attachedElement, detachedElement] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([attachedElement, detachedElement]);

    const mockRecord = { addedNodes: nodeList } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord]);
    const elements = new Elements();
    elements.merge(mutationRecords.extractAddedElements());

    // Act
    const result = elements.extractAttachedElements();

    // Assert
    const resultArray = toArray(result);
    expect(resultArray).toEqual([attachedElement]);
    expect(resultArray).not.toContain(detachedElement);

    // Cleanup
    document.body.removeChild(attachedElement);
  });
});
