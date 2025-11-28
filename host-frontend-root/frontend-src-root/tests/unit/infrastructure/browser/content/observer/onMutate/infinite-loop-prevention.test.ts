import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Tab } from 'src/domain/value-objects/Tab';
import { observerOnMutate } from 'src/infrastructure/browser/content/observer/onMutate';

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

// Mock the ChromeCurrentTabService
vi.mock('src/infrastructure/browser/tabs/ChromeCurrentTabService', () => ({
  ChromeCurrentTabService: vi.fn(),
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

// Mock the HandleMutationsUseCase - use actual implementation for integration testing
vi.mock('src/application/usecases/onDomChangeDetected/HandleMutationsUseCase', async () => {
  const actual = await vi.importActual('src/application/usecases/onDomChangeDetected/HandleMutationsUseCase');
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

    // Setup ChromeCurrentTabService mock
    const { ChromeCurrentTabService } = await import('src/infrastructure/browser/tabs/ChromeCurrentTabService');
    vi.mocked(ChromeCurrentTabService).mockImplementation(() => ({
      getCurrentTab: vi.fn().mockResolvedValue(new Tab(1, 'https://example.com')),
      getTabById: vi.fn(),
    }) as any);

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
    const { ApplySavedRulesOnPageLoadUseCase } = await import('src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase');

    let applyAllRulesCallCount = 0;
    const mockApplyAllRules = vi.fn().mockImplementation(async () => {
      applyAllRulesCallCount++;

      // Simulate the extension modifying DOM during rule application
      // This would trigger another mutation
      if (applyAllRulesCallCount === 1) {
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

    vi.mocked(ApplySavedRulesOnPageLoadUseCase).mockImplementation(() => ({
      applyAllRules: mockApplyAllRules,
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

    // Assert - applyAllRules should only be called once for the initial element
    // The nested mutation should be ignored because isApplyingRules is true
    expect(mockApplyAllRules).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(initialElement);
  });

  it('should process new mutations after rule application completes', async () => {
    // Arrange
    const { ApplySavedRulesOnPageLoadUseCase } = await import('src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase');
    const mockApplyAllRules = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplySavedRulesOnPageLoadUseCase).mockImplementation(() => ({
      applyAllRules: mockApplyAllRules,
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
    mockApplyAllRules.mockClear();

    // Act - second mutation after first completes
    const element2 = document.createElement('span');
    document.body.appendChild(element2);

    const mockMutation2: Partial<MutationRecord> = {
      addedNodes: [element2] as unknown as NodeList,
    };

    capturedCallback!([mockMutation2 as MutationRecord]);
    await vi.advanceTimersByTimeAsync(150);

    // Assert - second mutation should be processed normally
    expect(mockApplyAllRules).toHaveBeenCalledTimes(1);
    expect(mockApplyAllRules).toHaveBeenCalledWith(
      element2,
      'https://example.com'
    );

    // Cleanup
    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });
});
