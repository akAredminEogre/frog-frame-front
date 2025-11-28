import { describe, expect, it } from 'vitest';

import { PendingNodes } from 'src/domain/value-objects/PendingNodes/PendingNodes';

/**
 * PendingNodes.collectFromMutations - 正常系テスト
 *
 * 1. Element要素を収集する
 * 2. 非Element要素（テキストノード等）は無視する
 * 3. 複数のMutationRecordから要素を収集する
 */
describe('PendingNodes.collectFromMutations - 正常系', () => {
  it('should collect Element nodes from mutations', () => {
    // Arrange
    const pendingNodes = new PendingNodes();
    const element = document.createElement('div');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [element] as unknown as NodeList,
    };

    // Act
    pendingNodes.collectFromMutations([mutation as MutationRecord]);

    // Assert
    expect(pendingNodes.hasNodes()).toBe(true);
    expect(pendingNodes.extractAll()).toEqual([element]);
  });

  it('should ignore non-Element nodes', () => {
    // Arrange
    const pendingNodes = new PendingNodes();
    const textNode = document.createTextNode('test');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [textNode] as unknown as NodeList,
    };

    // Act
    pendingNodes.collectFromMutations([mutation as MutationRecord]);

    // Assert
    expect(pendingNodes.hasNodes()).toBe(false);
  });

  it('should collect elements from multiple mutations', () => {
    // Arrange
    const pendingNodes = new PendingNodes();
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    const mutation1: Partial<MutationRecord> = {
      addedNodes: [element1] as unknown as NodeList,
    };
    const mutation2: Partial<MutationRecord> = {
      addedNodes: [element2] as unknown as NodeList,
    };

    // Act
    pendingNodes.collectFromMutations([mutation1 as MutationRecord, mutation2 as MutationRecord]);

    // Assert
    expect(pendingNodes.hasNodes()).toBe(true);
    const extracted = pendingNodes.extractAll();
    expect(extracted).toHaveLength(2);
    expect(extracted).toContain(element1);
    expect(extracted).toContain(element2);
  });

  it('should not add duplicate elements', () => {
    // Arrange
    const pendingNodes = new PendingNodes();
    const element = document.createElement('div');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [element] as unknown as NodeList,
    };

    // Act
    pendingNodes.collectFromMutations([mutation as MutationRecord]);
    pendingNodes.collectFromMutations([mutation as MutationRecord]);

    // Assert
    expect(pendingNodes.extractAll()).toHaveLength(1);
  });
});
