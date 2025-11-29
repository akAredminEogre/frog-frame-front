import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { Elements } from 'src/domain/value-objects/Elements/Elements';
import { MutationRecords } from 'src/domain/value-objects/MutationRecords/MutationRecords';

/**
 * Elements.hasElements - 正常系テスト
 *
 * 1. 要素がある場合はtrueを返す
 * 2. 要素がない場合はfalseを返す
 */
describe('Elements.hasElements - 正常系', () => {
  let testContainer: HTMLElement;

  beforeEach(() => {
    testContainer = document.createElement('div');
    document.body.appendChild(testContainer);
  });

  afterEach(() => {
    document.body.removeChild(testContainer);
  });

  it('should return true when elements exist', () => {
    // Arrange
    const element = document.createElement('div');
    const nodeList = [element] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element]);

    const mockRecord = { addedNodes: nodeList } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord]);
    const elements = new Elements();
    elements.collectFromMutations(mutationRecords);

    // Act
    const result = elements.hasElements();

    // Assert
    expect(result).toBe(true);
  });

  it('should return false when no elements exist', () => {
    // Arrange
    const elements = new Elements();

    // Act
    const result = elements.hasElements();

    // Assert
    expect(result).toBe(false);
  });

  it('should return false after extraction', () => {
    // Arrange
    const element = document.createElement('div');
    testContainer.appendChild(element);

    const nodeList = [element] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element]);

    const mockRecord = { addedNodes: nodeList } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord]);
    const elements = new Elements();
    elements.collectFromMutations(mutationRecords);
    elements.extractAttachedElements();

    // Act
    const result = elements.hasElements();

    // Assert
    expect(result).toBe(false);
  });
});
