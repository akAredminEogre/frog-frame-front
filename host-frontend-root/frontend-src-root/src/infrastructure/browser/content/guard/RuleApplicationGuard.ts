import { IRuleApplicationGuard } from 'src/application/ports/IRuleApplicationGuard';

/**
 * ルール適用の重複防止ガード
 *
 * applyAllRules（ページロード時）とMutationObserver（DOM更新時）の
 * 両方からルール適用が重複して行われることを防止する
 *
 * シングルトンパターンで実装し、Content Script内で共有される
 */
class RuleApplicationGuardSingleton implements IRuleApplicationGuard {
  private isApplying: boolean = false;
  private pendingClear: boolean = false;

  /**
   * ルール適用中かどうかを確認
   */
  isApplicationInProgress(): boolean {
    return this.isApplying;
  }

  /**
   * ルール適用開始をマーク
   * 他の適用処理をブロックする
   */
  startApplication(): void {
    this.isApplying = true;
  }

  /**
   * ルール適用完了をマーク
   * 他の適用処理のブロックを解除する
   */
  endApplication(): void {
    this.isApplying = false;
  }

  /**
   * MutationObserverの蓄積をクリアすべきかを示すフラグを設定
   * applyAllRulesが実行される前にセットし、MutationObserverに蓄積クリアを要求
   */
  requestClearPending(): void {
    this.pendingClear = true;
  }

  /**
   * 蓄積クリアが要求されているか確認し、フラグをリセット
   */
  shouldClearPending(): boolean {
    if (this.pendingClear) {
      this.pendingClear = false;
      return true;
    }
    return false;
  }
}

// シングルトンインスタンスをエクスポート
export const RuleApplicationGuard = new RuleApplicationGuardSingleton();
