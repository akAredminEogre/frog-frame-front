/**
 * デバウンスタイマーのインターフェース
 * タイマー操作を抽象化し、application層からwindow.setTimeout/clearTimeoutへの直接依存を排除する
 */
export interface IDebounceTimer {
  /**
   * コールバックをスケジュールする
   * 既存のスケジュールがあれば自動的にキャンセルして新しいスケジュールを設定する
   * @param callback 実行するコールバック関数
   * @param delayMs 遅延時間（ミリ秒）
   */
  schedule(callback: () => void, delayMs: number): void;

  /**
   * 実行中かどうかを返す
   */
  isExecuting(): boolean;

  /**
   * ガード付きでスケジュールする
   * 実行中の場合はスケジュールをスキップする
   * @param callback 実行するコールバック関数
   * @param delayMs 遅延時間（ミリ秒）
   */
  scheduleWithGuard(callback: () => Promise<void>, delayMs: number): void;
}
