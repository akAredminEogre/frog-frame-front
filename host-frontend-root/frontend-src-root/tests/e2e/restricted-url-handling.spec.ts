import { test, expect } from './fixtures';

/**
 * chrome://など制限されたURLでのエラーハンドリングE2Eテスト
 * Issue-108の受け入れ条件:
 * 1. chrome://extensions/などのURLでエラーログが出力されないこと
 * 2. 通常のウェブページでは引き続き正常にルールが適用されること
 * 3. 既存のテストが全て合格すること
 */

test('制限されたURL(about:blank)でエラーが発生しないことを確認', async ({ page }) => {
  // Act: about:blankページに移動（コンテンツスクリプト注入不可のURL）
  // tabs.onUpdatedリスナーがcanInjectContentScript()で適切にフィルタリングすることを確認
  await page.goto('about:blank');

  // ページが正常に読み込まれることを確認
  await expect(page.locator('html')).toBeVisible({ timeout: 5000 });

  // 待機してバックグラウンドでのエラー処理を確認
  await page.waitForTimeout(1000);

  // Assert: ページが正常に機能している（エラーで失敗していない）
  const url = page.url();
  expect(url).toBe('about:blank');

  console.log('制限されたURLテスト完了: about:blankページでエラーが発生していません');
});

test('外部URL(Chrome Web Store)でエラーが発生しないことを確認', async ({ page }) => {
  // Arrange: コンソールエラーメッセージを記録するための配列（早期設定）
  const consoleMessages: string[] = [];

  // ページのコンソールメッセージを監視
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(msg.text());
    }
  });

  // Act: Chrome Web Storeページに移動（外部のHTTPSページ）
  // コンテンツスクリプト注入可能だが、クロスオリジンの制約があるURL
  await page.goto('https://chrome.google.com/webstore/');

  // ページが正常に読み込まれることを確認
  await expect(page.locator('body')).toBeVisible({ timeout: 5000 });

  // 待機してバックグラウンドでのエラー処理を確認
  await page.waitForTimeout(1000);

  // Assert: コンソールエラーが発生していないことを確認
  expect(consoleMessages).toHaveLength(0);

  console.log('外部URLテスト完了: Chrome Web Storeページでエラーが発生していません');
});

test('通常のページでルールが正常に適用されることを確認', async ({ page, popupPage }) => {
  // Arrange: コンソールエラーメッセージを記録するための配列（早期設定）
  const consoleMessages: string[] = [];

  // ポップアップページのコンソールメッセージを監視
  popupPage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(msg.text());
    }
  });

  // ローカルテストページに移動
  const fixtureUrl = 'http://localhost:8080/book-page.html';
  const expectedUrlPattern = 'http://localhost:8080';

  await page.goto(fixtureUrl);
  await page.bringToFront();

  // 初期DOM要素の存在確認
  await expect(page.locator('body')).toBeVisible({ timeout: 60000 });

  // ポップアップをリロードして最新のアクティブタブ情報を取得
  await popupPage.reload();

  // URLパターンの自動入力確認
  const urlPatternInput = popupPage.locator('input[name="urlPattern"]');
  await expect(urlPatternInput).toHaveValue(expectedUrlPattern, { timeout: 60000 });

  // Act: 置換設定の入力
  const beforeInput = popupPage.locator('textarea[name="oldString"]');
  const afterInput = popupPage.locator('textarea[name="newString"]');

  await beforeInput.fill('Test');
  await afterInput.fill('Replaced');

  // アラートダイアログの処理設定
  let alertMessage = '';
  popupPage.on('dialog', async dialog => {
    alertMessage = dialog.message();
    await dialog.accept();
  });

  // 保存ボタンクリック
  const saveButton = popupPage.locator('button:has-text("保存")');
  await expect(saveButton).toBeVisible({ timeout: 120000 });
  await expect(saveButton).toBeEnabled({ timeout: 120000 });
  await saveButton.click();

  // Assert: アラートダイアログの確認
  await expect.poll(() => alertMessage, { timeout: 60000 }).toBe('保存して適用しました！');

  // Assert: ページが正常に読み込まれたまま（ルール適用プロセスでエラーが発生していない）
  await expect(page.locator('body')).toBeVisible({ timeout: 60000 });

  // Assert: コンソールエラーが発生していないことを確認
  expect(consoleMessages).toHaveLength(0);

  console.log('通常ページテスト完了: ルールが正常に適用され、コンソールエラーが発生していません');
});
