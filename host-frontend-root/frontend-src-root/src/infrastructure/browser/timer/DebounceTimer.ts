import debounce from 'debounce';
import { injectable } from 'tsyringe';

import { IDebounceTimer } from 'src/application/ports/IDebounceTimer';

type DebouncedFunction = ReturnType<typeof debounce>;

const INITIAL_DEBOUNCE_DELAY_MS = 0;

/**
 * デバウンスタイマーの実装
 * npmパッケージ'debounce'を使用してタイマー状態を管理する
 */
@injectable()
export class DebounceTimer implements IDebounceTimer {
  private pendingCallback: () => void;
  private debouncedExecutor: DebouncedFunction;

  constructor() {
    this.pendingCallback = () => {};
    this.debouncedExecutor = debounce(() => this.pendingCallback(), INITIAL_DEBOUNCE_DELAY_MS);
  }

  schedule(callback: () => void, delayMs: number): void {
    this.debouncedExecutor.clear();
    this.pendingCallback = callback;
    this.debouncedExecutor = debounce(() => this.pendingCallback(), delayMs);
    this.debouncedExecutor();
  }
}
