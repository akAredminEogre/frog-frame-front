const DEBOUNCE_DELAY_MS = 100;

/**
 * ルール適用のスケジューリングを行うユースケース
 * デバウンス処理により、短時間に発生した複数のDOM変更をまとめて処理する
 */
export class ScheduleRuleApplicationUseCase {
  private debounceTimer: number | null;
  private applyRulesCallback: () => Promise<void>;

  constructor(applyRulesCallback: () => Promise<void>) {
    this.debounceTimer = null;
    this.applyRulesCallback = applyRulesCallback;
  }

  /**
   * ルール適用をスケジュールする
   * 既存のタイマーがあればキャンセルし、新しいタイマーを設定する
   */
  exec(): void {
    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = window.setTimeout(() => {
      this.debounceTimer = null;
      this.applyRulesCallback();
    }, DEBOUNCE_DELAY_MS);
  }
}
