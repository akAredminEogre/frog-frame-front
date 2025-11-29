import { describe, expect, it, vi } from 'vitest';

import { Elements } from 'src/domain/value-objects/Elements/Elements';
import { MutationRecords } from 'src/domain/value-objects/MutationRecords/MutationRecords';

/**
 * Elements.forEachAsync - 正常系テスト
 *
 * 1. 保持している要素に対して非同期コールバックを実行する
 * 2. document.bodyに存在しない要素は処理しない
 * 3. 実行後はコレクションがクリアされる
 * 4. 空の場合はコールバックを実行しない
 */
describe('Elements.forEachAsync - 正常系', () => {
  it('should execute async callback for each attached element', async () => {
    // Arrange
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    document.body.appendChild(element1);
    document.body.appendChild(element2);

    const nodeList = [element1, element2] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element1, element2]);

    const mockRecord = { addedNodes: nodeList } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord]);
    const elements = new Elements();
    elements.collectFromMutations(mutationRecords);

    const callback = vi.fn().mockResolvedValue(undefined);

    // Act
    await elements.forEachAsync(callback);

    // Assert
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith(element1);
    expect(callback).toHaveBeenCalledWith(element2);

    // Cleanup
    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });

  it('should skip elements not in document body', async () => {
    // Arrange
    const attachedElement = document.createElement('div');
    document.body.appendChild(attachedElement);
    const detachedElement = document.createElement('span');

    const nodeList = [attachedElement, detachedElement] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([attachedElement, detachedElement]);

    const mockRecord = { addedNodes: nodeList } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord]);
    const elements = new Elements();
    elements.collectFromMutations(mutationRecords);

    const callback = vi.fn().mockResolvedValue(undefined);

    // Act
    await elements.forEachAsync(callback);

    // Assert
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(attachedElement);
    expect(callback).not.toHaveBeenCalledWith(detachedElement);

    // Cleanup
    document.body.removeChild(attachedElement);
  });

  it('should clear collection after execution', async () => {
    // Arrange
    const element = document.createElement('div');
    document.body.appendChild(element);

    const nodeList = [element] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element]);

    const mockRecord = { addedNodes: nodeList } as MutationRecord;
    const mutationRecords = new MutationRecords([mockRecord]);
    const elements = new Elements();
    elements.collectFromMutations(mutationRecords);

    const callback = vi.fn().mockResolvedValue(undefined);

    // Act
    await elements.forEachAsync(callback);

    // Assert
    expect(elements.extractAttachedElements()).toEqual([]);

    // Cleanup
    document.body.removeChild(element);
  });

  it('should not call callback when no elements exist', async () => {
    // Arrange
    const elements = new Elements();
    const callback = vi.fn().mockResolvedValue(undefined);

    // Act
    await elements.forEachAsync(callback);

    // Assert
    expect(callback).not.toHaveBeenCalled();
  });
});
