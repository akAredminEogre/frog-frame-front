import { type Page } from '@playwright/test';

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

// =============================================================================
// トグル機能固有の定数
// =============================================================================

/** トグル状態変化待機のタイムアウト（ms） */
export const TOGGLE_STATE_TIMEOUT = 10000;

/** 要素可視性待機のタイムアウト（ms）- toPass内での使用を想定 */
const ELEMENT_VISIBILITY_TIMEOUT = 5000;

// =============================================================================
// トグル操作ヘルパー
// =============================================================================

/**
 * トグル状態が期待値になるまで待機する
 *
 * @param rulesPage - ルール一覧ページ
 * @param ruleIndex - ルールのインデックス
 * @param expectedState - 期待するトグル状態
 * @param timeout - タイムアウト（ms）。デフォルトは TOGGLE_STATE_TIMEOUT (10000ms)
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

/**
 * テストヘルパー: ToggleSwitchの状態を取得する
 *
 * @param rulesPage - ルール一覧ページ
 * @param ruleIndex - ルールのインデックス（0始まり）
 * @returns トグルの状態（true: 有効, false: 無効）
 * @throws Error - 指定されたインデックスのトグル要素が見つからない場合
 */
export async function getToggleState(
  rulesPage: Page,
  ruleIndex: number
): Promise<boolean> {
  const toggleElements = rulesPage.locator('[data-selected]');
  const count = await toggleElements.count();

  if (ruleIndex >= count) {
    throw new Error(`トグル要素が見つかりません: index=${ruleIndex}, 存在する要素数=${count}`);
  }

  const toggleDiv = toggleElements.nth(ruleIndex);
  // toPass内で呼ばれる場合を考慮し、短めのタイムアウトを使用
  await expect(toggleDiv).toBeVisible({ timeout: ELEMENT_VISIBILITY_TIMEOUT });

  const dataSelected = await toggleDiv.getAttribute('data-selected');
  if (dataSelected === null) {
    throw new Error(`data-selected属性が見つかりません: index=${ruleIndex}`);
  }

  return dataSelected === 'true';
}

/**
 * テストヘルパー: ToggleSwitchをクリックする
 *
 * トグルスイッチはlabel要素でラップされており、labelをクリックすることで
 * 内部のinputのchecked状態を切り替える。
 *
 * @param rulesPage - ルール一覧ページ
 * @param ruleIndex - ルールのインデックス（0始まり）
 * @throws Error - 指定されたインデックスのトグル要素が見つからない場合
 */
export async function clickToggle(
  rulesPage: Page,
  ruleIndex: number
): Promise<void> {
  // トグルスイッチを含むlabel要素を特定（data-selected属性を持つ要素を含むlabel）
  const toggleLabels = rulesPage.locator('label:has([data-selected])');
  const count = await toggleLabels.count();

  if (ruleIndex >= count) {
    throw new Error(`トグルラベル要素が見つかりません: index=${ruleIndex}, 存在する要素数=${count}`);
  }

  const toggleLabel = toggleLabels.nth(ruleIndex);
  await expect(toggleLabel).toBeVisible({ timeout: ELEMENT_VISIBILITY_TIMEOUT });
  await toggleLabel.click();
}
