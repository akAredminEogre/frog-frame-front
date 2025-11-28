import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ScheduleRuleApplicationUseCase } from 'src/application/usecases/onDomChangeDetected/ScheduleRuleApplicationUseCase';

/**
 * ScheduleRuleApplicationUseCase.exec - 正常系テスト
 *
 * 1. デバウンス後にコールバックを呼び出す
 * 2. 連続した呼び出しをデバウンスする
 * 3. デバウンス中に新しい呼び出しがあれば前のタイマーをキャンセルする
 */
describe('ScheduleRuleApplicationUseCase.exec - 正常系', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call callback after debounce delay', async () => {
    // Arrange
    const mockCallback = vi.fn().mockResolvedValue(undefined);
    const useCase = new ScheduleRuleApplicationUseCase(mockCallback);

    // Act
    useCase.exec();

    // Assert - callback should not be called immediately
    expect(mockCallback).not.toHaveBeenCalled();

    // Advance timer past debounce delay (100ms)
    await vi.advanceTimersByTimeAsync(150);

    // Assert - callback should be called after debounce
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should debounce multiple rapid calls', async () => {
    // Arrange
    const mockCallback = vi.fn().mockResolvedValue(undefined);
    const useCase = new ScheduleRuleApplicationUseCase(mockCallback);

    // Act - call multiple times rapidly
    useCase.exec();
    await vi.advanceTimersByTimeAsync(50);
    useCase.exec();
    await vi.advanceTimersByTimeAsync(50);
    useCase.exec();

    // Advance timer past debounce delay
    await vi.advanceTimersByTimeAsync(150);

    // Assert - callback should only be called once
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous timer when called again', async () => {
    // Arrange
    const mockCallback = vi.fn().mockResolvedValue(undefined);
    const useCase = new ScheduleRuleApplicationUseCase(mockCallback);

    // Act - first call
    useCase.exec();
    await vi.advanceTimersByTimeAsync(50);

    // Second call should reset the timer
    useCase.exec();
    await vi.advanceTimersByTimeAsync(50);

    // At this point, 100ms has passed since first call, but only 50ms since second
    expect(mockCallback).not.toHaveBeenCalled();

    // Wait for full debounce from second call
    await vi.advanceTimersByTimeAsync(100);

    // Assert
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
