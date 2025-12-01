import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DebounceTimer } from 'src/infrastructure/browser/timer/DebounceTimer';

/**
 * DebounceTimer.scheduleWithGuard - 正常系テスト
 *
 * 1. 指定した遅延後にコールバックを実行する
 * 2. 実行中に新しい呼び出しがあっても無視する（無限ループ防止）
 * 3. 実行完了後は新しい呼び出しを受け付ける
 * 4. コールバックがエラーを投げても正しくフラグをリセットする
 */
describe('DebounceTimer.scheduleWithGuard - 正常系', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should execute callback after specified delay', async () => {
    // Arrange
    const timer = new DebounceTimer();
    const mockCallback = vi.fn().mockResolvedValue(undefined);

    // Act
    timer.scheduleWithGuard(mockCallback, 100);

    // Assert - callback should not be called immediately
    expect(mockCallback).not.toHaveBeenCalled();

    // Advance time past delay
    await vi.advanceTimersByTimeAsync(100);

    // Assert - callback should be called
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should ignore calls during execution', async () => {
    // Arrange
    const timer = new DebounceTimer();
    let callCount = 0;
    const mockCallback = vi.fn().mockImplementation(async () => {
      callCount++;
      // Simulate calling scheduleWithGuard during execution
      if (callCount === 1) {
        timer.scheduleWithGuard(async () => {
          callCount++;
        }, 100);
      }
    });

    // Act
    timer.scheduleWithGuard(mockCallback, 100);
    await vi.advanceTimersByTimeAsync(100);
    // Wait for any additional scheduled work
    await vi.advanceTimersByTimeAsync(100);

    // Assert - only the first callback should have been executed
    expect(callCount).toBe(1);
  });

  it('should accept new calls after execution completes', async () => {
    // Arrange
    const timer = new DebounceTimer();
    const mockCallback = vi.fn().mockResolvedValue(undefined);

    // Act - first execution
    timer.scheduleWithGuard(mockCallback, 100);
    await vi.advanceTimersByTimeAsync(100);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Reset and schedule again
    mockCallback.mockClear();
    timer.scheduleWithGuard(mockCallback, 100);
    await vi.advanceTimersByTimeAsync(100);

    // Assert - second callback should be executed
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should reset executing flag even if callback throws', async () => {
    // Arrange
    const timer = new DebounceTimer();
    const errorCallback = vi.fn().mockRejectedValue(new Error('test error'));
    const successCallback = vi.fn().mockResolvedValue(undefined);

    // Act - first execution with error
    timer.scheduleWithGuard(errorCallback, 100);
    await vi.advanceTimersByTimeAsync(100);
    expect(errorCallback).toHaveBeenCalledTimes(1);

    // Schedule again after error
    timer.scheduleWithGuard(successCallback, 100);
    await vi.advanceTimersByTimeAsync(100);

    // Assert - second callback should be executed (flag was reset)
    expect(successCallback).toHaveBeenCalledTimes(1);
    expect(timer.isExecuting()).toBe(false);
  });

  it('should debounce rapid calls before execution starts', async () => {
    // Arrange
    const timer = new DebounceTimer();
    const mockCallback = vi.fn().mockResolvedValue(undefined);

    // Act - rapid calls
    timer.scheduleWithGuard(mockCallback, 100);
    await vi.advanceTimersByTimeAsync(30);
    timer.scheduleWithGuard(mockCallback, 100);
    await vi.advanceTimersByTimeAsync(30);
    timer.scheduleWithGuard(mockCallback, 100);

    // Complete the timer
    await vi.advanceTimersByTimeAsync(100);

    // Assert - callback should only be called once (last scheduled)
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
