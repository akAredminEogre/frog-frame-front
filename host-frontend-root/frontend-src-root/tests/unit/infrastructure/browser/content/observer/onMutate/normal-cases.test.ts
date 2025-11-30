import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockHolder = vi.hoisted(() => {
  const holder = {
    applyRulesWithDomDiffer: vi.fn(),
    scheduledCallback: null as (() => Promise<void>) | null,
    isExecuting: false,
    scheduleWithGuard: vi.fn(),
  };
  // Set up scheduleWithGuard implementation
  holder.scheduleWithGuard.mockImplementation((callback: () => Promise<void>) => {
    if (holder.isExecuting) {
      return;
    }
    holder.scheduledCallback = callback;
  });
  return holder;
});

// Mock the ChromeRuntimeRewriteRuleRepository
vi.mock('src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository', () => ({
  ChromeRuntimeRewriteRuleRepository: vi.fn().mockImplementation(() => ({
    getRulesMatchingUrl: vi.fn().mockImplementation(async () => ({
      applyRulesWithDomDiffer: (...args: unknown[]) => mockHolder.applyRulesWithDomDiffer(...args),
    })),
  })),
}));

// Mock the WindowCurrentUrlService
vi.mock('src/infrastructure/browser/window/WindowCurrentUrlService', () => ({
  WindowCurrentUrlService: vi.fn().mockImplementation(() => ({
    getCurrentUrl: vi.fn().mockReturnValue('https://example.com'),
  })),
}));

// Mock the DebounceTimer with simpler implementation for testing
vi.mock('src/infrastructure/browser/timer/DebounceTimer', () => ({
  DebounceTimer: vi.fn().mockImplementation(() => ({
    scheduleWithGuard: mockHolder.scheduleWithGuard,
    isExecuting: vi.fn().mockImplementation(() => mockHolder.isExecuting),
  })),
}));

import { observerOnMutate } from 'src/infrastructure/browser/content/observer/onMutate';

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
    mockHolder.applyRulesWithDomDiffer.mockClear();
    mockHolder.scheduleWithGuard.mockClear();

    mockObserve = vi.fn();
    mockDisconnect = vi.fn();
    capturedCallback = null;
    mockHolder.scheduledCallback = null;
    mockHolder.isExecuting = false;

    vi.stubGlobal('MutationObserver', vi.fn().mockImplementation((callback) => {
      capturedCallback = callback;
      return {
        observe: mockObserve,
        disconnect: mockDisconnect,
      };
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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
    observerOnMutate();

    const addedElement = document.createElement('div');
    document.body.appendChild(addedElement);

    const mockMutation: Partial<MutationRecord> = {
      addedNodes: [addedElement] as unknown as NodeList,
    };

    // Act
    capturedCallback!([mockMutation as MutationRecord]);

    // Execute the scheduled callback
    await mockHolder.scheduledCallback!();

    // Assert
    expect(mockHolder.applyRulesWithDomDiffer).toHaveBeenCalledWith(addedElement);

    // Cleanup
    document.body.removeChild(addedElement);
  });

  it('should ignore non-Element nodes (text nodes)', async () => {
    // Arrange
    observerOnMutate();

    const textNode = document.createTextNode('test text');

    const mockMutation: Partial<MutationRecord> = {
      addedNodes: [textNode] as unknown as NodeList,
    };

    // Act
    capturedCallback!([mockMutation as MutationRecord]);

    // Execute the scheduled callback
    await mockHolder.scheduledCallback!();

    // Assert - applyRulesWithDomDiffer should not be called for text nodes
    expect(mockHolder.applyRulesWithDomDiffer).not.toHaveBeenCalled();
  });

  it('should debounce multiple rapid mutations', async () => {
    // Arrange
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

    // Act - trigger mutations rapidly (both will be accumulated before callback runs)
    capturedCallback!([mockMutation1 as MutationRecord]);
    capturedCallback!([mockMutation2 as MutationRecord]);

    // Execute the scheduled callback (processes all accumulated elements)
    await mockHolder.scheduledCallback!();

    // Assert - both elements should be processed together after debounce
    // applyRulesWithDomDiffer is called once per element
    expect(mockHolder.applyRulesWithDomDiffer).toHaveBeenCalledTimes(2);
    expect(mockHolder.applyRulesWithDomDiffer).toHaveBeenCalledWith(element1);
    expect(mockHolder.applyRulesWithDomDiffer).toHaveBeenCalledWith(element2);

    // Cleanup
    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });

  it('should skip nodes that are no longer in the document', async () => {
    // Arrange
    observerOnMutate();

    // Create an element but don't add it to the document
    const detachedElement = document.createElement('div');

    const mockMutation: Partial<MutationRecord> = {
      addedNodes: [detachedElement] as unknown as NodeList,
    };

    // Act
    capturedCallback!([mockMutation as MutationRecord]);

    // Execute the scheduled callback
    await mockHolder.scheduledCallback!();

    // Assert - applyRulesWithDomDiffer should not be called for nodes not in document
    expect(mockHolder.applyRulesWithDomDiffer).not.toHaveBeenCalled();
  });
});
