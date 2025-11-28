import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { ApplyRulesToMutatedNodesUseCase } from 'src/application/usecases/rule/ApplyRulesToMutatedNodesUseCase';
import { Tab } from 'src/domain/value-objects/Tab';

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
 * 4. ICurrentTabServiceから現在のタブURLを取得する
 */
describe('ApplyRulesToMutatedNodesUseCase.applyRules - 正常系', () => {
  const mockRepository = {} as any;
  const mockGetCurrentTab = vi.fn();
  const mockCurrentTabService = {
    getCurrentTab: mockGetCurrentTab,
  } as unknown as ICurrentTabService;

  beforeEach(() => {
    mockApplyAllRules.mockClear();
    mockApplyAllRules.mockResolvedValue(undefined);
    mockGetCurrentTab.mockClear();
    mockGetCurrentTab.mockResolvedValue(new Tab(1, 'https://example.com'));
  });

  afterEach(() => {
    mockApplyAllRules.mockClear();
    mockGetCurrentTab.mockClear();
  });

  it('should apply rules to nodes that are in the document', async () => {
    // Arrange
    const useCase = new ApplyRulesToMutatedNodesUseCase(mockRepository, mockCurrentTabService);
    const node1 = document.createElement('div');
    const node2 = document.createElement('span');
    const nodes = [node1, node2];
    const isNodeInDocument = vi.fn().mockReturnValue(true);

    // Act
    await useCase.applyRules(nodes, isNodeInDocument);

    // Assert
    expect(mockGetCurrentTab).toHaveBeenCalledTimes(1);
    expect(isNodeInDocument).toHaveBeenCalledTimes(2);
    expect(isNodeInDocument).toHaveBeenCalledWith(node1);
    expect(isNodeInDocument).toHaveBeenCalledWith(node2);
    expect(mockApplyAllRules).toHaveBeenCalledTimes(2);
    expect(mockApplyAllRules).toHaveBeenCalledWith(node1, 'https://example.com');
    expect(mockApplyAllRules).toHaveBeenCalledWith(node2, 'https://example.com');
  });

  it('should skip nodes that are not in the document', async () => {
    // Arrange
    const useCase = new ApplyRulesToMutatedNodesUseCase(mockRepository, mockCurrentTabService);
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
    const useCase = new ApplyRulesToMutatedNodesUseCase(mockRepository, mockCurrentTabService);
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
    const useCase = new ApplyRulesToMutatedNodesUseCase(mockRepository, mockCurrentTabService);
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
