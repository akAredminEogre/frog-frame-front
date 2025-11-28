import { describe, expect, it } from 'vitest';

import { PendingNodes } from 'src/domain/value-objects/PendingNodes/PendingNodes';

/**
 * PendingNodes.extractAll - 正常系テスト
 *
 * 1. 全ての要素を配列として取得する
 * 2. 取得後にコレクションをクリアする
 * 3. 空の場合は空配列を返す
 */
describe('PendingNodes.extractAll - 正常系', () => {
  it('should return all collected elements as array', () => {
    // Arrange
    const pendingNodes = new PendingNodes();
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [element1, element2] as unknown as NodeList,
    };
    pendingNodes.collectFromMutations([mutation as MutationRecord]);

    // Act
    const result = pendingNodes.extractAll();

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toContain(element1);
    expect(result).toContain(element2);
  });

  it('should clear collection after extraction', () => {
    // Arrange
    const pendingNodes = new PendingNodes();
    const element = document.createElement('div');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [element] as unknown as NodeList,
    };
    pendingNodes.collectFromMutations([mutation as MutationRecord]);

    // Act
    pendingNodes.extractAll();

    // Assert
    expect(pendingNodes.hasNodes()).toBe(false);
    expect(pendingNodes.extractAll()).toEqual([]);
  });

  it('should return empty array when no elements collected', () => {
    // Arrange
    const pendingNodes = new PendingNodes();

    // Act
    const result = pendingNodes.extractAll();

    // Assert
    expect(result).toEqual([]);
  });
});
