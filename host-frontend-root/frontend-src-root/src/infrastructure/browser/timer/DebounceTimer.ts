import { injectable } from 'tsyringe';

import { IDebounceTimer } from 'src/application/ports/IDebounceTimer';

/**
 * デバウンスタイマーの実装
 * window.setTimeout/clearTimeoutをラップし、タイマー状態を内部で管理する
 */
@injectable()
export class DebounceTimer implements IDebounceTimer {
  private timerId: number | undefined;

  schedule(callback: () => void, delayMs: number): void {
    this.cancelExistingTimer();
    this.timerId = window.setTimeout(() => {
      this.timerId = undefined;
      callback();
    }, delayMs);
  }

  private cancelExistingTimer(): void {
    if (this.timerId === undefined) {
      return;
    }
    window.clearTimeout(this.timerId);
    this.timerId = undefined;
  }
}
