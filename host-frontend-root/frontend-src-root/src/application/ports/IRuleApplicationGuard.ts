/**
 * ルール適用の重複防止ガードのインターフェース
 *
 * applyAllRules（ページロード時）とMutationObserver（DOM更新時）の
 * 両方からルール適用が重複して行われることを防止する
 */
export interface IRuleApplicationGuard {
  /**
   * ルール適用中かどうかを確認
   */
  isApplicationInProgress(): boolean;

  /**
   * 蓄積クリアが要求されているか確認し、フラグをリセット
   */
  shouldClearPending(): boolean;
}
