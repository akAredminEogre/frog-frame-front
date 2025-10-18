import { test, expect } from './fixtures';

// このテストはローカルHTMLファイルを使用してE2Eテストの安定性と実行速度を向上させています
// 外部Webサイトへの依存を排除し、テスト環境の制御性を高めています
test('正規表現で取得した値をタグ内に埋め込み', async ({ page, popupPage }) => {
  // コンソールエラーメッセージを記録するための配列（早期設定）
  const extensionErrors: string[] = [];

  popupPage.on('console', msg => {
    console.log(`[POPUP] ${msg.type()}: ${msg.text()}`);
    if (msg.type() === 'error') {
      extensionErrors.push(`[EXTENSION] ${msg.text()}`);
    }
  });

  // 1. Arrange: ローカルHTTPサーバー経由でHTMLファイルに移動
  // fixtures/book-page.htmlを使用してテストの安定性を確保
  const fixtureUrl = 'http://localhost:8080/book-page.html';
  const expectedUrlPattern = 'http://localhost:8080';
  
  await page.goto(fixtureUrl);
  await page.bringToFront();
  
  // 初期DOM要素の存在確認（タイムアウト延長）
  await expect(page.locator('span.book-isbn13')).toHaveText('9784065396209', { timeout: 60000 });
  
  // 2. ポップアップをリロードして最新のアクティブタブ情報を取得
  await popupPage.reload();
  
  // 3. URLパターンの自動入力を確認（ドメインのみが自動入力される）
  const urlPatternInput = popupPage.locator('input[name="urlPattern"]');
  await expect(urlPatternInput).toHaveValue(expectedUrlPattern, { timeout: 60000 });
  
  // 4. Act: 置換設定の入力
  const beforeInput = popupPage.locator('textarea[name="oldString"]');
  const afterInput = popupPage.locator('textarea[name="newString"]');
  const regexCheckbox = popupPage.getByLabel('正規表現を使う');
  
  // HTMLファイルの要素構造に合わせて正規表現パターンを設定
  await beforeInput.fill('<span class="book-isbn13" itemprop="isbn13" data-selectable="">(.+?)</span>');
  await afterInput.fill('<span class="book-isbn13" itemprop="isbn13" data-selectable=""><a href="https://example.com/isbn/$1">$1</a></span>');
  
  // チェックボックスの状態を確認してからクリック（タイムアウト延長）
  await expect(regexCheckbox).toBeVisible({ timeout: 60000 });
  await regexCheckbox.check();
  
  // 5. アラートダイアログの処理設定
  let alertMessage = '';
  popupPage.on('dialog', async dialog => {
    alertMessage = dialog.message();
    await dialog.accept();
  });
  
  // 6. 保存ボタンクリック（タイムアウト延長）
  const saveButton = popupPage.locator('button:has-text("保存")');
  await expect(saveButton).toBeVisible({ timeout: 120000 });
  await expect(saveButton).toBeEnabled({ timeout: 120000 });
  await saveButton.click();
  
  // 7. Assert: アラートダイアログの確認（タイムアウト延長）
  await expect.poll(() => alertMessage, { timeout: 60000 }).toBe('保存して適用しました！');
  
  // 8. Assert: DOM置換結果の確認（タイムアウト延長）
  // デバウンス機能により単一のaタグのみが生成されることを確認
  const modifiedLink = page.locator('span.book-isbn13 >> a');
  await expect(modifiedLink).toHaveCount(1, { timeout: 60000 }); // 単一要素であることを確認
  await expect(modifiedLink).toHaveAttribute('href', 'https://example.com/isbn/9784065396209', { timeout: 60000 });
  await expect(modifiedLink).toHaveText('9784065396209', { timeout: 60000 });
  
  // 9. Assert: エラーを出所別にチェック
  
  // 拡張機能側でエラーが発生していないことを確認
  expect(extensionErrors).toHaveLength(0);
});
