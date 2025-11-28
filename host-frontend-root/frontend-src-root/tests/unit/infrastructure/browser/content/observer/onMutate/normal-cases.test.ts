import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { observerOnMutate } from 'src/infrastructure/browser/content/observer/onMutate';

// Mock the ApplyRulesToMutatedNodesUseCase
vi.mock('src/application/usecases/rule/ApplyRulesToMutatedNodesUseCase', () => ({
  ApplyRulesToMutatedNodesUseCase: vi.fn().mockImplementation(() => ({
    applyRules: vi.fn().mockResolvedValue(undefined),
  })),
}));

// Mock the ChromeRuntimeRewriteRuleRepository
vi.mock('src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository', () => ({
  ChromeRuntimeRewriteRuleRepository: vi.fn().mockImplementation(() => ({})),
}));

// Mock the ChromeCurrentTabService
vi.mock('src/infrastructure/browser/tabs/ChromeCurrentTabService', () => ({
  ChromeCurrentTabService: vi.fn().mockImplementation(() => ({})),
}));

/**
 * observerOnMutate - 正常系テスト
 *
 * 1. observerOnMutateを呼び出すとMutationObserverが登録される
 * 2. DOM更新を検知してrewrite rulesを適用する
 * 3. デバウンス処理により複数のmutationがまとめて処理される
 */
describe('observerOnMutate - 正常系', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let capturedCallback: ((mutations: MutationRecord[]) => void) | null;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    mockObserve = vi.fn();
    mockDisconnect = vi.fn();
    capturedCallback = null;

    vi.stubGlobal('MutationObserver', vi.fn().mockImplementation((callback) => {
      capturedCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
      };
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('should register MutationObserver when called', () => {
    // Act
    observerOnMutate();

    // Assert
    expect(mockObserve).toHaveBeenCalledTimes(1);
    expect(mockObserve).toHaveBeenCalledWith(document.body, {
      childList: true,
      subtree: true,
    });
  });

  it('should capture MutationObserver callback', () => {
    // Act
    observerOnMutate();

    // Assert
    expect(capturedCallback).not.toBeNull();
    expect(typeof capturedCallback).toBe('function');
  });

  it('should apply rules to added Element nodes', async () => {
    // Arrange
    const { ApplyRulesToMutatedNodesUseCase } = await import('src/application/usecases/rule/ApplyRulesToMutatedNodesUseCase');
    const mockApplyRules = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplyRulesToMutatedNodesUseCase).mockImplementation(() => ({
      applyRules: mockApplyRules,
    }) as any);

    observerOnMutate();

    const addedElement = document.createElement('div');
    document.body.appendChild(addedElement);

    const mockMutation: Partial<MutationRecord> = {
      addedNodes: [addedElement] as unknown as NodeList,
    };

    // Act
    capturedCallback!([mockMutation as MutationRecord]);

    // Wait for debounce
    await vi.advanceTimersByTimeAsync(150);

    // Assert
    expect(mockApplyRules).toHaveBeenCalledWith(
      [addedElement],
      expect.any(Function)
    );

    // Cleanup
    document.body.removeChild(addedElement);
  });

  it('should ignore non-Element nodes (text nodes)', async () => {
    // Arrange
    const { ApplyRulesToMutatedNodesUseCase } = await import('src/application/usecases/rule/ApplyRulesToMutatedNodesUseCase');
    const mockApplyRules = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplyRulesToMutatedNodesUseCase).mockImplementation(() => ({
      applyRules: mockApplyRules,
    }) as any);

    observerOnMutate();

    const textNode = document.createTextNode('test text');

    const mockMutation: Partial<MutationRecord> = {
      addedNodes: [textNode] as unknown as NodeList,
    };

    // Act
    capturedCallback!([mockMutation as MutationRecord]);

    // Wait for debounce
    await vi.advanceTimersByTimeAsync(150);

    // Assert - applyRules should not be called for text nodes (empty array)
    expect(mockApplyRules).not.toHaveBeenCalled();
  });

  it('should debounce multiple rapid mutations', async () => {
    // Arrange
    const { ApplyRulesToMutatedNodesUseCase } = await import('src/application/usecases/rule/ApplyRulesToMutatedNodesUseCase');
    const mockApplyRules = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplyRulesToMutatedNodesUseCase).mockImplementation(() => ({
      applyRules: mockApplyRules,
    }) as any);

    observerOnMutate();

    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    document.body.appendChild(element1);
    document.body.appendChild(element2);

    const mockMutation1: Partial<MutationRecord> = {
      addedNodes: [element1] as unknown as NodeList,
    };
    const mockMutation2: Partial<MutationRecord> = {
      addedNodes: [element2] as unknown as NodeList,
    };

    // Act - trigger mutations rapidly
    capturedCallback!([mockMutation1 as MutationRecord]);
    await vi.advanceTimersByTimeAsync(50); // Less than debounce delay
    capturedCallback!([mockMutation2 as MutationRecord]);

    // Wait for debounce to complete
    await vi.advanceTimersByTimeAsync(150);

    // Assert - both elements should be processed together in one call after debounce
    expect(mockApplyRules).toHaveBeenCalledTimes(1);
    expect(mockApplyRules).toHaveBeenCalledWith(
      expect.arrayContaining([element1, element2]),
      expect.any(Function)
    );

    // Cleanup
    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });

  it('should pass isNodeInDocument function to use case', async () => {
    // Arrange
    const { ApplyRulesToMutatedNodesUseCase } = await import('src/application/usecases/rule/ApplyRulesToMutatedNodesUseCase');
    let capturedIsNodeInDocument: ((node: Element) => boolean) | null = null;
    const mockApplyRules = vi.fn().mockImplementation((_nodes, isNodeInDocument) => {
      capturedIsNodeInDocument = isNodeInDocument;
      return Promise.resolve();
    });
    vi.mocked(ApplyRulesToMutatedNodesUseCase).mockImplementation(() => ({
      applyRules: mockApplyRules,
    }) as any);

    observerOnMutate();

    const addedElement = document.createElement('div');
    document.body.appendChild(addedElement);

    const mockMutation: Partial<MutationRecord> = {
      addedNodes: [addedElement] as unknown as NodeList,
    };

    // Act
    capturedCallback!([mockMutation as MutationRecord]);

    // Wait for debounce
    await vi.advanceTimersByTimeAsync(150);

    // Assert - isNodeInDocument function should correctly check document.body.contains
    expect(capturedIsNodeInDocument).not.toBeNull();
    expect(capturedIsNodeInDocument!(addedElement)).toBe(true);

    const removedElement = document.createElement('span');
    expect(capturedIsNodeInDocument!(removedElement)).toBe(false);

    // Cleanup
    document.body.removeChild(addedElement);
  });
});
