import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApplyRulesOnDomMutationUseCase } from 'src/application/usecases/contentOnMessageReceived/ApplyRulesOnDomMutationUseCase';

// Mock ApplyRulesOnPageLoadUseCase (used by Elements.applyRules)
vi.mock('src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase', () => ({
  ApplyRulesOnPageLoadUseCase: vi.fn().mockImplementation(() => ({
    exec: vi.fn().mockResolvedValue(undefined),
  })),
}));

/**
 * ApplyRulesOnDomMutationUseCase.handleMutations - 正常系テスト
 *
 * 1. mutationsを受け取り、要素を蓄積してデバウンスでルール適用する
 * 2. 複数のmutationsをまとめて処理する
 * 3. Element以外のノードは無視する
 */
describe('ApplyRulesOnDomMutationUseCase.handleMutations - 正常系', () => {
  let mockRepository: any;
  let mockCurrentUrlService: any;
  let mockDebounceTimer: any;
  let scheduledCallback: (() => Promise<void>) | null;
  let mockExec: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    scheduledCallback = null;
    mockExec = vi.fn().mockResolvedValue(undefined);

    // Re-mock the UseCase for each test
    const { ApplyRulesOnPageLoadUseCase } = await import(
      'src/application/usecases/contentOnMessageReceived/ApplyRulesOnPageLoadUseCase'
    );
    vi.mocked(ApplyRulesOnPageLoadUseCase).mockImplementation(
      () =>
        ({
          exec: mockExec,
        }) as any
    );

    mockRepository = {};
    mockCurrentUrlService = {
      getCurrentUrl: vi.fn().mockReturnValue('https://example.com'),
    };
    mockDebounceTimer = {
      scheduleWithGuard: vi.fn().mockImplementation((callback: () => Promise<void>) => {
        scheduledCallback = callback;
      }),
      isExecuting: vi.fn().mockReturnValue(false),
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should accumulate elements and schedule debounced rule application', async () => {
    // Arrange
    const useCase = new ApplyRulesOnDomMutationUseCase(
      mockRepository,
      mockCurrentUrlService,
      mockDebounceTimer
    );

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
    expect(mockExec).toHaveBeenCalledWith(element);

    // Cleanup
    document.body.removeChild(element);
  });

  it('should accumulate elements from multiple handleMutations calls', async () => {
    // Arrange
    const useCase = new ApplyRulesOnDomMutationUseCase(
      mockRepository,
      mockCurrentUrlService,
      mockDebounceTimer
    );

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
    expect(mockExec).toHaveBeenCalledTimes(2);
    expect(mockExec).toHaveBeenCalledWith(element1);
    expect(mockExec).toHaveBeenCalledWith(element2);

    // Cleanup
    document.body.removeChild(element1);
    document.body.removeChild(element2);
  });

  it('should ignore non-Element nodes', async () => {
    // Arrange
    const useCase = new ApplyRulesOnDomMutationUseCase(
      mockRepository,
      mockCurrentUrlService,
      mockDebounceTimer
    );

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
    expect(mockExec).not.toHaveBeenCalled();
  });

  it('should skip elements no longer in document', async () => {
    // Arrange
    const useCase = new ApplyRulesOnDomMutationUseCase(
      mockRepository,
      mockCurrentUrlService,
      mockDebounceTimer
    );

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
    expect(mockExec).not.toHaveBeenCalled();
  });
});
