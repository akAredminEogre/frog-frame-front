import type { Page } from '@playwright/test';
import { expect } from 'tests/e2e/fixtures';

// =============================================================================
// 共通ヘルパーの再エクスポート
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

/** ページロード待機のタイムアウト（ms） */
export const PAGE_LOAD_TIMEOUT = 60000;

// =============================================================================
// 削除機能固有の定数
// =============================================================================

/** 確認ダイアログ表示待機のタイムアウト（ms） */
export const CONFIRM_DIALOG_TIMEOUT = 10000;

/** 削除完了待機のタイムアウト（ms） */
export const DELETE_COMPLETE_TIMEOUT = 10000;

/** 要素可視性待機のタイムアウト（ms）- toPass内での使用を想定 */
const ELEMENT_VISIBILITY_TIMEOUT = 5000;

// =============================================================================
// 削除操作ヘルパー
// =============================================================================

/**
 * ルール一覧の件数を取得する
 *
 * @param rulesPage - ルール一覧ページ
 * @returns ルールの件数
 */
export async function getRuleCount(rulesPage: Page): Promise<number> {
  const rows = rulesPage.locator('[data-testid="rules-table"] tbody tr');
  return await rows.count();
}

/**
 * 指定インデックスのルールの削除ボタンをクリックする
 *
 * @param rulesPage - ルール一覧ページ
 * @param ruleIndex - ルールのインデックス（0始まり）
 * @throws Error - 指定されたインデックスの削除ボタンが見つからない場合
 */
export async function clickDeleteButton(
  rulesPage: Page,
  ruleIndex: number
): Promise<void> {
  const deleteButtons = rulesPage.getByRole('button', { name: 'ルールを削除' });
  const count = await deleteButtons.count();

  if (ruleIndex < 0 || ruleIndex >= count) {
    throw new Error(`削除ボタンが見つかりません: index=${ruleIndex}, 存在する要素数=${count}`);
  }

  const deleteButton = deleteButtons.nth(ruleIndex);
  await expect(deleteButton).toBeVisible({ timeout: ELEMENT_VISIBILITY_TIMEOUT });
  await deleteButton.click();
}

/**
 * 確認ダイアログが表示されるまで待機する
 *
 * @param rulesPage - ルール一覧ページ
 * @param timeout - タイムアウト（ms）。デフォルトは CONFIRM_DIALOG_TIMEOUT
 */
export async function waitForConfirmDialog(
  rulesPage: Page,
  timeout: number = CONFIRM_DIALOG_TIMEOUT
): Promise<void> {
  const dialog = rulesPage.locator('[data-testid="confirm-dialog"]');
  await expect(dialog).toBeVisible({ timeout });
}

/**
 * 確認ダイアログが閉じるまで待機する
 *
 * @param rulesPage - ルール一覧ページ
 * @param timeout - タイムアウト（ms）。デフォルトは CONFIRM_DIALOG_TIMEOUT
 */
export async function waitForConfirmDialogClosed(
  rulesPage: Page,
  timeout: number = CONFIRM_DIALOG_TIMEOUT
): Promise<void> {
  const dialog = rulesPage.locator('[data-testid="confirm-dialog"]');
  await expect(dialog).not.toBeVisible({ timeout });
}

/**
 * 確認ダイアログの削除ボタンをクリックする
 *
 * @param rulesPage - ルール一覧ページ
 */
export async function clickConfirmDeleteButton(rulesPage: Page): Promise<void> {
  const confirmButton = rulesPage.locator('[data-testid="confirm-dialog-confirm-button"]');
  await expect(confirmButton).toBeVisible({ timeout: ELEMENT_VISIBILITY_TIMEOUT });
  await confirmButton.click();
}

/**
 * 確認ダイアログのキャンセルボタンをクリックする
 *
 * @param rulesPage - ルール一覧ページ
 */
export async function clickCancelButton(rulesPage: Page): Promise<void> {
  const cancelButton = rulesPage.locator('[data-testid="confirm-dialog-cancel-button"]');
  await expect(cancelButton).toBeVisible({ timeout: ELEMENT_VISIBILITY_TIMEOUT });
  await cancelButton.click();
}

/**
 * ルール件数が期待値になるまで待機する
 *
 * @param rulesPage - ルール一覧ページ
 * @param expectedCount - 期待するルール件数
 * @param timeout - タイムアウト（ms）。デフォルトは DELETE_COMPLETE_TIMEOUT
 */
export async function waitForRuleCount(
  rulesPage: Page,
  expectedCount: number,
  timeout: number = DELETE_COMPLETE_TIMEOUT
): Promise<void> {
  await expect(async () => {
    const count = await getRuleCount(rulesPage);
    expect(count).toBe(expectedCount);
  }).toPass({ timeout });
}

/**
 * 指定インデックスのルールのoldString値を取得する
 *
 * @param rulesPage - ルール一覧ページ
 * @param ruleIndex - ルールのインデックス（0始まり）
 * @returns ルールのoldString値
 */
export async function getRuleOldString(
  rulesPage: Page,
  ruleIndex: number
): Promise<string> {
  const rows = rulesPage.locator('[data-testid="rules-table"] tbody tr');
  const row = rows.nth(ruleIndex);
  const oldStringCell = row.locator('.rule-old-string');
  await expect(oldStringCell).toBeVisible({ timeout: ELEMENT_VISIBILITY_TIMEOUT });
  return await oldStringCell.textContent() || '';
}

/**
 * 特定のoldStringを持つルールが存在するか確認する
 *
 * @param rulesPage - ルール一覧ページ
 * @param oldString - 検索するoldString値
 * @returns ルールが存在すればtrue
 */
export async function hasRuleWithOldString(
  rulesPage: Page,
  oldString: string
): Promise<boolean> {
  const count = await getRuleCount(rulesPage);
  for (let i = 0; i < count; i++) {
    const ruleOldString = await getRuleOldString(rulesPage, i);
    if (ruleOldString === oldString) {
      return true;
    }
  }
  return false;
}

/**
 * 特定のoldStringを持つルールのインデックスを取得する
 *
 * @param rulesPage - ルール一覧ページ
 * @param oldString - 検索するoldString値
 * @returns ルールのインデックス、見つからない場合は-1
 */
export async function getRuleIndexByOldString(
  rulesPage: Page,
  oldString: string
): Promise<number> {
  const count = await getRuleCount(rulesPage);
  for (let i = 0; i < count; i++) {
    const ruleOldString = await getRuleOldString(rulesPage, i);
    if (ruleOldString === oldString) {
      return i;
    }
  }
  return -1;
}

/**
 * トースト通知が表示されているか確認する
 *
 * @param rulesPage - ルール一覧ページ
 * @returns トーストが表示されていればtrue
 */
export async function isToastVisible(rulesPage: Page): Promise<boolean> {
  const toast = rulesPage.locator('[role="alert"]');
  return await toast.isVisible();
}

/**
 * エラートースト通知が表示されるまで待機する
 *
 * @param rulesPage - ルール一覧ページ
 * @param timeout - タイムアウト（ms）
 */
export async function waitForErrorToast(
  rulesPage: Page,
  timeout: number = DELETE_COMPLETE_TIMEOUT
): Promise<void> {
  const toast = rulesPage.locator('[role="alert"][data-type="error"]');
  await expect(toast).toBeVisible({ timeout });
}

/**
 * ページをリロードして空状態メッセージが表示されるまで待機する
 *
 * ルールが0件の場合、rules-tableは表示されず空状態メッセージが表示される。
 * 削除後のリロードテストで使用する。
 *
 * @param rulesPage - ルール一覧ページ
 * @param timeout - タイムアウト（ms）。デフォルトは PAGE_LOAD_TIMEOUT
 */
export async function reloadAndWaitForEmptyState(
  rulesPage: Page,
  timeout: number = PAGE_LOAD_TIMEOUT
): Promise<void> {
  await rulesPage.reload();
  const emptyState = rulesPage.locator('[data-testid="empty-state"]');
  await expect(emptyState).toBeVisible({ timeout });
}
