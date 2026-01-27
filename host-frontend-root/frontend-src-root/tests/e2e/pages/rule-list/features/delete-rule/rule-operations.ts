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
 * textContent()はReactのレンダリングで生じる改行・インデントを含む可能性があるため、
 * trim()で正規化して返す。
 *
 * @param rulesPage - ルール一覧ページ
 * @param ruleIndex - ルールのインデックス（0始まり）
 * @returns ルールのoldString値（前後の空白を除去済み）
 * @throws Error - 指定されたインデックスの行が見つからない場合
 */
export async function getRuleOldString(
  rulesPage: Page,
  ruleIndex: number
): Promise<string> {
  const rows = rulesPage.locator('[data-testid="rules-table"] tbody tr');
  const count = await rows.count();

  if (ruleIndex < 0 || ruleIndex >= count) {
    throw new Error(`ルール行が見つかりません: index=${ruleIndex}, 存在する行数=${count}`);
  }

  const row = rows.nth(ruleIndex);
  const oldStringCell = row.locator('[data-testid="rule-old-string"]');
  await expect(oldStringCell).toBeVisible({ timeout: ELEMENT_VISIBILITY_TIMEOUT });
  const text = await oldStringCell.textContent();
  return (text || '').trim();
}

/**
 * 特定のoldStringを持つルールが存在するか確認する
 *
 * getRuleIndexByOldStringに委譲し、探索ロジックの重複を避ける。
 *
 * @param rulesPage - ルール一覧ページ
 * @param oldString - 検索するoldString値
 * @returns ルールが存在すればtrue
 */
export async function hasRuleWithOldString(
  rulesPage: Page,
  oldString: string
): Promise<boolean> {
  const index = await getRuleIndexByOldString(rulesPage, oldString);
  return index >= 0;
}

/**
 * 特定のoldStringを持つルールのインデックスを取得する
 *
 * ループ内でgetRuleOldStringを呼ぶと毎回rows.count()が実行されるため、
 * rowsとcountを事前に取得してループ内のDOMアクセスを最小化している。
 *
 * @param rulesPage - ルール一覧ページ
 * @param oldString - 検索するoldString値
 * @returns ルールのインデックス、見つからない場合は-1
 */
export async function getRuleIndexByOldString(
  rulesPage: Page,
  oldString: string
): Promise<number> {
  const rows = rulesPage.locator('[data-testid="rules-table"] tbody tr');
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    const row = rows.nth(i);
    const oldStringCell = row.locator('[data-testid="rule-old-string"]');
    const text = await oldStringCell.textContent();
    const trimmed = (text || '').trim();
    if (trimmed === oldString) {
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
