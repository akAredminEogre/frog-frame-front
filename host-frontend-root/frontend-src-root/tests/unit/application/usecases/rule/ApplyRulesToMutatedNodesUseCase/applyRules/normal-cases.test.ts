import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApplyRulesToMutatedNodesUseCase } from 'src/application/usecases/rule/ApplyRulesToMutatedNodesUseCase';
import { WindowLocationService } from 'src/infrastructure/windows/WindowLocationService';

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
 * 4. WindowLocationServiceから現在のURLを取得する
 */
describe('ApplyRulesToMutatedNodesUseCase.applyRules - 正常系', () => {
  const mockRepository = {} as any;
  const mockGetCurrentUrl = vi.fn();
  const mockWindowLocationService = {
    getCurrentUrl: mockGetCurrentUrl,
  } as unknown as WindowLocationService;

  beforeEach(() => {
    mockApplyAllRules.mockClear();
    mockApplyAllRules.mockResolvedValue(undefined);
    mockGetCurrentUrl.mockClear();
    mockGetCurrentUrl.mockReturnValue('https://example.com');
  });

  afterEach(() => {
    mockApplyAllRules.mockClear();
    mockGetCurrentUrl.mockClear();
  });

  it('should apply rules to nodes that are in the document', async () => {
    // Arrange
    const useCase = new ApplyRulesToMutatedNodesUseCase(mockRepository, mockWindowLocationService);
    const node1 = document.createElement('div');
    const node2 = document.createElement('span');
    const nodes = [node1, node2];
    const isNodeInDocument = vi.fn().mockReturnValue(true);

    // Act
    await useCase.applyRules(nodes, isNodeInDocument);

    // Assert
    expect(mockGetCurrentUrl).toHaveBeenCalledTimes(1);
    expect(isNodeInDocument).toHaveBeenCalledTimes(2);
    expect(isNodeInDocument).toHaveBeenCalledWith(node1);
    expect(isNodeInDocument).toHaveBeenCalledWith(node2);
    expect(mockApplyAllRules).toHaveBeenCalledTimes(2);
    expect(mockApplyAllRules).toHaveBeenCalledWith(node1, 'https://example.com');
    expect(mockApplyAllRules).toHaveBeenCalledWith(node2, 'https://example.com');
  });

  it('should skip nodes that are not in the document', async () => {
    // Arrange
    const useCase = new ApplyRulesToMutatedNodesUseCase(mockRepository, mockWindowLocationService);
    const nodeInDoc = document.createElement('div');
    const nodeNotInDoc = document.createElement('span');
    const nodes = [nodeInDoc, nodeNotInDoc];
    const isNodeInDocument = vi.fn()
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    // Act
    await useCase.applyRules(nodes, isNodeInDocument);

    // Assert
    expect(isNodeInDocument).toHaveBeenCalledTimes(2);
    expect(mockApplyAllRules).toHaveBeenCalledTimes(1);
    expect(mockApplyAllRules).toHaveBeenCalledWith(nodeInDoc, 'https://example.com');
  });

  it('should handle empty nodes array', async () => {
    // Arrange
    const useCase = new ApplyRulesToMutatedNodesUseCase(mockRepository, mockWindowLocationService);
    const nodes: Element[] = [];
    const isNodeInDocument = vi.fn();

    // Act
    await useCase.applyRules(nodes, isNodeInDocument);

    // Assert
    expect(isNodeInDocument).not.toHaveBeenCalled();
    expect(mockApplyAllRules).not.toHaveBeenCalled();
  });

  it('should apply rules in order', async () => {
    // Arrange
    const useCase = new ApplyRulesToMutatedNodesUseCase(mockRepository, mockWindowLocationService);
    const node1 = document.createElement('div');
    const node2 = document.createElement('span');
    const node3 = document.createElement('p');
    const nodes = [node1, node2, node3];
    const isNodeInDocument = vi.fn().mockReturnValue(true);
    const callOrder: Element[] = [];
    mockApplyAllRules.mockImplementation((node) => {
      callOrder.push(node);
      return Promise.resolve();
    });

    // Act
    await useCase.applyRules(nodes, isNodeInDocument);

    // Assert
    expect(callOrder).toEqual([node1, node2, node3]);
  });
});
