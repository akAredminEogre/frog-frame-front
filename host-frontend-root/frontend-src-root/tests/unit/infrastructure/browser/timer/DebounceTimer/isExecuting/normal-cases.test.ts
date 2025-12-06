import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { DebounceTimer } from 'src/infrastructure/browser/timer/DebounceTimer';

/**
 * DebounceTimer.isExecuting - 正常系テスト
 *
 * 1. 初期状態ではfalseを返す
 * 2. scheduleWithGuardの実行中はtrueを返す
 * 3. 実行完了後はfalseに戻る
 */
describe('DebounceTimer.isExecuting - 正常系', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return false initially', () => {
    // Arrange
    const timer = new DebounceTimer();

    // Act
    const result = timer.isExecuting();

    // Assert
    expect(result).toBe(false);
  });

  it('should return true during execution', async () => {
    // Arrange
    const timer = new DebounceTimer();
    let isExecutingDuringCallback = false;

    // Act
    timer.scheduleWithGuard(async () => {
      isExecutingDuringCallback = timer.isExecuting();
    }, 100);
    await vi.advanceTimersByTimeAsync(100);

    // Assert
    expect(isExecutingDuringCallback).toBe(true);
  });

  it('should return false after execution completes', async () => {
    // Arrange
    const timer = new DebounceTimer();
    timer.scheduleWithGuard(async () => {}, 100);
    await vi.advanceTimersByTimeAsync(100);

    // Act
    const result = timer.isExecuting();

    // Assert
    expect(result).toBe(false);
  });
});
