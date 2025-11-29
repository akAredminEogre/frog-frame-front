import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ICurrentUrlService } from 'src/application/ports/ICurrentUrlService';
import { IDebounceTimer } from 'src/application/ports/IDebounceTimer';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { HandleMutationsUseCase } from 'src/application/usecases/onDomChangeDetected/HandleMutationsUseCase';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

/**
 * HandleMutationsUseCase.exec - 正常系テスト
 *
 * 1. ミューテーションを処理してノードを収集し、ルール適用をスケジュールする
 * 2. 空のミューテーション配列でも正常に処理する
 * 3. ルール適用中は追加のミューテーションを無視する
 */
describe('HandleMutationsUseCase.exec - 正常系', () => {
  let mockRepository: IRewriteRuleRepository;
  let mockCurrentUrlService: ICurrentUrlService;
  let mockDebounceTimer: IDebounceTimer;
  let mockGetRulesMatchingUrl: ReturnType<typeof vi.fn>;
  let mockGetCurrentUrl: ReturnType<typeof vi.fn>;
  let mockSchedule: ReturnType<typeof vi.fn>;
  let scheduledCallback: (() => void) | undefined;
  let addedElements: Element[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
    scheduledCallback = undefined;
    addedElements = [];

    mockGetRulesMatchingUrl = vi.fn().mockResolvedValue(new RewriteRules([]));
    mockGetCurrentUrl = vi.fn().mockReturnValue('https://example.com');
    mockSchedule = vi.fn().mockImplementation((callback: () => void) => {
      scheduledCallback = callback;
    });

    mockRepository = {
      getAll: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      getById: vi.fn(),
      getRulesMatchingUrl: mockGetRulesMatchingUrl,
    } as IRewriteRuleRepository;

    mockCurrentUrlService = {
      getCurrentUrl: mockGetCurrentUrl,
    } as ICurrentUrlService;

    mockDebounceTimer = {
      schedule: mockSchedule,
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
    // Cleanup elements added to the body
    addedElements.forEach((element) => {
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
    });
    addedElements = [];
  });

  it('should process mutations and schedule rule application', async () => {
    // Arrange
    const useCase = new HandleMutationsUseCase(mockRepository, mockCurrentUrlService, mockDebounceTimer);
    const element = document.createElement('div');
    document.body.appendChild(element);
    addedElements.push(element);

    const mutation: Partial<MutationRecord> = {
      addedNodes: [element] as unknown as NodeList,
    };

    // Act
    useCase.exec([mutation as MutationRecord]);

    // Assert - schedule should be called
    expect(mockSchedule).toHaveBeenCalledTimes(1);

    // Simulate debounce timer firing
    await scheduledCallback!();

    // Assert - URL service should be called
    expect(mockGetCurrentUrl).toHaveBeenCalledTimes(1);
  });

  it('should handle empty mutations array', async () => {
    // Arrange
    const useCase = new HandleMutationsUseCase(mockRepository, mockCurrentUrlService, mockDebounceTimer);

    // Act
    useCase.exec([]);

    // Assert - schedule should still be called
    expect(mockSchedule).toHaveBeenCalledTimes(1);

    // Simulate debounce timer firing
    await scheduledCallback!();

    // Since no nodes were added, getCurrentUrl should not be called
    expect(mockGetCurrentUrl).not.toHaveBeenCalled();
  });

  it('should ignore mutations while rules are being applied', async () => {
    // Arrange
    const useCase = new HandleMutationsUseCase(mockRepository, mockCurrentUrlService, mockDebounceTimer);
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    document.body.appendChild(element1);
    document.body.appendChild(element2);
    addedElements.push(element1, element2);

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
    mockGetRulesMatchingUrl.mockReturnValue(applyPromise.then(() => new RewriteRules([])));

    // Act - first mutation
    useCase.exec([mutation1 as MutationRecord]);
    const firstCallback = scheduledCallback;

    // Start applying rules (but don't await yet)
    const applyingPromise = firstCallback!();

    // While rules are being applied, send another mutation
    useCase.exec([mutation2 as MutationRecord]);

    // Resolve the apply operation
    resolveApply!();
    await applyingPromise;

    // Assert - getCurrentUrl should only be called once (for the first batch)
    // The second mutation should have been ignored while isApplyingRules was true
    expect(mockGetCurrentUrl).toHaveBeenCalledTimes(1);
  });

  it('should collect multiple nodes from mutations', async () => {
    // Arrange
    const useCase = new HandleMutationsUseCase(mockRepository, mockCurrentUrlService, mockDebounceTimer);
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    document.body.appendChild(element1);
    document.body.appendChild(element2);
    addedElements.push(element1, element2);

    const mutation: Partial<MutationRecord> = {
      addedNodes: [element1, element2] as unknown as NodeList,
    };

    // Act
    useCase.exec([mutation as MutationRecord]);
    await scheduledCallback!();

    // Assert
    expect(mockGetCurrentUrl).toHaveBeenCalledTimes(1);
  });

  it('should batch multiple exec calls within debounce window', async () => {
    // Arrange
    const useCase = new HandleMutationsUseCase(mockRepository, mockCurrentUrlService, mockDebounceTimer);
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    document.body.appendChild(element1);
    document.body.appendChild(element2);
    addedElements.push(element1, element2);

    const mutation1: Partial<MutationRecord> = {
      addedNodes: [element1] as unknown as NodeList,
    };
    const mutation2: Partial<MutationRecord> = {
      addedNodes: [element2] as unknown as NodeList,
    };

    // Act - multiple rapid calls
    useCase.exec([mutation1 as MutationRecord]);
    useCase.exec([mutation2 as MutationRecord]);

    // Assert - schedule should be called twice (timer handles debounce internally)
    expect(mockSchedule).toHaveBeenCalledTimes(2);

    // Simulate debounce timer firing (only the last scheduled callback matters)
    await scheduledCallback!();

    // Assert - only one rule application should happen
    expect(mockGetCurrentUrl).toHaveBeenCalledTimes(1);
  });
});
