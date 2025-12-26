import { type Page } from '@playwright/test';

import { expect } from 'tests/e2e/fixtures';

// =============================================================================
// 定数
// =============================================================================

/** テストサーバーのベースURL */
export const TEST_SERVER_URL = process.env.TEST_SERVER_URL || 'http://localhost:8080';

/** ルールテーブル表示待機のタイムアウト（ms） */
export const RULES_TABLE_TIMEOUT = 60000;

/** トグル状態変化待機のタイムアウト（ms） */
export const TOGGLE_STATE_TIMEOUT = 10000;

/** ダイアログ待機のタイムアウト（ms） */
export const DIALOG_TIMEOUT = 60000;

// =============================================================================
// コンソールエラー監視
// =============================================================================

/**
 * コンソールエラー監視をセットアップする
 *
 * @param popupPage - ポップアップページ
 * @param rulesPage - ルール一覧ページ
 * @returns コンソールエラーメッセージを格納する配列
 */
export function setupConsoleErrorMonitoring(popupPage: Page, rulesPage: Page): string[] {
  const consoleMessages: string[] = [];

  popupPage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(`[popup] ${msg.text()}`);
    }
  });
  rulesPage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(`[rules] ${msg.text()}`);
    }
  });

  return consoleMessages;
}

/**
 * コンソールエラーが発生していないことを確認する
 *
 * @param consoleMessages - コンソールエラーメッセージの配列
 */
export function assertNoConsoleErrors(consoleMessages: string[]): void {
  expect(consoleMessages).toHaveLength(0);
}

// =============================================================================
// ページ操作ヘルパー
// =============================================================================

/**
 * ルール一覧ページをリロードしてテーブル表示を待機する
 *
 * @param rulesPage - ルール一覧ページ
 */
export async function reloadAndWaitForTable(rulesPage: Page): Promise<void> {
  await rulesPage.reload();
  await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: RULES_TABLE_TIMEOUT });
}

/**
 * トグル状態が期待値になるまで待機する
 *
 * @param rulesPage - ルール一覧ページ
 * @param ruleIndex - ルールのインデックス
 * @param expectedState - 期待するトグル状態
 * @param timeout - タイムアウト（ms）
 */
export async function waitForToggleState(
  rulesPage: Page,
  ruleIndex: number,
  expectedState: boolean,
  timeout: number = TOGGLE_STATE_TIMEOUT
): Promise<void> {
  await expect(async () => {
    const state = await getToggleState(rulesPage, ruleIndex);
    expect(state).toBe(expectedState);
  }).toPass({ timeout });
}

// =============================================================================
// ルール保存ヘルパー
// =============================================================================

/**
 * テストヘルパー: ルールをポップアップから保存する
 */
export async function saveRule(
  popupPage: Page,
  page: Page,
  options: {
    oldString: string;
    newString: string;
    urlPattern?: string;
  }
): Promise<void> {
  // ローカルHTTPサーバー経由でHTMLファイルに移動
  const fixtureUrl = `${TEST_SERVER_URL}/agile-manifesto.html`;
  await page.goto(fixtureUrl);
  await page.bringToFront();

  // ポップアップをリロードして最新のアクティブタブ情報を取得
  await popupPage.reload();

  // URLパターンの自動入力を待機
  const urlPatternInput = popupPage.locator('input[name="urlPattern"]');
  await expect(urlPatternInput).toHaveValue(TEST_SERVER_URL, { timeout: RULES_TABLE_TIMEOUT });

  // 置換設定の入力
  const beforeInput = popupPage.locator('textarea[name="oldString"]');
  const afterInput = popupPage.locator('textarea[name="newString"]');

  await beforeInput.fill(options.oldString);
  await afterInput.fill(options.newString);

  // 保存ボタンクリック
  const saveButton = popupPage.locator('button:has-text("保存")');
  await expect(saveButton).toBeVisible({ timeout: RULES_TABLE_TIMEOUT });
  await expect(saveButton).toBeEnabled({ timeout: RULES_TABLE_TIMEOUT });

  // ダイアログ待機と保存ボタンクリックを同時に実行
  const [dialog] = await Promise.all([
    popupPage.waitForEvent('dialog', { timeout: DIALOG_TIMEOUT }),
    saveButton.click(),
  ]);

  // ダイアログメッセージを確認して承諾
  expect(dialog.message()).toBe('保存して適用しました！');
  await dialog.accept();
}

// =============================================================================
// トグル操作ヘルパー
// =============================================================================

/**
 * テストヘルパー: ToggleSwitchの状態を取得する
 */
export async function getToggleState(
  rulesPage: Page,
  ruleIndex: number
): Promise<boolean> {
  const toggleDiv = rulesPage.locator('[data-selected]').nth(ruleIndex);
  const dataSelected = await toggleDiv.getAttribute('data-selected');
  return dataSelected === 'true';
}

/**
 * テストヘルパー: ToggleSwitchをクリックする
 *
 * トグルスイッチはlabel要素でラップされており、labelをクリックすることで
 * 内部のinputのchecked状態を切り替える。
 */
export async function clickToggle(
  rulesPage: Page,
  ruleIndex: number
): Promise<void> {
  // トグルスイッチを含むlabel要素を特定
  const toggleDataSelected = rulesPage.locator('[data-selected]');
  const toggleLabel = rulesPage.locator('label').filter({ has: toggleDataSelected }).nth(ruleIndex);
  await toggleLabel.click();
}
