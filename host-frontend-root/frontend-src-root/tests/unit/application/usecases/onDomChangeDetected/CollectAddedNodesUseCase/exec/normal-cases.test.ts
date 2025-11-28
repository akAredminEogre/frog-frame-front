import { beforeEach, describe, expect, it } from 'vitest';

import { CollectAddedNodesUseCase } from 'src/application/usecases/onDomChangeDetected/CollectAddedNodesUseCase';

/**
 * CollectAddedNodesUseCase.exec - 正常系テスト
 *
 * 1. MutationRecordから追加されたElementノードを収集する
 * 2. Element以外のノード（テキストノード等）は無視する
 * 3. 複数のMutationRecordから全てのElementを収集する
 */
describe('CollectAddedNodesUseCase.exec - 正常系', () => {
  let pendingNodes: Set<Element>;
  let useCase: CollectAddedNodesUseCase;

  beforeEach(() => {
    pendingNodes = new Set();
    useCase = new CollectAddedNodesUseCase(pendingNodes);
  });

  it('should collect Element nodes from MutationRecord', () => {
    // Arrange
    const element = document.createElement('div');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [element] as unknown as NodeList,
    };

    // Act
    useCase.exec([mutation as MutationRecord]);

    // Assert
    expect(pendingNodes.size).toBe(1);
    expect(pendingNodes.has(element)).toBe(true);
  });

  it('should ignore non-Element nodes', () => {
    // Arrange
    const textNode = document.createTextNode('text');
    const commentNode = document.createComment('comment');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [textNode, commentNode] as unknown as NodeList,
    };

    // Act
    useCase.exec([mutation as MutationRecord]);

    // Assert
    expect(pendingNodes.size).toBe(0);
  });

  it('should collect Elements from multiple MutationRecords', () => {
    // Arrange
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    const mutation1: Partial<MutationRecord> = {
      addedNodes: [element1] as unknown as NodeList,
    };
    const mutation2: Partial<MutationRecord> = {
      addedNodes: [element2] as unknown as NodeList,
    };

    // Act
    useCase.exec([mutation1 as MutationRecord, mutation2 as MutationRecord]);

    // Assert
    expect(pendingNodes.size).toBe(2);
    expect(pendingNodes.has(element1)).toBe(true);
    expect(pendingNodes.has(element2)).toBe(true);
  });

  it('should collect multiple Elements from single MutationRecord', () => {
    // Arrange
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [element1, element2] as unknown as NodeList,
    };

    // Act
    useCase.exec([mutation as MutationRecord]);

    // Assert
    expect(pendingNodes.size).toBe(2);
    expect(pendingNodes.has(element1)).toBe(true);
    expect(pendingNodes.has(element2)).toBe(true);
  });

  it('should handle empty mutations array', () => {
    // Act
    useCase.exec([]);

    // Assert
    expect(pendingNodes.size).toBe(0);
  });
});
