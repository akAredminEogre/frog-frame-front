import type { Page } from '@playwright/test';

/**
 * ポップアップからルールを保存する共有ヘルパー
 */
export async function saveRuleViaPopup(
  page: Page,
  popupPage: Page,
  options: {
    oldString: string;
    newString: string;
    urlPattern?: string;
    isRegex?: boolean;
  }
): Promise<void> {
  // テストページに移動してURL取得
  const fixtureUrl = 'http://localhost:8080/agile-manifesto.html';
  await page.goto(fixtureUrl);
  await page.bringToFront();

  // ポップアップをリロードして最新タブ情報取得
  await popupPage.reload();

  // URLパターンの自動入力確認
  const urlPatternInput = popupPage.locator('input[name="urlPattern"]');
  await urlPatternInput.waitFor({ state: 'visible', timeout: 60000 });

  // 置換設定入力
  const beforeInput = popupPage.locator('textarea[name="oldString"]');
  const afterInput = popupPage.locator('textarea[name="newString"]');

  await beforeInput.fill(options.oldString);
  await afterInput.fill(options.newString);

  if (options.isRegex) {
    const regexCheckbox = popupPage.getByLabel('正規表現を使う');
    await regexCheckbox.check();
  }

  // アラートダイアログ処理
  popupPage.on('dialog', async (dialog) => {
    await dialog.accept();
  });

  // 保存ボタンクリック
  const saveButton = popupPage.locator('button:has-text("保存")');
  await saveButton.waitFor({ state: 'visible', timeout: 120000 });
  await saveButton.click();

  // 保存完了待ち（アラート表示を待つ）
  await page.waitForTimeout(1000);
}
