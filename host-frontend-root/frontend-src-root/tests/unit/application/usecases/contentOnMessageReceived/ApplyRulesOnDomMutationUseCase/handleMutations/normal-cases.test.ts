import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApplyRulesOnDomMutationUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnDomMutationUseCase';

/**
 * ApplyRulesOnDomMutationUseCase.handleMutations - 正常系テスト
 *
 * 1. mutationsを受け取り、要素を蓄積してデバウンスでルール適用する
 * 2. 複数のmutationsをまとめて処理する
 * 3. Element以外のノードは無視する
 *
 * 注意: handleMutationsは初回ロード完了後（applyRulesToRoot呼び出し後）にのみ動作する
 * そのため、各テストでapplyRulesToRootを先に呼び出して初回ロード完了状態を作る
 */
describe('ApplyRulesOnDomMutationUseCase.handleMutations - 正常系', () => {
  let mockRepository: any;
  let mockCurrentUrlService: any;
  let mockDebounceTimer: any;
  let scheduledCallback: (() => Promise<void>) | null;
  let mockApplyRulesWithDomDiffer: ReturnType<typeof vi.fn>;
  let useCase: ApplyRulesOnDomMutationUseCase;

  beforeEach(async () => {
    vi.clearAllMocks();
    scheduledCallback = null;
    mockApplyRulesWithDomDiffer = vi.fn();

    mockRepository = {
      getRulesMatchingUrl: vi.fn().mockResolvedValue({
        applyRulesWithDomDiffer: mockApplyRulesWithDomDiffer,
      }),
    };
    mockCurrentUrlService = {
      getCurrentUrl: vi.fn().mockReturnValue('https://example.com'),
    };
    mockDebounceTimer = {
      scheduleWithGuard: vi.fn().mockImplementation((callback: () => Promise<void>) => {
        scheduledCallback = callback;
      }),
      isExecuting: vi.fn().mockReturnValue(false),
    };

    // UseCaseを作成し、applyRulesToRootを呼び出して初回ロード完了状態にする
    useCase = new ApplyRulesOnDomMutationUseCase(
      mockRepository,
      mockCurrentUrlService,
      mockDebounceTimer
    );
    await useCase.applyRulesToRoot(document.body);

    // applyRulesToRootでのモック呼び出しをクリア
    mockRepository.getRulesMatchingUrl.mockClear();
    mockApplyRulesWithDomDiffer.mockClear();
    mockCurrentUrlService.getCurrentUrl.mockClear();
    mockDebounceTimer.scheduleWithGuard.mockClear();
    scheduledCallback = null;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should accumulate elements and schedule debounced rule application', async () => {
    // Arrange
    const element = document.createElement('div');
    document.body.appendChild(element);

    const nodeList = [element] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([element]);

    const mockMutation = {
      addedNodes: nodeList,
    } as MutationRecord;

    // Act
    useCase.handleMutations([mockMutation]);

    // Assert
    expect(mockDebounceTimer.scheduleWithGuard).toHaveBeenCalledTimes(1);
    expect(scheduledCallback).not.toBeNull();

    // Execute the scheduled callback
    await scheduledCallback!();
    expect(mockCurrentUrlService.getCurrentUrl).toHaveBeenCalled();
    expect(mockRepository.getRulesMatchingUrl).toHaveBeenCalledWith('https://example.com');
    expect(mockApplyRulesWithDomDiffer).toHaveBeenCalledWith(element);

    // Cleanup
    document.body.removeChild(element);
  });

  it('should accumulate elements from multiple handleMutations calls', async () => {
    // Arrange
    const element1 = document.createElement('div');
    const element2 = document.createElement('span');
    document.body.appendChild(element1);
    document.body.appendChild(element2);

    const nodeList1 = [element1] as unknown as NodeList;
    (nodeList1 as any).forEach = Array.prototype.forEach.bind([element1]);

    const nodeList2 = [element2] as unknown as NodeList;
    (nodeList2 as any).forEach = Array.prototype.forEach.bind([element2]);

    const mockMutation1 = { addedNodes: nodeList1 } as MutationRecord;
    const mockMutation2 = { addedNodes: nodeList2 } as MutationRecord;

    // Act
    useCase.handleMutations([mockMutation1]);
    useCase.handleMutations([mockMutation2]);

    // Execute the scheduled callback
    await scheduledCallback!();

    // Assert
    expect(mockApplyRulesWithDomDiffer).toHaveBeenCalledTimes(2);
    expect(mockApplyRulesWithDomDiffer).toHaveBeenCalledWith(element1);
    expect(mockApplyRulesWithDomDiffer).toHaveBeenCalledWith(element2);

    // Cleanup
    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });

  it('should ignore non-Element nodes', async () => {
    // Arrange
    const textNode = document.createTextNode('test');

    const nodeList = [textNode] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([textNode]);

    const mockMutation = {
      addedNodes: nodeList,
    } as MutationRecord;

    // Act
    useCase.handleMutations([mockMutation]);
    await scheduledCallback!();

    // Assert
    expect(mockApplyRulesWithDomDiffer).not.toHaveBeenCalled();
  });

  it('should skip elements no longer in document', async () => {
    // Arrange
    const detachedElement = document.createElement('div');
    // Not appending to document.body

    const nodeList = [detachedElement] as unknown as NodeList;
    (nodeList as any).forEach = Array.prototype.forEach.bind([detachedElement]);

    const mockMutation = {
      addedNodes: nodeList,
    } as MutationRecord;

    // Act
    useCase.handleMutations([mockMutation]);
    await scheduledCallback!();

    // Assert
    expect(mockApplyRulesWithDomDiffer).not.toHaveBeenCalled();
  });
});
