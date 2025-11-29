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
 * observerOnMutate - 無限ループ防止テスト
 *
 * 拡張機能がDOMを更新した際に無限ループが発生しないことを確認
 * ルール適用中にトリガーされた新しいmutationは無視される
 */
describe('observerOnMutate - 無限ループ防止', () => {
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

  it('should ignore mutations that occur during rule application', async () => {
    // Arrange
    const { ApplyRulesOnPageLoadUseCase } = await import('src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase');

    let execCallCount = 0;
    const mockExec = vi.fn().mockImplementation(async () => {
      execCallCount++;

      // Simulate the extension modifying DOM during rule application
      // This would trigger another mutation
      if (execCallCount === 1) {
        const nestedElement = document.createElement('span');
        document.body.appendChild(nestedElement);

        // Trigger mutation callback as if MutationObserver fired
        const nestedMutation: Partial<MutationRecord> = {
          addedNodes: [nestedElement] as unknown as NodeList,
        };
        capturedCallback!([nestedMutation as MutationRecord]);

        // Cleanup
        document.body.removeChild(nestedElement);
      }
    });

    vi.mocked(ApplyRulesOnPageLoadUseCase).mockImplementation(() => ({
      exec: mockExec,
    }) as any);

    observerOnMutate();

    const initialElement = document.createElement('div');
    document.body.appendChild(initialElement);

    const mockMutation: Partial<MutationRecord> = {
      addedNodes: [initialElement] as unknown as NodeList,
    };

    // Act
    capturedCallback!([mockMutation as MutationRecord]);

    // Wait for debounce to trigger first rule application
    await vi.advanceTimersByTimeAsync(150);

    // Wait for any additional debounces
    await vi.advanceTimersByTimeAsync(150);

    // Assert - exec should only be called once for the initial element
    // The nested mutation should be ignored because isApplyingRules is true
    expect(mockExec).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(initialElement);
  });

  it('should process new mutations after rule application completes', async () => {
    // Arrange
    const { ApplyRulesOnPageLoadUseCase } = await import('src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase');
    const mockExec = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplyRulesOnPageLoadUseCase).mockImplementation(() => ({
      exec: mockExec,
    }) as any);

    observerOnMutate();

    const element1 = document.createElement('div');
    document.body.appendChild(element1);

    const mockMutation1: Partial<MutationRecord> = {
      addedNodes: [element1] as unknown as NodeList,
    };

    // Act - first mutation
    capturedCallback!([mockMutation1 as MutationRecord]);
    await vi.advanceTimersByTimeAsync(150);

    // Reset mock to track new calls
    mockExec.mockClear();

    // Act - second mutation after first completes
    const element2 = document.createElement('span');
    document.body.appendChild(element2);

    const mockMutation2: Partial<MutationRecord> = {
      addedNodes: [element2] as unknown as NodeList,
    };

    capturedCallback!([mockMutation2 as MutationRecord]);
    await vi.advanceTimersByTimeAsync(150);

    // Assert - second mutation should be processed normally
    expect(mockExec).toHaveBeenCalledTimes(1);
    expect(mockExec).toHaveBeenCalledWith(element2);

    // Cleanup
    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });
});
