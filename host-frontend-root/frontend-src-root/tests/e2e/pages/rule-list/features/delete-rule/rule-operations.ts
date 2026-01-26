/**
 * ルールテーブル操作ヘルパー
 */
import type { Page } from '@playwright/test';
import { expect } from 'tests/e2e/fixtures';
import { DEFAULT_TIMEOUT } from 'tests/e2e/helpers';
import {
  DELETE_COMPLETE_TIMEOUT,
  ELEMENT_VISIBILITY_TIMEOUT,
} from 'tests/e2e/pages/rule-list/features/delete-rule/constants';

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
 * @param timeout - タイムアウト（ms）。デフォルトは DEFAULT_TIMEOUT
 */
export async function reloadAndWaitForEmptyState(
  rulesPage: Page,
  timeout: number = DEFAULT_TIMEOUT
): Promise<void> {
  await rulesPage.reload();
  const emptyState = rulesPage.locator('[data-testid="empty-state"]');
  await expect(emptyState).toBeVisible({ timeout });
}
