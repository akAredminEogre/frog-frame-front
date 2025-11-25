import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DomMutationObserverService } from 'src/infrastructure/browser/content/mutation/DomMutationObserverService';

// Mock the ApplySavedRulesOnPageLoadUseCase
vi.mock('src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase', () => ({
  ApplySavedRulesOnPageLoadUseCase: vi.fn().mockImplementation(() => ({
    applyAllRules: vi.fn().mockResolvedValue(undefined),
  })),
}));

// Mock the ChromeRuntimeRewriteRuleRepository
vi.mock('src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository', () => ({
  ChromeRuntimeRewriteRuleRepository: vi.fn().mockImplementation(() => ({})),
}));

/**
 * DomMutationObserverService mutation handling - 正常系テスト
 *
 * 1. DOMにノードが追加された時、ルールが適用される
 * 2. ルール適用中は無限ループを防ぐため新しいmutationは無視される
 * 3. デバウンス処理により複数のmutationがまとめて処理される
 */
describe('DomMutationObserverService handleMutations - 正常系', () => {
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

  it('should capture MutationObserver callback during construction', () => {
    // Arrange & Act
    new DomMutationObserverService('https://example.com');

    // Assert
    expect(capturedCallback).not.toBeNull();
    expect(typeof capturedCallback).toBe('function');
  });

  it('should collect added Element nodes from mutations', async () => {
    // Arrange
    const { ApplySavedRulesOnPageLoadUseCase } = await import('src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase');
    const mockApplyAllRules = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplySavedRulesOnPageLoadUseCase).mockImplementation(() => ({
      applyAllRules: mockApplyAllRules,
    }) as any);

    const service = new DomMutationObserverService('https://example.com');
    service.startObserving();

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
    expect(mockApplyAllRules).toHaveBeenCalledWith(addedElement, 'https://example.com');

    // Cleanup
    document.body.removeChild(addedElement);
  });

  it('should ignore non-Element nodes (text nodes)', async () => {
    // Arrange
    const { ApplySavedRulesOnPageLoadUseCase } = await import('src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase');
    const mockApplyAllRules = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplySavedRulesOnPageLoadUseCase).mockImplementation(() => ({
      applyAllRules: mockApplyAllRules,
    }) as any);

    const service = new DomMutationObserverService('https://example.com');
    service.startObserving();

    const textNode = document.createTextNode('test text');

    const mockMutation: Partial<MutationRecord> = {
      addedNodes: [textNode] as unknown as NodeList,
    };

    // Act
    capturedCallback!([mockMutation as MutationRecord]);

    // Wait for debounce
    await vi.advanceTimersByTimeAsync(150);

    // Assert - applyAllRules should not be called for text nodes
    expect(mockApplyAllRules).not.toHaveBeenCalled();
  });

  it('should debounce multiple rapid mutations', async () => {
    // Arrange
    const { ApplySavedRulesOnPageLoadUseCase } = await import('src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase');
    const mockApplyAllRules = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplySavedRulesOnPageLoadUseCase).mockImplementation(() => ({
      applyAllRules: mockApplyAllRules,
    }) as any);

    const service = new DomMutationObserverService('https://example.com');
    service.startObserving();

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

    // Assert - both elements should be processed together after debounce
    expect(mockApplyAllRules).toHaveBeenCalledTimes(2);

    // Cleanup
    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });

  it('should skip nodes that are no longer in the document', async () => {
    // Arrange
    const { ApplySavedRulesOnPageLoadUseCase } = await import('src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase');
    const mockApplyAllRules = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplySavedRulesOnPageLoadUseCase).mockImplementation(() => ({
      applyAllRules: mockApplyAllRules,
    }) as any);

    const service = new DomMutationObserverService('https://example.com');
    service.startObserving();

    const removedElement = document.createElement('div');
    // Don't append to document - simulate an element that was added then removed

    const mockMutation: Partial<MutationRecord> = {
      addedNodes: [removedElement] as unknown as NodeList,
    };

    // Act
    capturedCallback!([mockMutation as MutationRecord]);

    // Wait for debounce
    await vi.advanceTimersByTimeAsync(150);

    // Assert - applyAllRules should not be called for removed elements
    expect(mockApplyAllRules).not.toHaveBeenCalled();
  });
});
