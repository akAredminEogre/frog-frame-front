import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DebounceTimer } from 'src/infrastructure/browser/timer/DebounceTimer';

/**
 * DebounceTimer.schedule - 正常系テスト
 *
 * 1. 指定した遅延後にコールバックを実行する
 * 2. 連続した呼び出しでは前のタイマーをキャンセルする
 * 3. デバウンス動作を正しく実現する
 */
describe('DebounceTimer.schedule - 正常系', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should execute callback after specified delay', async () => {
    // Arrange
    const timer = new DebounceTimer();
    const mockCallback = vi.fn();

    // Act
    timer.schedule(mockCallback, 100);

    // Assert - callback should not be called immediately
    expect(mockCallback).not.toHaveBeenCalled();

    // Advance time past delay
    await vi.advanceTimersByTimeAsync(100);

    // Assert - callback should be called
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous timer when called again', async () => {
    // Arrange
    const timer = new DebounceTimer();
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();

    // Act - first schedule
    timer.schedule(mockCallback1, 100);
    await vi.advanceTimersByTimeAsync(50);

    // Second schedule should cancel the first
    timer.schedule(mockCallback2, 100);

    // Advance time - first callback's time has passed but it was cancelled
    await vi.advanceTimersByTimeAsync(60);
    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).not.toHaveBeenCalled();

    // Complete the second timer
    await vi.advanceTimersByTimeAsync(50);

    // Assert - only second callback should be called
    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalledTimes(1);
  });

  it('should debounce rapid calls correctly', async () => {
    // Arrange
    const timer = new DebounceTimer();
    const mockCallback = vi.fn();

    // Act - rapid calls
    timer.schedule(mockCallback, 100);
    await vi.advanceTimersByTimeAsync(30);
    timer.schedule(mockCallback, 100);
    await vi.advanceTimersByTimeAsync(30);
    timer.schedule(mockCallback, 100);

    // Complete the timer
    await vi.advanceTimersByTimeAsync(100);

    // Assert - callback should only be called once
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should allow scheduling after timer completes', async () => {
    // Arrange
    const timer = new DebounceTimer();
    const mockCallback = vi.fn();

    // Act - first schedule and complete
    timer.schedule(mockCallback, 100);
    await vi.advanceTimersByTimeAsync(100);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    // Schedule again
    mockCallback.mockClear();
    timer.schedule(mockCallback, 100);
    await vi.advanceTimersByTimeAsync(100);

    // Assert - callback should be called again
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
