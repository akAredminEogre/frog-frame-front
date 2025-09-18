import { test, expect } from './fixtures';

test('正規表現を使ったDOM置換機能のe2eテスト', async ({ page, popupPage }) => {
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

  // ページとポップアップページのコンソールメッセージを監視
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(msg.text());
    }
  });

  popupPage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(msg.text());
    }
  });
  
  // 9. Assert: コンソールエラーが発生していないことを確認
  expect(consoleMessages).toHaveLength(0);
});
