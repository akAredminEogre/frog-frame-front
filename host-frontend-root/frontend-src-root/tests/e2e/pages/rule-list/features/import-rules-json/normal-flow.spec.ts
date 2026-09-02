import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
  DEFAULT_TIMEOUT,
  reloadAndWaitForTable,
  setupConsoleErrorMonitoring,
} from 'tests/e2e/pages/rule-list/features/import-rules-json/helpers';

test('インポートボタンクリック後にJSONファイルを選択するとルールがインポートされる', async ({
  rulesPage,
  popupPage,
}) => {
  // コンソールエラー監視
  const consoleErrors = setupConsoleErrorMonitoring(popupPage, rulesPage);

  // 1. Arrange: 全ルールを削除してクリーンな状態にする
  await clearAllRules(rulesPage);
  await rulesPage.reload();

  // 2. Arrange: インポート用JSONデータを作成
  const importData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    rules: [
      {
        id: 1,
        oldString: 'インポートテスト前',
        newString: 'インポートテスト後',
        urlPattern: 'http://example.com',
        isRegex: false,
        isActive: true,
      },
    ],
  };
  const jsonContent = JSON.stringify(importData);

  // 3. Assert: インポートボタンがルール0件でも表示されている
  const importButton = rulesPage.locator('[data-testid="import-button"]');
  await expect(importButton).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  await expect(importButton).toBeEnabled();

  // 4. Act: 実ボタンをクリックし、発火する filechooser イベントを待ってファイルを渡す。
  //    hidden input へ直接 setInputFiles するとボタン → input の接続が壊れても通過してしまう
  //    （偽陰性）ため、ボタンクリックが filechooser を発火することまで検証する。
  const [fileChooser] = await Promise.all([
    rulesPage.waitForEvent('filechooser', { timeout: DEFAULT_TIMEOUT }),
    importButton.click(),
  ]);
  await fileChooser.setFiles({
    name: 'import-test.json',
    mimeType: 'application/json',
    buffer: Buffer.from(jsonContent, 'utf-8'),
  });

  // 5. Assert: 成功トースト通知が表示される
  const successToast = rulesPage.locator('[data-type="success"]');
  await expect(successToast).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  await expect(successToast).toContainText('インポートしました');

  // 6. Assert: ルール一覧にインポートされたルールが反映される（リロードして確認）
  await reloadAndWaitForTable(rulesPage);
  const rulesTable = rulesPage.locator('[data-testid="rules-table"]');
  await expect(rulesTable).toContainText('インポートテスト前');

  // 7. Assert: コンソールエラーが発生していないこと
  assertNoConsoleErrors(consoleErrors);
});
