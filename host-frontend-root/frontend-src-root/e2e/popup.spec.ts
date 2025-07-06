import { test, expect, chromium } from '@playwright/test';

/**
 * Chrome拡張機能ポップアップのE2Eテスト
 * このテストでは拡張機能のポップアップが正しく表示され、
 * 必要な要素が含まれていることを確認します
 */
test('拡張機能のポップアップが正しく表示される', async () => {
  // 永続コンテキストで拡張機能を読み込んで起動
  const pathToExtension = process.cwd() + '/.output/chrome-mv3-dev';
  const context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`
    ]
  });

  try {
    // 拡張機能IDの取得（Manifest V3 の service worker から）
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent('serviceworker');
    }
    const extensionId = new URL(serviceWorker.url()).hostname;
    console.log(`拡張機能ID: ${extensionId}`);

    // 拡張機能のポップアップを別タブで開く
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);
    
    // テスト1: ポップアップがエラーなく表示される
    await expect(popup.locator('body')).toBeVisible();
    
    // ページタイトルの確認
    const title = await popup.title();
    console.log(`ポップアップのタイトル: ${title}`);
    
    // テスト2: ポップアップに「変更後のテキスト」の文字列が含まれている
    const newTextLabel = popup.locator('text=変更後のテキスト');
    await expect(newTextLabel).toBeVisible();
    
    // テスト3: ポップアップに「正規表現パターン」の文字列が含まれている
    const patternLabel = popup.locator('text=正規表現パターン');
    await expect(patternLabel).toBeVisible();
    
    // テスト4: ポップアップに「URLパターン (前方一致)」の文字列が含まれている
    const urlPatternLabel = popup.locator('text=URLパターン (前方一致)');
    await expect(urlPatternLabel).toBeVisible();
    
    // ヘッダーが正しく表示されていることを確認
    const header = popup.locator('h2:has-text("fklf: Rewrite Rule")');
    await expect(header).toBeVisible();
    
    // 入力フィールドが存在することを確認
    await expect(popup.locator('input[name="newText"]')).toBeVisible();
    await expect(popup.locator('input[name="pattern"]')).toBeVisible();
    await expect(popup.locator('input[name="urlPattern"]')).toBeVisible();
    
    // 保存ボタンが存在することを確認
    const saveButton = popup.locator('button:has-text("保存")');
    await expect(saveButton).toBeVisible();
    
    console.log('ポップアップテスト完了: すべての要素が正しく表示されています');
  } finally {
    // テスト終了時にはコンテキストを必ず閉じる
    await context.close();
  }
});

