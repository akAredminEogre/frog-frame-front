import { test, expect } from './fixtures';

test('改行コードを無視した文字列置換機能のe2eテスト', async ({ page, popupPage }) => {
  // 1. Arrange: テスト対象ページに移動
  await page.goto('https://agilemanifesto.org/iso/ja/manifesto.html');
  await page.bringToFront();
  
  // 初期DOM要素の存在確認
  await expect(page.locator('h1')).toHaveText('アジャイルソフトウェア開発宣言');
  
  // 実際のDOM構造確認（改行を含む）
  const h1Html = await page.locator('h1').innerHTML();
  expect(h1Html).toContain('\n'); // 改行が含まれることを確認
  
  // 2. ポップアップをリロードして最新のアクティブタブ情報を取得
  await popupPage.reload();
  
  // 3. URLパターンの自動入力確認
  const urlPatternInput = popupPage.locator('input[name="urlPattern"]');
  await expect(urlPatternInput).toHaveValue('https://agilemanifesto.org', { timeout: 10000 });
  
  // 4. Act: 置換設定の入力（正規表現なし）
  const beforeInput = popupPage.locator('textarea[name="oldString"]');
  const afterInput = popupPage.locator('textarea[name="newString"]');
  const regexCheckbox = popupPage.getByLabel('正規表現を使う');
  
  // 改行を含まない文字列で置換設定
  await beforeInput.fill('<h1>アジャイルソフトウェア開発宣言</h1>');
  await afterInput.fill('<h2>アジャイルソフトウェア開発宣言</h2>');
  // 正規表現チェックボックスは空のまま（デフォルト：unchecked）
  await expect(regexCheckbox).not.toBeChecked();
  
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
  
  // 8. Assert: DOM置換結果の確認（改行コードを無視して置換されている）
  await expect(page.locator('h2')).toHaveText('アジャイルソフトウェア開発宣言', { timeout: 10000 });
  await expect(page.locator('h1')).toHaveCount(0);
});
