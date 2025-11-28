import { describe, expect, it } from 'vitest';

import { PendingNodes } from 'src/domain/value-objects/PendingNodes/PendingNodes';

/**
 * PendingNodes.hasNodes - 正常系テスト
 *
 * 1. 要素がある場合はtrueを返す
 * 2. 要素がない場合はfalseを返す
 */
describe('PendingNodes.hasNodes - 正常系', () => {
  it('should return true when elements exist', () => {
    // Arrange
    const pendingNodes = new PendingNodes();
    const element = document.createElement('div');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [element] as unknown as NodeList,
    };
    pendingNodes.collectFromMutations([mutation as MutationRecord]);

    // Act & Assert
    expect(pendingNodes.hasNodes()).toBe(true);
  });

  it('should return false when no elements', () => {
    // Arrange
    const pendingNodes = new PendingNodes();

    // Act & Assert
    expect(pendingNodes.hasNodes()).toBe(false);
  });

  it('should return false after extraction', () => {
    // Arrange
    const pendingNodes = new PendingNodes();
    const element = document.createElement('div');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [element] as unknown as NodeList,
    };
    pendingNodes.collectFromMutations([mutation as MutationRecord]);
    pendingNodes.extractAll();

    // Act & Assert
    expect(pendingNodes.hasNodes()).toBe(false);
  });
});
