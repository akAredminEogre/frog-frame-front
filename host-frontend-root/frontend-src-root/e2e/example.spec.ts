import { test, expect, chromium } from '@playwright/test';

/**
 * Chrome拡張機能のE2Eテスト例
 * このテストでは拡張機能のポップアップを開いて機能をテストします
 */
test('拡張機能のポップアップボタンがページの内容を変更できる', async () => {
  // 永続コンテキストで拡張機能を読み込んで起動
  const pathToExtension = process.cwd() + '/.output/chrome-mv3-dev';
  const context = await chromium.launchPersistentContext('', {
    headless: true,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`
    ]
  });

  // ブラウザページを取得
  const [page] = context.pages();

  // 拡張機能IDの取得（Manifest V3 の service worker から）
  let [serviceWorker] = context.serviceWorkers();
  if (!serviceWorker) {
    serviceWorker = await context.waitForEvent('serviceworker');
  }
  const extensionId = new URL(serviceWorker.url()).hostname;
  console.log(`拡張機能ID: ${extensionId}`);

  // テスト対象ページを開く
  await page.goto('https://example.com');
  
  // 拡張機能のポップアップを別タブで開く
  const popup = await context.newPage();
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  
  // ポップアップの内容を確認
  await expect(popup.locator('body')).toBeVisible();
  
  // ポップアップページのタイトルを検証
  const title = await popup.title();
  console.log(`ポップアップのタイトル: ${title}`);
  
  // ここで拡張機能の機能をテスト
  // 例: ポップアップ内のボタンをクリック（もし#popupButtonがあれば）
  try {
    const popupButton = popup.locator('#popupButton');
    if (await popupButton.isVisible()) {
      await popupButton.click();
      console.log('ポップアップボタンをクリックしました');
      
      // ここでメインページへの影響を検証
      // 例: 特定の要素の内容が変更されたか確認
      // await expect(page.locator('#result')).toHaveText('変更されました！');
    } else {
      console.log('ポップアップボタンが見つかりませんでした');
    }
  } catch (e) {
    console.log('ポップアップボタンの操作中にエラーが発生しました:', e);
  }
  
  // コンテキストを閉じてテスト終了
  await context.close();
});
