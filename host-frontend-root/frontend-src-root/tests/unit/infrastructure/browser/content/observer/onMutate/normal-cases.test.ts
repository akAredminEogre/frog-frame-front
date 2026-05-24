import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockHolder = vi.hoisted(() => {
  return {
    handleMutations: vi.fn(),
  };
});

// Mock the shared UseCase instance
vi.mock('src/infrastructure/browser/content/instance/domMutationUseCaseInstance', () => ({
  domMutationUseCaseInstance: {
    handleMutations: (...args: unknown[]) => mockHolder.handleMutations(...args),
  },
}));

import { observerOnMutate } from 'src/infrastructure/browser/content/observer/onMutate';

/**
 * observerOnMutate - 正常系テスト
 *
 * observerOnMutate関数の責務は以下に限定される:
 * 1. MutationObserverを登録する
 * 2. mutationsをdomMutationUseCaseInstanceに渡す
 *
 * 要素のフィルタリングやデバウンス処理はApplyRulesOnDomMutationUseCaseの責務
 */
describe('observerOnMutate - 正常系', () => {
  let mockObserve: ReturnType<typeof vi.fn>;
  let mockDisconnect: ReturnType<typeof vi.fn>;
  let capturedCallback: ((mutations: MutationRecord[]) => void) | null;

  beforeEach(async () => {
    mockHolder.handleMutations.mockClear();

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

  it('should pass mutations to domMutationUseCaseInstance.handleMutations', () => {
    // Arrange
    observerOnMutate();

    const addedElement = document.createElement('div');
    const mockMutation: Partial<MutationRecord> = {
      addedNodes: [addedElement] as unknown as NodeList,
    };
    const mutations = [mockMutation as MutationRecord];

    // Act
    capturedCallback!(mutations);

    // Assert
    expect(mockHolder.handleMutations).toHaveBeenCalledTimes(1);
    expect(mockHolder.handleMutations).toHaveBeenCalledWith(mutations);
  });

  it('should pass multiple mutations to handleMutations', () => {
    // Arrange
    observerOnMutate();

    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    const mockMutation1: Partial<MutationRecord> = {
      addedNodes: [element1] as unknown as NodeList,
    };
    const mockMutation2: Partial<MutationRecord> = {
      addedNodes: [element2] as unknown as NodeList,
    };
    const mutations = [mockMutation1 as MutationRecord, mockMutation2 as MutationRecord];

    // Act
    capturedCallback!(mutations);

    // Assert
    expect(mockHolder.handleMutations).toHaveBeenCalledTimes(1);
    expect(mockHolder.handleMutations).toHaveBeenCalledWith(mutations);
  });
});
