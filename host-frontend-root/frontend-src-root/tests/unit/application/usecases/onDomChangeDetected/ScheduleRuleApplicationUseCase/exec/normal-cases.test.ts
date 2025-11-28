import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { IDebounceTimer } from 'src/application/ports/IDebounceTimer';
import { ScheduleRuleApplicationUseCase } from 'src/application/usecases/onDomChangeDetected/ScheduleRuleApplicationUseCase';

/**
 * ScheduleRuleApplicationUseCase.exec - 正常系テスト
 *
 * 1. デバウンスタイマーにコールバックをスケジュールする
 * 2. 連続した呼び出しでも毎回スケジュールが行われる（タイマー側でデバウンス処理）
 * 3. 正しい遅延時間でスケジュールされる
 */
describe('ScheduleRuleApplicationUseCase.exec - 正常系', () => {
  let mockDebounceTimer: IDebounceTimer;
  let mockSchedule: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSchedule = vi.fn();
    mockDebounceTimer = {
      schedule: mockSchedule,
    };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should schedule callback with debounce timer', () => {
    // Arrange
    const mockCallback = vi.fn().mockResolvedValue(undefined);
    const useCase = new ScheduleRuleApplicationUseCase(mockDebounceTimer, mockCallback);

    // Act
    useCase.exec();

    // Assert - schedule should be called with callback and delay
    expect(mockSchedule).toHaveBeenCalledTimes(1);
    expect(mockSchedule).toHaveBeenCalledWith(expect.any(Function), 100);
  });

  it('should schedule on each exec call', () => {
    // Arrange
    const mockCallback = vi.fn().mockResolvedValue(undefined);
    const useCase = new ScheduleRuleApplicationUseCase(mockDebounceTimer, mockCallback);

    // Act - call multiple times
    useCase.exec();
    useCase.exec();
    useCase.exec();

    // Assert - schedule should be called each time (timer handles debounce internally)
    expect(mockSchedule).toHaveBeenCalledTimes(3);
  });

  it('should pass correct callback to debounce timer', () => {
    // Arrange
    const mockCallback = vi.fn().mockResolvedValue(undefined);
    const useCase = new ScheduleRuleApplicationUseCase(mockDebounceTimer, mockCallback);
    let capturedCallback: (() => void) | undefined;
    mockSchedule.mockImplementation((callback: () => void) => {
      capturedCallback = callback;
    });

    // Act
    useCase.exec();

    // Simulate timer firing
    capturedCallback!();

    // Assert - original callback should be invoked
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
