/**
 * 確認ダイアログ操作ヘルパー
 */
import type { Page } from '@playwright/test';
import { expect } from 'tests/e2e/fixtures';
import {
  CONFIRM_DIALOG_TIMEOUT,
  ELEMENT_VISIBILITY_TIMEOUT,
} from 'tests/e2e/pages/rule-list/features/delete-rule/constants';

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
  const deleteButtons = rulesPage.getByRole('button', { name: 'ルールを削除', exact: true });
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
