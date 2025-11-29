import debounce from 'debounce';

import { IDebounceTimer } from 'src/application/ports/IDebounceTimer';

type DebouncedFunction = ReturnType<typeof debounce>;

const INITIAL_DEBOUNCE_DELAY_MS = 0;

/**
 * デバウンスタイマーの実装
 * npmパッケージ'debounce'を使用してタイマー状態を管理する
 *
 * Note: @injectable()デコレーターは使用しない
 * Content Scriptではtsyringeのデコレーターメタデータが正しく動作しないため
 * 手動DI解決で使用する
 */
export class DebounceTimer implements IDebounceTimer {
  private pendingCallback: () => void;
  private debouncedExecutor: DebouncedFunction;
  private executing: boolean;

  constructor() {
    this.pendingCallback = () => {};
    this.debouncedExecutor = debounce(() => this.pendingCallback(), INITIAL_DEBOUNCE_DELAY_MS);
    this.executing = false;
  }

  schedule(callback: () => void, delayMs: number): void {
    this.debouncedExecutor.clear();
    this.pendingCallback = callback;
    this.debouncedExecutor = debounce(() => this.pendingCallback(), delayMs);
    this.debouncedExecutor();
  }

  isExecuting(): boolean {
    return this.executing;
  }

  scheduleWithGuard(callback: () => Promise<void>, delayMs: number): void {
    if (this.executing) {
      return;
    }

    this.schedule(async () => {
      this.executing = true;
      try {
        await callback();
      } catch (error) {
        console.error('[DebounceTimer] Error in guarded callback:', error);
      } finally {
        this.executing = false;
      }
    }, delayMs);
  }
}
