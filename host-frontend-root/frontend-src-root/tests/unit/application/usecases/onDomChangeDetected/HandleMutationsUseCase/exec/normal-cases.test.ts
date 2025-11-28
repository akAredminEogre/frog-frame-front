import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { HandleMutationsUseCase } from 'src/application/usecases/onDomChangeDetected/HandleMutationsUseCase';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
import { Tab } from 'src/domain/value-objects/Tab';

/**
 * HandleMutationsUseCase.exec - 正常系テスト
 *
 * 1. ミューテーションを処理してノードを収集し、ルール適用をスケジュールする
 * 2. 空のミューテーション配列でも正常に処理する
 * 3. ルール適用中は追加のミューテーションを無視する
 */
describe('HandleMutationsUseCase.exec - 正常系', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockCurrentTabService: ICurrentTabService;
  let mockGetAll: ReturnType<typeof vi.fn>;
  let mockGetCurrentTab: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    mockGetAll = vi.fn().mockResolvedValue(new RewriteRules([]));
    mockGetCurrentTab = vi.fn().mockResolvedValue(new Tab(1, 'https://example.com'));

    mockRepository = {
      getAll: mockGetAll,
      create: vi.fn(),
      update: vi.fn(),
      getById: vi.fn(),
    } as IRewriteRuleRepository;

    mockCurrentTabService = {
      getCurrentTab: mockGetCurrentTab,
      getTabById: vi.fn(),
    } as ICurrentTabService;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it('should process mutations and schedule rule application', () => {
    // Arrange
    const useCase = new HandleMutationsUseCase(mockRepository, mockCurrentTabService);
    const element = document.createElement('div');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [element] as unknown as NodeList,
    };

    // Act
    useCase.exec([mutation as MutationRecord]);

    // Assert - debounce timer should be set
    // After debounce delay, rules should be applied
    vi.advanceTimersByTime(100);
    expect(mockGetCurrentTab).toHaveBeenCalledTimes(1);
  });

  it('should handle empty mutations array', () => {
    // Arrange
    const useCase = new HandleMutationsUseCase(mockRepository, mockCurrentTabService);

    // Act
    useCase.exec([]);

    // Assert - with empty mutations, no nodes to process
    vi.advanceTimersByTime(100);
    // Since no nodes were added, applyRules should not be called
    expect(mockGetCurrentTab).not.toHaveBeenCalled();
  });

  it('should ignore mutations while rules are being applied', async () => {
    // Arrange
    const useCase = new HandleMutationsUseCase(mockRepository, mockCurrentTabService);
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    const mutation1: Partial<MutationRecord> = {
      addedNodes: [element1] as unknown as NodeList,
    };
    const mutation2: Partial<MutationRecord> = {
      addedNodes: [element2] as unknown as NodeList,
    };

    // Make applyRules take time to simulate async processing
    let resolveApply: () => void;
    const applyPromise = new Promise<void>((resolve) => {
      resolveApply = resolve;
    });
    mockGetAll.mockReturnValue(applyPromise.then(() => new RewriteRules([])));

    // Act - first mutation
    useCase.exec([mutation1 as MutationRecord]);

    // Trigger debounce and start applying rules
    vi.advanceTimersByTime(100);

    // While rules are being applied, send another mutation
    useCase.exec([mutation2 as MutationRecord]);

    // Resolve the apply operation
    resolveApply!();
    await vi.runAllTimersAsync();

    // Assert - getCurrentTab should only be called once (for the first batch)
    // The second mutation should have been ignored while isApplyingRules was true
    expect(mockGetCurrentTab).toHaveBeenCalledTimes(1);
  });

  it('should collect multiple nodes from mutations', () => {
    // Arrange
    const useCase = new HandleMutationsUseCase(mockRepository, mockCurrentTabService);
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [element1, element2] as unknown as NodeList,
    };

    // Act
    useCase.exec([mutation as MutationRecord]);
    vi.advanceTimersByTime(100);

    // Assert
    expect(mockGetCurrentTab).toHaveBeenCalledTimes(1);
  });

  it('should batch multiple exec calls within debounce window', () => {
    // Arrange
    const useCase = new HandleMutationsUseCase(mockRepository, mockCurrentTabService);
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    const mutation1: Partial<MutationRecord> = {
      addedNodes: [element1] as unknown as NodeList,
    };
    const mutation2: Partial<MutationRecord> = {
      addedNodes: [element2] as unknown as NodeList,
    };

    // Act - multiple rapid calls
    useCase.exec([mutation1 as MutationRecord]);
    vi.advanceTimersByTime(50); // Half of debounce time
    useCase.exec([mutation2 as MutationRecord]);
    vi.advanceTimersByTime(100); // Full debounce time from second call

    // Assert - only one rule application should happen
    expect(mockGetCurrentTab).toHaveBeenCalledTimes(1);
  });
});
