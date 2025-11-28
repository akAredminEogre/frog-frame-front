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

// Mock the DebounceTimer - use actual implementation for integration testing
vi.mock('src/infrastructure/browser/timer/DebounceTimer', async () => {
  const actual = await vi.importActual('src/infrastructure/browser/timer/DebounceTimer');
  return actual;
});

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
    const { ApplySavedRulesOnPageLoadUseCase } = await import('src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase');
    const mockApplyAllRules = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplySavedRulesOnPageLoadUseCase).mockImplementation(() => ({
      applyAllRules: mockApplyAllRules,
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
    expect(mockApplyAllRules).toHaveBeenCalledWith(
      addedElement,
      'https://example.com'
    );

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

    observerOnMutate();

    const textNode = document.createTextNode('test text');

    const mockMutation: Partial<MutationRecord> = {
      addedNodes: [textNode] as unknown as NodeList,
    };

    // Act
    capturedCallback!([mockMutation as MutationRecord]);

    // Wait for debounce
    await vi.advanceTimersByTimeAsync(150);

    // Assert - applyAllRules should not be called for text nodes (empty array)
    expect(mockApplyAllRules).not.toHaveBeenCalled();
  });

  it('should debounce multiple rapid mutations', async () => {
    // Arrange
    const { ApplySavedRulesOnPageLoadUseCase } = await import('src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase');
    const mockApplyAllRules = vi.fn().mockResolvedValue(undefined);
    vi.mocked(ApplySavedRulesOnPageLoadUseCase).mockImplementation(() => ({
      applyAllRules: mockApplyAllRules,
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
    // applyAllRules is called once per element
    expect(mockApplyAllRules).toHaveBeenCalledTimes(2);
    expect(mockApplyAllRules).toHaveBeenCalledWith(element1, 'https://example.com');
    expect(mockApplyAllRules).toHaveBeenCalledWith(element2, 'https://example.com');

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

    // Assert - applyAllRules should not be called for nodes not in document
    expect(mockApplyAllRules).not.toHaveBeenCalled();
  });
});
