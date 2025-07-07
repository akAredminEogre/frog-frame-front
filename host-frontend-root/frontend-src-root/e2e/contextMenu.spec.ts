import { test, expect, chromium, Page } from '@playwright/test';

const EXTENSION_PATH = process.cwd() + '/.output/chrome-mv3-dev';

test.describe('コンテキストメニューからのテキスト置換機能', () => {
  let context: any;
  let page: Page;
  let extensionId: string;

  test.beforeAll(async () => {
    context = await chromium.launchPersistentContext('', {
      headless: true,
      args: [
        `--disable-extensions-except=${EXTENSION_PATH}`,
        `--load-extension=${EXTENSION_PATH}`,
      ],
    });

    // 拡張機能IDの取得
    let [serviceWorker] = context.serviceWorkers();
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent('serviceworker');
    }
    extensionId = new URL(serviceWorker.url()).hostname;
  });

  test.afterAll(async () => {
    await context.close();
  });

  test.beforeEach(async () => {
    page = await context.newPage();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test('選択したテキストがポップアップの入力欄に表示される', async () => {
    // 1. テスト用のページを開く
    await page.goto('data:text/html;charset=utf-8,<p>これはテスト用のテキストです。</p>');

    // 2. テキストを選択する
    await page.evaluate(() => {
      const p = document.querySelector('p')!;
      const range = document.createRange();
      range.selectNodeContents(p);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
    });
    const selectedText = await page.evaluate(() => window.getSelection()?.toString());
    expect(selectedText).toBe('これはテスト用のテキストです。');

    // 3. コンテキストメニュークリック処理を実行（実際のプロダクション関数を使用）
    const background = context.serviceWorkers()[0];
    
    // 実際のプロダクション関数を実行（ストレージ保存 + ポップアップ自動オープン）
    // Note: Playwright環境では chrome.action.openPopup() が新しいページイベントを発火しない可能性があるため、
    // ストレージへの保存を確認し、その後手動でポップアップを開いてデータが正しく読み込まれることをテスト
    await background.evaluate((text: string) => {
        // utils/contextMenuUtils.ts でグローバルに公開された完全な関数を呼び出し
        // @ts-ignore
        globalThis.handleReplaceTextClick(text);
    }, selectedText);

    // 4. ストレージにデータが保存されていることを確認（chrome.action.openPopup()の効果をテスト）
    await page.waitForTimeout(100); // 非同期処理の完了を待機
    const storageData = await background.evaluate(() => {
        // @ts-ignore
        return chrome.storage.local.get('tempSelectedText');
    });
    expect(storageData.tempSelectedText).toBe('これはテスト用のテキストです。');

    // 5. ポップアップを開いて実際のユーザーフローをテスト
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);

    // 6. App.tsxのuseEffectが完了するまで待機
    await popup.waitForTimeout(500);

    // 7. 置換前入力欄に選択したテキストが設定されていることを確認
    const oldTextPatternInput = popup.locator('input[name="oldTextPattern"]');
    await expect(oldTextPatternInput).toHaveValue('これはテスト用のテキストです。');

    // 8. ストレージから一時データが削除されていることを確認
    // App.tsxのuseEffectで非同期に削除されるため、少し待つ
    await popup.waitForTimeout(100); 
    const finalStorage = await background.evaluate(() => {
        // @ts-ignore
        return chrome.storage.local.get('tempSelectedText');
    });
    expect(finalStorage.tempSelectedText).toBeUndefined();
  });
});
