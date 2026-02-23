import { expect, test } from 'tests/e2e/fixtures';
import {
  assertNoConsoleErrors,
  clearAllRules,
  DEFAULT_TIMEOUT,
  reloadAndWaitForTable,
  setupConsoleErrorMonitoring,
} from 'tests/e2e/pages/rule-list/features/import-rules-json/helpers';

test('インポートボタンクリック後にJSONファイルを選択すると確認ダイアログが表示され、インポート実行後にルールが反映される', async ({
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
    exportedAt: '2026-02-24T10:00:00+09:00',
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

  // 4. Act: hidden file inputに直接JSONファイルをセット（ファイル選択ダイアログをバイパス）
  const fileInput = rulesPage.locator('[data-testid="import-file-input"]');
  await fileInput.setInputFiles({
    name: 'import-test.json',
    mimeType: 'application/json',
    buffer: Buffer.from(jsonContent, 'utf-8'),
  });

  // 5. Assert: プレビュー確認ダイアログが表示される
  const previewDialog = rulesPage.locator('[data-testid="import-preview-dialog"]');
  await expect(previewDialog).toBeVisible({ timeout: DEFAULT_TIMEOUT });

  // 6. Assert: プレビューダイアログに件数情報が表示される（0件 → 1件）
  await expect(previewDialog).toContainText('0件');
  await expect(previewDialog).toContainText('1件');

  // 7. Act: 「インポート実行」ボタンをクリック
  const confirmButton = rulesPage.locator('[data-testid="import-confirm-button"]');
  await expect(confirmButton).toBeEnabled({ timeout: DEFAULT_TIMEOUT });
  await confirmButton.click();

  // 8. Assert: 成功トースト通知が表示される
  const successToast = rulesPage.locator('[data-type="success"]');
  await expect(successToast).toBeVisible({ timeout: DEFAULT_TIMEOUT });
  await expect(successToast).toContainText('インポートしました');

  // 9. Assert: ルール一覧にインポートされたルールが反映される（リロードして確認）
  await reloadAndWaitForTable(rulesPage);
  const rulesTable = rulesPage.locator('[data-testid="rules-table"]');
  await expect(rulesTable).toContainText('インポートテスト前');

  // 10. Assert: コンソールエラーが発生していないこと
  assertNoConsoleErrors(consoleErrors);
});
