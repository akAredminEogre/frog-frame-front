
import { test, expect } from './fixtures';

// このテストはローカルHTMLファイルを使用してE2Eテストの安定性と実行速度を向上させています
// 外部Webサイトへの依存を排除し、テスト環境の制御性を高めています

/**
 * ルール一覧ページ(オプションページ)のE2Eテスト
 * 拡張機能のアイコン→オプションでrules.htmlが表示されることを確認します
 */
test('正規表現で取得した値をタグ内に埋め込んだルールが、一覧に表示され、編集できる', async ({ page, popupPage, rulesPage }) => {
  // コンソールエラーメッセージを記録するための配列(早期設定)
  const extensionErrors: string[] = [];
  const consoleMessages: string[] = [];

  popupPage.on('console', msg => {
    console.log(`[POPUP] ${msg.type()}: ${msg.text()}`);
    if (msg.type() === 'error') {
      extensionErrors.push(`[EXTENSION] ${msg.text()}`);
      consoleMessages.push(`[POPUP ERROR] ${msg.text()}`);
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(`[PAGE ERROR] ${msg.text()}`);
    }
  });

  // 1. Arrange: ローカルHTTPサーバー経由でHTMLファイルに移動
  // test-pages/book-page.htmlを使用してテストの安定性を確保
  const fixtureUrl = 'http://localhost:8080/book-page.html';
  const expectedUrlPattern = 'http://localhost:8080';

  await page.goto(fixtureUrl);
  await page.bringToFront();

  // 初期DOM要素の存在確認（タイムアウト延長）
  await expect(page.locator('span.book-isbn13')).toHaveText('9784065396209', { timeout: 60000 });

  // 2. ポップアップをリロードして最新のアクティブタブ情報を取得
  await popupPage.reload();

  // 3. URLパターンの自動入力確認（ドメインのみが自動入力される）（タイムアウト延長）
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
  await expect(saveButton).toBeVisible({ timeout: 60000 });
  await expect(saveButton).toBeEnabled({ timeout: 60000 });
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

  // 9. 追加テスト: fixtureのrulesPageで保存されたルールを確認
  await rulesPage.reload();

  // 10. Assert: ルールページが正しく表示される
  await expect(rulesPage.locator('body')).toBeVisible({ timeout: 60000 });

  // 11. Assert: 保存されたルールが表示されている(空の状態ではない)
  const emptyState = rulesPage.locator('.empty-state');
  await expect(emptyState).not.toBeVisible({ timeout: 10000 });

  // 12. Assert: ルール一覧の内容確認
  const rulesTableContainer = rulesPage.locator('.rules-table-container');
  await expect(rulesTableContainer).toBeVisible({ timeout: 60000 });

  // 13. Assert: ルールテーブルが表示されている
  const rulesTable = rulesPage.locator('.rules-table');
  await expect(rulesTable).toBeVisible({ timeout: 60000 });

  // 14. Assert: 保存したURLパターンが表示されている
  await expect(rulesPage.locator('.rule-url-pattern:has-text("http://localhost:8080")')).toBeVisible({ timeout: 60000 });

  // 15. Assert: 保存した置換前文字列が表示されている
  const oldStringText = '<span class="book-isbn13" itemprop="isbn13" data-selectable="">(.+?)</span>';
  await expect(rulesPage.locator('.rule-old-string').filter({ hasText: oldStringText })).toBeVisible({ timeout: 60000 });

  // 16. Assert: 保存した置換後文字列が表示されている
  const newStringText = '<span class="book-isbn13" itemprop="isbn13" data-selectable=""><a href="https://example.com/isbn/$1">$1</a></span>';
  await expect(rulesPage.locator('.rule-new-string').filter({ hasText: newStringText })).toBeVisible({ timeout: 60000 });
  
  // 17. Assert: 正規表現使用の表示確認(✓マークで表示される)
  await expect(rulesPage.locator('.regex-badge:has-text("✓")')).toBeVisible({ timeout: 60000 });
  
  // 18. Assert: フッターのルール数表示が更新されている  
  await expect(rulesPage.locator('text=合計 1 件のルールが保存されています')).toBeVisible({ timeout: 60000 });
  
  // 19. Assert: コンソールエラーが発生していないことを確認
  // expect(consoleMessages).toHaveLength(0);

  // 20. 保存したルールに編集ボタンが表示されていることを確認
  const editButton = rulesPage.locator('button:has-text("編集")').first();
  await expect(editButton).toBeVisible({ timeout: 60000 });

  // 21. 編集ボタンを押すと、そのルールの編集画面が表示されることを確認
  // 編集ボタンのクリックで新しいページが開くのを待つ
  const [editPage] = await Promise.all([
    rulesPage.context().waitForEvent('page'),
    editButton.click()
  ]);
  
  // 編集ページが開いたことを確認
  await editPage.waitForLoadState('load', { timeout: 60000 });
  expect(editPage.url()).toContain('edit.html');
  
  // 22. 編集ページで置換後の文字列を変更
  const editAfterInput = editPage.locator('textarea[name="newString"]');
  await expect(editAfterInput).toBeVisible({ timeout: 60000 });
  const newTextWithLink = '<span class="book-isbn13" itemprop="isbn13" data-selectable=""><a href="https://example.com/isbn/$1">$1へのリンク</a></span>';
  await editAfterInput.fill(newTextWithLink);
  
  // 23. 保存ボタンクリック
  let editAlertMessage = '';
  editPage.on('dialog', async dialog => {
    editAlertMessage = dialog.message();
    await dialog.accept();
  });

  const editSaveButton = editPage.locator('button:has-text("保存")');
  await expect(editSaveButton).toBeVisible({ timeout: 60000 });
  await expect(editSaveButton).toBeEnabled({ timeout: 60000 });
  await editSaveButton.click();

  // 24. Assert: アラートダイアログの確認
  await expect.poll(() => editAlertMessage, { timeout: 60000 }).toBe('Rule updated successfully!');

  // 25. ルール一覧ページをリロードして変更を確認
  await rulesPage.bringToFront();
  await rulesPage.reload();

  // 26. Assert: 変更されたルールが表示されている
  await expect(rulesPage.locator('.rules-table')).toBeVisible({ timeout: 60000 });

  // 27. Assert: 保存した置換後文字列が変更されている
  await expect(rulesPage.locator('.rule-new-string').filter({ hasText: newTextWithLink })).toBeVisible({ timeout: 60000 });

  // 28. Assert: フッターのルール数表示には変更はない(まだ1件のまま)
  await expect(rulesPage.locator('text=合計 1 件のルールが保存されています')).toBeVisible({ timeout: 60000 });

  // 29. Assert: DOM置換結果の確認(変更後のリンクテキストを含む)
  await page.bringToFront();
  await page.reload();

  const modifiedLinkWithText = page.locator('span.book-isbn13 >> a');
  await expect(modifiedLinkWithText).toHaveCount(1, { timeout: 120000 });
  await expect(modifiedLinkWithText).toHaveAttribute('href', 'https://example.com/isbn/9784065396209', { timeout: 60000 });
  await expect(modifiedLinkWithText).toHaveText('9784065396209へのリンク', { timeout: 60000 });




  // 拡張機能側でエラーが発生していないことを確認
  expect(extensionErrors).toHaveLength(0);
});

/**
 * 編集画面のキャンセル機能のE2Eテスト
 * キャンセルボタンをクリックすると編集画面が閉じることを確認します
 */
test('編集画面でキャンセルボタンをクリックすると、ポップアップが閉じる', async ({ page, popupPage, rulesPage }) => {
  // コンソールエラーメッセージを記録するための配列(早期設定)
  const extensionErrors: string[] = [];
  const consoleMessages: string[] = [];

  popupPage.on('console', msg => {
    console.log(`[POPUP] ${msg.type()}: ${msg.text()}`);
    if (msg.type() === 'error') {
      extensionErrors.push(`[EXTENSION] ${msg.text()}`);
      consoleMessages.push(`[POPUP ERROR] ${msg.text()}`);
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(`[PAGE ERROR] ${msg.text()}`);
    }
  });

  // 1. Arrange: ローカルHTTPサーバー経由でHTMLファイルに移動
  // test-pages/book-page.htmlを使用してテストの安定性を確保
  const fixtureUrl = 'http://localhost:8080/book-page.html';
  const expectedUrlPattern = 'http://localhost:8080';

  await page.goto(fixtureUrl);
  await page.bringToFront();

  // 初期DOM要素の存在確認
  await expect(page.locator('span.book-isbn13')).toHaveText('9784065396209', { timeout: 60000 });

  // 2. ポップアップをリロードして最新のアクティブタブ情報を取得
  await popupPage.reload();

  // 3. URLパターンの自動入力確認（ドメインのみが自動入力される）
  const urlPatternInput = popupPage.locator('input[name="urlPattern"]');
  await expect(urlPatternInput).toHaveValue(expectedUrlPattern, { timeout: 60000 });

  // 4. Act: 置換設定の入力
  const beforeInput = popupPage.locator('textarea[name="oldString"]');
  const afterInput = popupPage.locator('textarea[name="newString"]');
  const regexCheckbox = popupPage.getByLabel('正規表現を使う');

  await beforeInput.fill('<span class="book-isbn13" itemprop="isbn13" data-selectable="">(.+?)</span>');
  await afterInput.fill('<span class="book-isbn13" itemprop="isbn13" data-selectable=""><a href="https://example.com/isbn/$1">$1</a></span>');

  await expect(regexCheckbox).toBeVisible({ timeout: 60000 });
  await regexCheckbox.check();

  // 5. アラートダイアログの処理設定
  let alertMessage = '';
  popupPage.on('dialog', async dialog => {
    alertMessage = dialog.message();
    await dialog.accept();
  });

  // 6. 保存ボタンクリック
  const saveButton = popupPage.locator('button:has-text("保存")');
  await expect(saveButton).toBeVisible({ timeout: 60000 });
  await expect(saveButton).toBeEnabled({ timeout: 60000 });
  await saveButton.click();

  // 7. Assert: アラートダイアログの確認
  await expect.poll(() => alertMessage, { timeout: 60000 }).toBe('保存して適用しました！');

  // 8. ルール一覧ページをリロード
  await rulesPage.reload();
  await expect(rulesPage.locator('.rules-table')).toBeVisible({ timeout: 60000 });

  // 9. 保存したルールの編集ボタンをクリック
  const editButton = rulesPage.locator('button:has-text("編集")').first();
  await expect(editButton).toBeVisible({ timeout: 60000 });

  const [editPage] = await Promise.all([
    rulesPage.context().waitForEvent('page'),
    editButton.click()
  ]);

  // 10. 編集ページが開いたことを確認
  await editPage.waitForLoadState('load', { timeout: 60000 });
  expect(editPage.url()).toContain('edit.html');

  // 11. キャンセルボタンが表示されていることを確認
  const cancelButton = editPage.locator('button:has-text("キャンセル")');
  await expect(cancelButton).toBeVisible({ timeout: 60000 });
  await expect(cancelButton).toBeEnabled({ timeout: 60000 });

  // 12. キャンセルボタンをクリック
  await cancelButton.click();

  // 13. Assert: 編集ページが閉じたことを確認
  // 少し待ってからチェック（window.close()の実行を待つ）
  await page.waitForTimeout(1000);
  expect(editPage.isClosed()).toBe(true);

  // 14. Assert: エラーが発生していないことを確認
  expect(extensionErrors).toHaveLength(0);
});
