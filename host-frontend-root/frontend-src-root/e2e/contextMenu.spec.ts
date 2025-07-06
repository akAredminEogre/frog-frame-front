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

    // 3. コンテキストメニュークリックをシミュレートする
    //    - background scriptのロジックを直接呼び出すのは困難
    //    - 代わりに、クリック時に実行されるはずのstorageへの保存処理を直接実行し、
    //      ポップアップを開いて状態を確認する
    const background = context.serviceWorkers()[0];
    await background.evaluate((text: string) => {
        // background.tsのonClickedリスナー内のロジックを模倣
        // @ts-ignore
        chrome.storage.local.set({ tempSelectedText: text });
    }, selectedText);

    // 4. ポップアップを開く
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup.html`);

    // 5. 正規表現パターン入力欄に選択したテキストが設定されていることを確認
    const patternInput = popup.locator('input[name="pattern"]');
    await expect(patternInput).toHaveValue('これはテスト用のテキストです。');

    // 6. ストレージから一時データが削除されていることを確認
    // App.tsxのuseEffectで非同期に削除されるため、少し待つ
    await popup.waitForTimeout(100); 
    const storage = await background.evaluate(() => {
        // @ts-ignore
        return chrome.storage.local.get('tempSelectedText');
    });
    expect(storage.tempSelectedText).toBeUndefined();
  });
});
