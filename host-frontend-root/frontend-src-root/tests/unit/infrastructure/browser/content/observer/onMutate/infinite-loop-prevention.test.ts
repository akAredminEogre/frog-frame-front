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

// Mock the CollectAddedNodesUseCase - use actual implementation for integration testing
vi.mock('src/application/usecases/onDomChangeDetected/CollectAddedNodesUseCase', async () => {
  const actual = await vi.importActual('src/application/usecases/onDomChangeDetected/CollectAddedNodesUseCase');
  return actual;
});

// Mock the ScheduleRuleApplicationUseCase - use actual implementation for integration testing
vi.mock('src/application/usecases/onDomChangeDetected/ScheduleRuleApplicationUseCase', async () => {
  const actual = await vi.importActual('src/application/usecases/onDomChangeDetected/ScheduleRuleApplicationUseCase');
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

  it('should ignore mutations that occur during rule application', async () => {
    // Arrange
    const { ApplyRulesToMutatedNodesUseCase } = await import('src/application/usecases/rule/ApplyRulesToMutatedNodesUseCase');

    let applyRulesCallCount = 0;
    const mockApplyRules = vi.fn().mockImplementation(async () => {
      applyRulesCallCount++;

      // Simulate the extension modifying DOM during rule application
      // This would trigger another mutation
      if (applyRulesCallCount === 1) {
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

    vi.mocked(ApplyRulesToMutatedNodesUseCase).mockImplementation(() => ({
      applyRules: mockApplyRules,
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

    // Assert - applyRules should only be called once for the initial element
    // The nested mutation should be ignored because isApplyingRules is true
    expect(mockApplyRules).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(initialElement);
  });

  it('should process new mutations after rule application completes', async () => {
    // Arrange
    const { ApplyRulesToMutatedNodesUseCase } = await import('src/application/usecases/rule/ApplyRulesToMutatedNodesUseCase');
    const mockApplyRules = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplyRulesToMutatedNodesUseCase).mockImplementation(() => ({
      applyRules: mockApplyRules,
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
    mockApplyRules.mockClear();

    // Act - second mutation after first completes
    const element2 = document.createElement('span');
    document.body.appendChild(element2);

    const mockMutation2: Partial<MutationRecord> = {
      addedNodes: [element2] as unknown as NodeList,
    };

    capturedCallback!([mockMutation2 as MutationRecord]);
    await vi.advanceTimersByTimeAsync(150);

    // Assert - second mutation should be processed normally
    expect(mockApplyRules).toHaveBeenCalledTimes(1);
    expect(mockApplyRules).toHaveBeenCalledWith(
      [element2],
      expect.any(Function)
    );

    // Cleanup
    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });
});
