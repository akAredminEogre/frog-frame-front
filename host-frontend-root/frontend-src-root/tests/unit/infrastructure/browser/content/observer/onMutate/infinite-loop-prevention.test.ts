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

  it('should ignore mutations that occur during rule application', async () => {
    // Arrange
    let applyRulesCallCount = 0;
    mockHolder.applyRulesWithDomDiffer.mockImplementation(() => {
      applyRulesCallCount++;

      // Simulate the extension modifying DOM during rule application
      // This would trigger another mutation
      if (applyRulesCallCount === 1) {
        const nestedElement = document.createElement('span');
        document.body.appendChild(nestedElement);

        // Set isExecuting to true to simulate guard
        mockHolder.isExecuting = true;

        // Trigger mutation callback as if MutationObserver fired
        const nestedMutation: Partial<MutationRecord> = {
          addedNodes: [nestedElement] as unknown as NodeList,
        };
        capturedCallback!([nestedMutation as MutationRecord]);

        // Cleanup
        document.body.removeChild(nestedElement);
      }
    });

    observerOnMutate();

    const initialElement = document.createElement('div');
    document.body.appendChild(initialElement);

    const mockMutation: Partial<MutationRecord> = {
      addedNodes: [initialElement] as unknown as NodeList,
    };

    // Act
    capturedCallback!([mockMutation as MutationRecord]);

    // Execute the scheduled callback
    await mockHolder.scheduledCallback!();

    // Assert - applyRulesWithDomDiffer should only be called once for the initial element
    // The nested mutation should be ignored because isExecuting is true
    expect(mockHolder.applyRulesWithDomDiffer).toHaveBeenCalledTimes(1);

    // Cleanup
    document.body.removeChild(initialElement);
  });

  it('should process new mutations after rule application completes', async () => {
    // Arrange
    observerOnMutate();

    const element1 = document.createElement('div');
    document.body.appendChild(element1);

    const mockMutation1: Partial<MutationRecord> = {
      addedNodes: [element1] as unknown as NodeList,
    };

    // Act - first mutation
    capturedCallback!([mockMutation1 as MutationRecord]);
    await mockHolder.scheduledCallback!();

    // Reset mock to track new calls
    mockHolder.applyRulesWithDomDiffer.mockClear();
    mockHolder.isExecuting = false;

    // Act - second mutation after first completes
    const element2 = document.createElement('span');
    document.body.appendChild(element2);

    const mockMutation2: Partial<MutationRecord> = {
      addedNodes: [element2] as unknown as NodeList,
    };

    capturedCallback!([mockMutation2 as MutationRecord]);
    await mockHolder.scheduledCallback!();

    // Assert - second mutation should be processed normally
    expect(mockHolder.applyRulesWithDomDiffer).toHaveBeenCalledTimes(1);
    expect(mockHolder.applyRulesWithDomDiffer).toHaveBeenCalledWith(element2);

    // Cleanup
    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });
});
