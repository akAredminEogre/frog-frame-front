import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApplyRulesToMutatedNodesUseCase } from 'src/application/usecases/rule/ApplyRulesToMutatedNodesUseCase';

// Mock the ApplySavedRulesOnPageLoadUseCase
const mockApplyAllRules = vi.fn();
vi.mock('src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase', () => ({
  ApplySavedRulesOnPageLoadUseCase: vi.fn().mockImplementation(() => ({
    applyAllRules: mockApplyAllRules,
  })),
}));

/**
 * ApplyRulesToMutatedNodesUseCase.applyRules - 正常系テスト
 *
 * 1. ドキュメント内に存在するノードにルールを適用する
 * 2. ドキュメント内に存在しないノードはスキップする
 * 3. 複数のノードに順番にルールを適用する
 */
describe('ApplyRulesToMutatedNodesUseCase.applyRules - 正常系', () => {
  const mockRepository = {} as any;

  beforeEach(() => {
    mockApplyAllRules.mockClear();
    mockApplyAllRules.mockResolvedValue(undefined);
  });

  afterEach(() => {
    mockApplyAllRules.mockClear();
  });

  it('should apply rules to nodes that are in the document', async () => {
    // Arrange
    const useCase = new ApplyRulesToMutatedNodesUseCase(mockRepository);
    const node1 = document.createElement('div');
    const node2 = document.createElement('span');
    const nodes = [node1, node2];
    const currentUrl = 'https://example.com';
    const isNodeInDocument = vi.fn().mockReturnValue(true);

    // Act
    await useCase.applyRules(nodes, currentUrl, isNodeInDocument);

    // Assert
    expect(isNodeInDocument).toHaveBeenCalledTimes(2);
    expect(isNodeInDocument).toHaveBeenCalledWith(node1);
    expect(isNodeInDocument).toHaveBeenCalledWith(node2);
    expect(mockApplyAllRules).toHaveBeenCalledTimes(2);
    expect(mockApplyAllRules).toHaveBeenCalledWith(node1, currentUrl);
    expect(mockApplyAllRules).toHaveBeenCalledWith(node2, currentUrl);
  });

  it('should skip nodes that are not in the document', async () => {
    // Arrange
    const useCase = new ApplyRulesToMutatedNodesUseCase(mockRepository);
    const nodeInDoc = document.createElement('div');
    const nodeNotInDoc = document.createElement('span');
    const nodes = [nodeInDoc, nodeNotInDoc];
    const currentUrl = 'https://example.com';
    const isNodeInDocument = vi.fn()
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    // Act
    await useCase.applyRules(nodes, currentUrl, isNodeInDocument);

    // Assert
    expect(isNodeInDocument).toHaveBeenCalledTimes(2);
    expect(mockApplyAllRules).toHaveBeenCalledTimes(1);
    expect(mockApplyAllRules).toHaveBeenCalledWith(nodeInDoc, currentUrl);
  });

  it('should handle empty nodes array', async () => {
    // Arrange
    const useCase = new ApplyRulesToMutatedNodesUseCase(mockRepository);
    const nodes: Element[] = [];
    const currentUrl = 'https://example.com';
    const isNodeInDocument = vi.fn();

    // Act
    await useCase.applyRules(nodes, currentUrl, isNodeInDocument);

    // Assert
    expect(isNodeInDocument).not.toHaveBeenCalled();
    expect(mockApplyAllRules).not.toHaveBeenCalled();
  });

  it('should apply rules in order', async () => {
    // Arrange
    const useCase = new ApplyRulesToMutatedNodesUseCase(mockRepository);
    const node1 = document.createElement('div');
    const node2 = document.createElement('span');
    const node3 = document.createElement('p');
    const nodes = [node1, node2, node3];
    const currentUrl = 'https://example.com';
    const isNodeInDocument = vi.fn().mockReturnValue(true);
    const callOrder: Element[] = [];
    mockApplyAllRules.mockImplementation((node) => {
      callOrder.push(node);
      return Promise.resolve();
    });

    // Act
    await useCase.applyRules(nodes, currentUrl, isNodeInDocument);

    // Assert
    expect(callOrder).toEqual([node1, node2, node3]);
  });
});
