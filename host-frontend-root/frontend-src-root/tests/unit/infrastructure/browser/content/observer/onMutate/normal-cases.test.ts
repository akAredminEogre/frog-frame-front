import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { observerOnMutate } from 'src/infrastructure/browser/content/observer/onMutate';

// Mock the ApplyRulesOnPageLoadUseCase
vi.mock('src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase', () => ({
  ApplyRulesOnPageLoadUseCase: vi.fn().mockImplementation(() => ({
    exec: vi.fn().mockResolvedValue(undefined),
  })),
}));

// Mock the ChromeRuntimeRewriteRuleRepository
vi.mock('src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository', () => ({
  ChromeRuntimeRewriteRuleRepository: vi.fn().mockImplementation(() => ({})),
}));

// Mock the WindowCurrentUrlService
vi.mock('src/infrastructure/browser/window/WindowCurrentUrlService', () => ({
  WindowCurrentUrlService: vi.fn().mockImplementation(() => ({
    getCurrentUrl: vi.fn().mockReturnValue('https://example.com'),
  })),
}));

// Mock the DebounceTimer - use actual implementation for integration testing
vi.mock('src/infrastructure/browser/timer/DebounceTimer', async () => {
  const actual = await vi.importActual('src/infrastructure/browser/timer/DebounceTimer');
  return actual;
});

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

  beforeEach(async () => {
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
    const { ApplyRulesOnPageLoadUseCase } = await import('src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase');
    const mockExec = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplyRulesOnPageLoadUseCase).mockImplementation(() => ({
      exec: mockExec,
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
    expect(mockExec).toHaveBeenCalledWith(addedElement);

    // Cleanup
    document.body.removeChild(addedElement);
  });

  it('should ignore non-Element nodes (text nodes)', async () => {
    // Arrange
    const { ApplyRulesOnPageLoadUseCase } = await import('src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase');
    const mockExec = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplyRulesOnPageLoadUseCase).mockImplementation(() => ({
      exec: mockExec,
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

    // Assert - exec should not be called for text nodes (empty array)
    expect(mockExec).not.toHaveBeenCalled();
  });

  it('should debounce multiple rapid mutations', async () => {
    // Arrange
    const { ApplyRulesOnPageLoadUseCase } = await import('src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase');
    const mockExec = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplyRulesOnPageLoadUseCase).mockImplementation(() => ({
      exec: mockExec,
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

    // Assert - both elements should be processed together after debounce
    // exec is called once per element
    expect(mockExec).toHaveBeenCalledTimes(2);
    expect(mockExec).toHaveBeenCalledWith(element1);
    expect(mockExec).toHaveBeenCalledWith(element2);

    // Cleanup
    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });

  it('should skip nodes that are no longer in the document', async () => {
    // Arrange
    const { ApplyRulesOnPageLoadUseCase } = await import('src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase');
    const mockExec = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplyRulesOnPageLoadUseCase).mockImplementation(() => ({
      exec: mockExec,
    }) as any);

    observerOnMutate();

    // Create an element but don't add it to the document
    const detachedElement = document.createElement('div');

    const mockMutation: Partial<MutationRecord> = {
      addedNodes: [detachedElement] as unknown as NodeList,
    };

    // Act
    capturedCallback!([mockMutation as MutationRecord]);

    // Wait for debounce
    await vi.advanceTimersByTimeAsync(150);

    // Assert - exec should not be called for nodes not in document
    expect(mockExec).not.toHaveBeenCalled();
  });
});
