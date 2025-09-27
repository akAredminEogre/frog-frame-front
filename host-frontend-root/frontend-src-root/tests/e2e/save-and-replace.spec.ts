import { test, expect } from './fixtures';

test('正規表現を使ったDOM置換機能のe2eテスト', async ({ page, popupPage, rulesPage }) => {
  // 1. Arrange: テスト対象ページに移動
  await page.goto('https://agilemanifesto.org/iso/ja/manifesto.html');
  await page.bringToFront();
  
  // 初期DOM要素の存在確認
  await expect(page.locator('h1')).toHaveText('アジャイルソフトウェア開発宣言');
  
  // 2. ポップアップをリロードして最新のアクティブタブ情報を取得
  await popupPage.reload();
  
  // 3. URLパターンの自動入力確認（既存機能のテスト）
  const urlPatternInput = popupPage.locator('input[name="urlPattern"]');
  await expect(urlPatternInput).toHaveValue('https://agilemanifesto.org', { timeout: 10000 });
  
  // 4. Act: 置換設定の入力
  const beforeInput = popupPage.locator('textarea[name="oldString"]');
  const afterInput = popupPage.locator('textarea[name="newString"]');
  const regexCheckbox = popupPage.getByLabel('正規表現を使う');
  
  await beforeInput.fill('<h1>(.+?)</h1>');
  await afterInput.fill('<h2>$1</h2>');
  await regexCheckbox.check();
  
  // 5. アラートダイアログの処理設定
  let alertMessage = '';
  popupPage.on('dialog', async dialog => {
    alertMessage = dialog.message();
    await dialog.accept();
  });
  
  // 6. 保存ボタンクリック
  const saveButton = popupPage.locator('button:has-text("保存")');
  await saveButton.click();
  
  // 7. Assert: アラートダイアログの確認
  await expect.poll(() => alertMessage).toBe('保存して適用しました！');
  
  // 8. Assert: DOM置換結果の確認
  await expect(page.locator('h2')).toHaveText('アジャイルソフトウェア開発宣言', { timeout: 10000 });
  await expect(page.locator('h1')).toHaveCount(0);

  // コンソールエラーメッセージを記録するための配列
  const consoleMessages: string[] = [];

  // ポップアップページのコンソールメッセージを監視

  popupPage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(msg.text());
    }
  });
  
  // 9. 追加テスト: fixtureのrulesPageで保存されたルールを確認
  await rulesPage.reload();
  
  // 10. Assert: ルールページが正しく表示される
  await expect(rulesPage.locator('body')).toBeVisible();
  
  // 11. Assert: 保存されたルールが表示されている（空の状態ではない）
  const emptyState = rulesPage.locator('.empty-state');
  await expect(emptyState).not.toBeVisible();
  
  // 12. Assert: ルール一覧の内容確認
  const rulesTableContainer = rulesPage.locator('.rules-table-container');
  await expect(rulesTableContainer).toBeVisible();
  
  // 13. Assert: ルールテーブルが表示されている
  const rulesTable = rulesPage.locator('.rules-table');
  await expect(rulesTable).toBeVisible();
  
  // 14. Assert: 保存したURLパターンが表示されている
  await expect(rulesPage.locator('.rule-url-pattern:has-text("https://agilemanifesto.org")')).toBeVisible();
  
  // 15. Assert: 保存した置換前文字列が表示されている
  await expect(rulesPage.locator('.rule-old-string:has-text("<h1>(.+?)</h1>")')).toBeVisible();
  
  // 16. Assert: 保存した置換後文字列が表示されている
  await expect(rulesPage.locator('.rule-new-string:has-text("<h2>$1</h2>")')).toBeVisible();
  
  // 17. Assert: 正規表現使用の表示確認（✓マークで表示される）
  await expect(rulesPage.locator('.regex-badge:has-text("✓")')).toBeVisible();
  
  // 18. Assert: フッターのルール数表示が更新されている  
  await expect(rulesPage.locator('text=合計 1 件のルールが保存されています')).toBeVisible();
  
  // 19. Assert: コンソールエラーが発生していないことを確認
  expect(consoleMessages).toHaveLength(0);
  
  console.log('保存後のrules一覧表示確認も完了: 保存されたルールが正しく反映されています');
});
