import { type Page } from '@playwright/test';

import { expect } from 'tests/e2e/fixtures';

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
  const fixtureUrl = 'http://localhost:8080/agile-manifesto.html';
  await page.goto(fixtureUrl);
  await page.bringToFront();

  // ポップアップをリロードして最新のアクティブタブ情報を取得
  await popupPage.reload();

  // URLパターンの自動入力を待機
  const urlPatternInput = popupPage.locator('input[name="urlPattern"]');
  await expect(urlPatternInput).toHaveValue('http://localhost:8080', { timeout: 60000 });

  // 置換設定の入力
  const beforeInput = popupPage.locator('textarea[name="oldString"]');
  const afterInput = popupPage.locator('textarea[name="newString"]');

  await beforeInput.fill(options.oldString);
  await afterInput.fill(options.newString);

  // 保存ボタンクリック
  const saveButton = popupPage.locator('button:has-text("保存")');
  await expect(saveButton).toBeVisible({ timeout: 60000 });
  await expect(saveButton).toBeEnabled({ timeout: 60000 });

  // ダイアログ待機と保存ボタンクリックを同時に実行
  const [dialog] = await Promise.all([
    popupPage.waitForEvent('dialog', { timeout: 60000 }),
    saveButton.click(),
  ]);

  // ダイアログメッセージを確認して承諾
  expect(dialog.message()).toBe('保存して適用しました！');
  await dialog.accept();
}

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
 */
export async function clickToggle(
  rulesPage: Page,
  ruleIndex: number
): Promise<void> {
  const toggleLabel = rulesPage.locator('label').filter({ has: rulesPage.locator('[data-selected]') }).nth(ruleIndex);
  await toggleLabel.click();
}
