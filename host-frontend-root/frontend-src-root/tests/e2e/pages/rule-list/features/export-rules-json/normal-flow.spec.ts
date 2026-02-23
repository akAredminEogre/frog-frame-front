import { expect, test } from 'tests/e2e/fixtures';
import { saveRuleViaPopup } from 'tests/e2e/pages/rule-list/features/export-rules-json/helpers';

test('エクスポートボタンクリック後にJSONファイルがダウンロードされ、内容が正しい', async ({
  page,
  popupPage,
  rulesPage,
}) => {
  // コンソールエラー監視
  const consoleErrors: string[] = [];
  rulesPage.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // 1. Arrange: ルールを1件保存
  await saveRuleViaPopup(page, popupPage, {
    oldString: 'テスト置換前',
    newString: 'テスト置換後',
  });

  // 2. ルール一覧ページをリロードして保存されたルールを確認
  await rulesPage.reload();
  await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: 60000 });

  // 3. エクスポートボタンが表示されクリック可能であることを確認
  const exportButton = rulesPage.locator('[data-testid="export-button"]');
  await expect(exportButton).toBeVisible({ timeout: 60000 });
  await expect(exportButton).toBeEnabled();

  // 4. Act: ダウンロードイベントを待機しながらエクスポートボタンをクリック
  const [download] = await Promise.all([
    rulesPage.waitForEvent('download', { timeout: 30000 }),
    exportButton.click(),
  ]);

  // 5. Assert: ファイル名が命名規則に従っている
  const fileName = download.suggestedFilename();
  expect(fileName).toMatch(/^frog-frame-front-rules-\d{8}_\d{6}\.json$/);

  // 6. Assert: ダウンロードしたファイルの内容を検証
  const filePath = await download.path();
  expect(filePath).toBeTruthy();

  const fs = await import('fs');
  const fileContent = fs.readFileSync(filePath!, 'utf-8');
  const exportedData = JSON.parse(fileContent);

  // 7. Assert: JSONフォーマット検証 - version, exportedAt, rulesが含まれる
  expect(exportedData).toHaveProperty('version', '1.0');
  expect(exportedData).toHaveProperty('exportedAt');
  expect(exportedData).toHaveProperty('rules');

  // 8. Assert: exportedAtがISO 8601形式であること
  expect(exportedData.exportedAt).toMatch(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/
  );

  // 9. Assert: rulesに保存済みルールが含まれる
  expect(exportedData.rules).toBeInstanceOf(Array);
  expect(exportedData.rules.length).toBeGreaterThanOrEqual(1);

  // 10. Assert: ルールデータにIDを含む全属性が含まれる
  const exportedRule = exportedData.rules.find(
    (r: { oldString: string }) => r.oldString === 'テスト置換前'
  );
  expect(exportedRule).toBeDefined();
  expect(exportedRule).toHaveProperty('id');
  expect(exportedRule).toHaveProperty('oldString', 'テスト置換前');
  expect(exportedRule).toHaveProperty('newString', 'テスト置換後');
  expect(exportedRule).toHaveProperty('urlPattern');
  expect(exportedRule).toHaveProperty('isRegex');
  expect(exportedRule).toHaveProperty('isActive');

  // 11. Assert: コンソールエラーが発生していないこと
  expect(consoleErrors).toHaveLength(0);
});
