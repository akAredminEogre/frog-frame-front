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
 * 行にスコープしてから削除ボタンを取得することで、
 * 将来同名ボタンが増えた場合の誤取得を防ぐ。
 *
 * @param rulesPage - ルール一覧ページ
 * @param ruleIndex - ルールのインデックス（0始まり）
 * @throws Error - 指定されたインデックスの行が見つからない場合
 */
export async function clickDeleteButton(
  rulesPage: Page,
  ruleIndex: number
): Promise<void> {
  const rows = rulesPage.locator('[data-testid="rules-table"] tbody tr');
  const count = await rows.count();

  if (ruleIndex < 0 || ruleIndex >= count) {
    throw new Error(`ルール行が見つかりません: index=${ruleIndex}, 存在する行数=${count}`);
  }

  const row = rows.nth(ruleIndex);
  const deleteButton = row.locator('[data-testid="delete-button"]');
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
 * ページのoverflow スタイルを取得する
 * 
 * usePreventScrollは環境によってhtmlまたはbodyにスタイルを適用するため、
 * 両方のoverflow値を取得して返す。
 * 
 * @param page - 対象ページ
 * @returns htmlとbodyのoverflow値
 */
export async function getOverflowStyles(page: Page): Promise<{ html: string; body: string }> {
  return await page.evaluate(() => {
    const htmlOverflow = window.getComputedStyle(document.documentElement).overflow;
    const bodyOverflow = window.getComputedStyle(document.body).overflow;
    return { html: htmlOverflow, body: bodyOverflow };
  });
}

/**
 * スクロール防止が適用されているかを確認する
 * 
 * htmlまたはbodyのいずれかにoverflow: hiddenが設定されていればtrueを返す。
 * 
 * @param overflowStyles - getOverflowStylesで取得したスタイル
 * @returns スクロール防止が適用されているか
 */
export function isScrollPrevented(overflowStyles: { html: string; body: string }): boolean {
  return overflowStyles.html === 'hidden' || overflowStyles.body === 'hidden';
}
