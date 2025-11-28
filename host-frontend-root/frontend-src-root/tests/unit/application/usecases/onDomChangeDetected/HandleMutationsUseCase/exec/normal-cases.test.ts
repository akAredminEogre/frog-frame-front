import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CollectAddedNodesUseCase } from 'src/application/usecases/onDomChangeDetected/CollectAddedNodesUseCase';
import { HandleMutationsUseCase } from 'src/application/usecases/onDomChangeDetected/HandleMutationsUseCase';
import { ScheduleRuleApplicationUseCase } from 'src/application/usecases/onDomChangeDetected/ScheduleRuleApplicationUseCase';

/**
 * HandleMutationsUseCase.exec - 正常系テスト
 *
 * 1. ルール適用中でなければノードを収集してスケジュールする
 * 2. ルール適用中であれば何もしない
 */
describe('HandleMutationsUseCase.exec - 正常系', () => {
  let mockCollectExec: ReturnType<typeof vi.fn>;
  let mockScheduleExec: ReturnType<typeof vi.fn>;
  let mockCollectAddedNodesUseCase: CollectAddedNodesUseCase;
  let mockScheduleRuleApplicationUseCase: ScheduleRuleApplicationUseCase;

  beforeEach(() => {
    mockCollectExec = vi.fn();
    mockScheduleExec = vi.fn();
    mockCollectAddedNodesUseCase = {
      exec: mockCollectExec,
    } as unknown as CollectAddedNodesUseCase;
    mockScheduleRuleApplicationUseCase = {
      exec: mockScheduleExec,
    } as unknown as ScheduleRuleApplicationUseCase;
  });

  it('should collect nodes and schedule rule application when not applying rules', () => {
    // Arrange
    const useCase = new HandleMutationsUseCase(mockCollectAddedNodesUseCase, mockScheduleRuleApplicationUseCase);
    const element = document.createElement('div');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [element] as unknown as NodeList,
    };
    const isApplyingRules = () => false;

    // Act
    useCase.exec([mutation as MutationRecord], isApplyingRules);

    // Assert
    expect(mockCollectExec).toHaveBeenCalledTimes(1);
    expect(mockCollectExec).toHaveBeenCalledWith([mutation]);
    expect(mockScheduleExec).toHaveBeenCalledTimes(1);
  });

  it('should not collect nodes or schedule when applying rules', () => {
    // Arrange
    const useCase = new HandleMutationsUseCase(mockCollectAddedNodesUseCase, mockScheduleRuleApplicationUseCase);
    const element = document.createElement('div');
    const mutation: Partial<MutationRecord> = {
      addedNodes: [element] as unknown as NodeList,
    };
    const isApplyingRules = () => true;

    // Act
    useCase.exec([mutation as MutationRecord], isApplyingRules);

    // Assert
    expect(mockCollectExec).not.toHaveBeenCalled();
    expect(mockScheduleExec).not.toHaveBeenCalled();
  });

  it('should handle empty mutations array when not applying rules', () => {
    // Arrange
    const useCase = new HandleMutationsUseCase(mockCollectAddedNodesUseCase, mockScheduleRuleApplicationUseCase);
    const isApplyingRules = () => false;

    // Act
    useCase.exec([], isApplyingRules);

    // Assert
    expect(mockCollectExec).toHaveBeenCalledTimes(1);
    expect(mockCollectExec).toHaveBeenCalledWith([]);
    expect(mockScheduleExec).toHaveBeenCalledTimes(1);
  });
});
