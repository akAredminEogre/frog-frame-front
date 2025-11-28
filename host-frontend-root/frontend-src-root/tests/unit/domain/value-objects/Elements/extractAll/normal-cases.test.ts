import { describe, expect, it } from 'vitest';

import { Elements } from 'src/domain/value-objects/Elements/Elements';
import { MutationRecords } from 'src/domain/value-objects/MutationRecords/MutationRecords';

/**
 * Elements.extractAll - 正常系テスト
 *
 * 1. 保持している要素を配列として取り出す
 * 2. 取り出し後はコレクションをクリアする
 * 3. 空の場合は空配列を返す
 */
describe('Elements.extractAll - 正常系', () => {
  it('should return collected elements as array', () => {
    // Arrange
    const element = document.createElement('div');
    const nodeList = [element] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element]);

    const mockRecord = { addedNodes: nodeList } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord]);
    const elements = new Elements();
    elements.collectFromMutations(mutationRecords);

    // Act
    const result = elements.extractAll();

    // Assert
    expect(result).toEqual([element]);
  });

  it('should clear collection after extraction', () => {
    // Arrange
    const element = document.createElement('div');
    const nodeList = [element] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element]);

    const mockRecord = { addedNodes: nodeList } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord]);
    const elements = new Elements();
    elements.collectFromMutations(mutationRecords);

    // Act
    elements.extractAll();

    // Assert
    expect(elements.hasElements()).toBe(false);
    expect(elements.extractAll()).toEqual([]);
  });

  it('should return empty array when no elements collected', () => {
    // Arrange
    const elements = new Elements();

    // Act
    const result = elements.extractAll();

    // Assert
    expect(result).toEqual([]);
  });
});
