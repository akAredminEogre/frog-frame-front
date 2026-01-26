/**
 * 削除機能E2Eテスト用ヘルパー
 *
 * 各モジュールからの再エクスポートを提供し、後方互換性を維持する。
 */

// =============================================================================
// 共通ヘルパーの再エクスポート（tests/e2e/helpers.tsから）
// =============================================================================

export {
  assertNoConsoleErrors,
  clearAllRules,
  DEFAULT_TIMEOUT,
  DIALOG_TIMEOUT,
  reloadAndWaitForTable,
  RULES_TABLE_TIMEOUT,
  saveRule,
  setupConsoleErrorMonitoring,
  TEST_SERVER_URL,
} from 'tests/e2e/helpers';

// =============================================================================
// 削除機能固有のモジュール再エクスポート
// =============================================================================

// 定数
export {
  CONFIRM_DIALOG_TIMEOUT,
  DELETE_COMPLETE_TIMEOUT,
} from 'tests/e2e/pages/rule-list/features/delete-rule/constants';

// ダイアログ操作
export {
  clickCancelButton,
  clickConfirmDeleteButton,
  clickDeleteButton,
  waitForConfirmDialog,
  waitForConfirmDialogClosed,
} from 'tests/e2e/pages/rule-list/features/delete-rule/dialog-operations';

// ルールテーブル操作
export {
  getRuleCount,
  getRuleIndexByOldString,
  getRuleOldString,
  hasRuleWithOldString,
  isToastVisible,
  reloadAndWaitForEmptyState,
  waitForErrorToast,
  waitForRuleCount,
} from 'tests/e2e/pages/rule-list/features/delete-rule/rule-operations';
