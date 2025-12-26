import { type BrowserContext, chromium, type Page } from '@playwright/test';
import { expect, test } from 'tests/e2e/fixtures';

/**
 * Playwright Fixtures 検証テスト
 * 
 * このテストファイルは、tests/e2e/fixtures.ts で定義されているカスタムフィクスチャが
 * 正しく動作することを検証します。各フィクスチャの初期化、依存関係、クリーンアップを確認します。
 * 
 * テスト対象: host-frontend-root/frontend-src-root/tests/e2e/fixtures.ts
 */

test.describe('Playwright Fixtures - 基本動作検証', () => {
  test('context フィクスチャが正しく初期化され、Chrome拡張機能がロードされている', async ({ context }) => {
    // context が BrowserContext のインスタンスであることを確認
    expect(context).toBeDefined();
    expect(typeof context.newPage).toBe('function');
    
    // サービスワーカー（background script）が存在することを確認
    const serviceWorkers = context.serviceWorkers();
    expect(serviceWorkers.length).toBeGreaterThan(0);
    
    // ブラウザコンテキストが使用可能であることを確認
    const testPage = await context.newPage();
    expect(testPage).toBeDefined();
    await testPage.close();
  });

  test('extensionId フィクスチャが正しい形式の拡張機能IDを返す', async ({ extensionId }) => {
    // extensionId が定義されていることを確認
    expect(extensionId).toBeDefined();
    expect(typeof extensionId).toBe('string');
    
    // Chrome拡張機能IDの形式を確認（32文字の英小文字）
    expect(extensionId).toMatch(/^[a-z]{32}$/);
    expect(extensionId.length).toBe(32);
  });

  test('popupPage フィクスチャが拡張機能のポップアップページを正しく開く', async ({ popupPage, extensionId }) => {
    // popupPage が定義されていることを確認
    expect(popupPage).toBeDefined();
    expect(typeof popupPage.url).toBe('function');
    
    // URLが正しい拡張機能のポップアップURLであることを確認
    const url = popupPage.url();
    expect(url).toBe(`chrome-extension://${extensionId}/popup.html`);
    
    // ページが実際に読み込まれていることを確認
    await expect(popupPage.locator('body')).toBeVisible({ timeout: 10000 });
    
    // ページタイトルが取得できることを確認
    const title = await popupPage.title();
    expect(typeof title).toBe('string');
  });

  test('page フィクスチャが新しいブラウザページを提供する', async ({ page, context }) => {
    // page が定義されていることを確認
    expect(page).toBeDefined();
    expect(typeof page.goto).toBe('function');
    
    // ページが同じコンテキストに属していることを確認
    expect(page.context()).toBe(context);
    
    // ページでナビゲーションが可能であることを確認
    await page.goto('about:blank');
    expect(page.url()).toBe('about:blank');
  });

  test('rulesPage フィクスチャが拡張機能のルール一覧ページを正しく開く', async ({ rulesPage, extensionId }) => {
    // rulesPage が定義されていることを確認
    expect(rulesPage).toBeDefined();
    
    // URLが正しい拡張機能のルール一覧URLであることを確認
    const url = rulesPage.url();
    expect(url).toBe(`chrome-extension://${extensionId}/rules.html`);
    
    // ページが実際に読み込まれていることを確認
    await expect(rulesPage.locator('body')).toBeVisible({ timeout: 10000 });
    
    // ルール一覧ページの主要要素が存在することを確認
    const header = rulesPage.locator('h1:has-text("保存されたルール一覧")');
    await expect(header).toBeVisible({ timeout: 10000 });
  });

  test('editPage フィクスチャが拡張機能の編集ページを正しく開く', async ({ editPage, extensionId }) => {
    // editPage が定義されていることを確認
    expect(editPage).toBeDefined();
    
    // URLが正しい拡張機能の編集ページURLであることを確認
    const url = editPage.url();
    expect(url).toContain(`chrome-extension://${extensionId}/edit.html`);
    expect(url).toContain('ruleId=sample-rule-id');
    
    // ページが実際に読み込まれていることを確認
    await expect(editPage.locator('body')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Playwright Fixtures - フィクスチャの独立性検証', () => {
  test('複数のフィクスチャが同時に使用でき、互いに干渉しない', async ({ 
    context, 
    extensionId, 
    popupPage, 
    page, 
    rulesPage, 
    editPage 
  }) => {
    // すべてのフィクスチャが定義されていることを確認
    expect(context).toBeDefined();
    expect(extensionId).toBeDefined();
    expect(popupPage).toBeDefined();
    expect(page).toBeDefined();
    expect(rulesPage).toBeDefined();
    expect(editPage).toBeDefined();
    
    // すべてのページが同じコンテキストに属していることを確認
    expect(popupPage.context()).toBe(context);
    expect(page.context()).toBe(context);
    expect(rulesPage.context()).toBe(context);
    expect(editPage.context()).toBe(context);
    
    // 各ページが異なるURLを持っていることを確認
    const urls = [
      popupPage.url(),
      page.url(),
      rulesPage.url(),
      editPage.url(),
    ];
    
    // popup, rules, editは拡張機能のURL
    expect(urls[0]).toContain('chrome-extension://');
    expect(urls[2]).toContain('chrome-extension://');
    expect(urls[3]).toContain('chrome-extension://');
    
    // pageは独立した新規ページ（about:blank）
    expect(urls[1]).toBe('about:blank');
  });

  test('pageフィクスチャで外部URLにナビゲートしても他のフィクスチャに影響しない', async ({ 
    page, 
    popupPage, 
    rulesPage 
  }) => {
    // pageで外部URLにナビゲート
    await page.goto('http://localhost:8080/agile-manifesto.html');
    
    // popupPageとrulesPageが影響を受けていないことを確認
    expect(popupPage.url()).toContain('chrome-extension://');
    expect(popupPage.url()).toContain('/popup.html');
    
    expect(rulesPage.url()).toContain('chrome-extension://');
    expect(rulesPage.url()).toContain('/rules.html');
    
    // 各ページが依然として利用可能であることを確認
    await expect(popupPage.locator('body')).toBeVisible();
    await expect(rulesPage.locator('body')).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Playwright Fixtures - エラーケースとエッジケース', () => {
  test('拡張機能ページがロードに失敗しても適切にエラーを検出できる', async ({ popupPage }) => {
    // ポップアップページが正常にロードされたことを確認
    await expect(popupPage.locator('body')).toBeVisible({ timeout: 10000 });
    
    // 存在しないページへのナビゲートを試みる
    const navigationPromise = popupPage.goto('chrome-extension://invalid-id/invalid.html');
    
    // ナビゲーションエラーが発生することを確認（またはタイムアウト）
    await expect(navigationPromise).rejects.toThrow();
  });

  test('contextから手動で作成した新しいページも拡張機能にアクセスできる', async ({ context, extensionId }) => {
    // contextから新しいページを手動で作成
    const manualPage = await context.newPage();
    
    try {
      // 手動作成ページでも拡張機能のURLにアクセスできることを確認
      await manualPage.goto(`chrome-extension://${extensionId}/popup.html`);
      
      // ページが正しくロードされることを確認
      await expect(manualPage.locator('body')).toBeVisible({ timeout: 10000 });
      
      // URLが正しいことを確認
      expect(manualPage.url()).toBe(`chrome-extension://${extensionId}/popup.html`);
    } finally {
      // テスト後のクリーンアップ
      await manualPage.close();
    }
  });

  test('複数のページを開いてもブラウザコンテキストが正常に動作する', async ({ context, extensionId }) => {
    const pages: Page[] = [];
    
    try {
      // 5つの新しいページを同時に開く
      for (let i = 0; i < 5; i++) {
        const newPage = await context.newPage();
        await newPage.goto(`chrome-extension://${extensionId}/popup.html`);
        pages.push(newPage);
      }
      
      // すべてのページが正常にロードされたことを確認
      for (const page of pages) {
        await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
        expect(page.url()).toBe(`chrome-extension://${extensionId}/popup.html`);
      }
      
      // コンテキストのページ数を確認（フィクスチャのページ + 手動作成の5ページ）
      const allPages = context.pages();
      expect(allPages.length).toBeGreaterThanOrEqual(5);
    } finally {
      // テスト後のクリーンアップ
      for (const page of pages) {
        await page.close();
      }
    }
  });

  test('serviceWorkerイベントが正しく処理される', async ({ context }) => {
    // サービスワーカーが存在することを確認
    const serviceWorkers = context.serviceWorkers();
    expect(serviceWorkers.length).toBeGreaterThan(0);
    
    // サービスワーカーのURLを確認
    const backgroundWorker = serviceWorkers[0];
    expect(backgroundWorker).toBeDefined();
    expect(backgroundWorker.url()).toContain('chrome-extension://');
    expect(backgroundWorker.url()).toContain('/background.js');
  });
});

test.describe('Playwright Fixtures - ページリロードとナビゲーション', () => {
  test('popupPageをリロードしても正常に動作する', async ({ popupPage, extensionId }) => {
    // 初期状態の確認
    await expect(popupPage.locator('body')).toBeVisible();
    const initialUrl = popupPage.url();
    
    // ページをリロード
    await popupPage.reload();
    
    // リロード後も同じURLであることを確認
    expect(popupPage.url()).toBe(initialUrl);
    expect(popupPage.url()).toBe(`chrome-extension://${extensionId}/popup.html`);
    
    // ページが再度利用可能であることを確認
    await expect(popupPage.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('rulesPageをリロードしても正常に動作する', async ({ rulesPage, extensionId }) => {
    // 初期状態の確認
    await expect(rulesPage.locator('body')).toBeVisible();
    const initialUrl = rulesPage.url();
    
    // ページをリロード
    await rulesPage.reload();
    
    // リロード後も同じURLであることを確認
    expect(rulesPage.url()).toBe(initialUrl);
    expect(rulesPage.url()).toBe(`chrome-extension://${extensionId}/rules.html`);
    
    // ページが再度利用可能であることを確認
    await expect(rulesPage.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('editPageで異なるruleIdにナビゲートできる', async ({ editPage, extensionId }) => {
    // 初期URLを確認
    expect(editPage.url()).toContain('ruleId=sample-rule-id');
    
    // 異なるruleIdのURLにナビゲート
    await editPage.goto(`chrome-extension://${extensionId}/edit.html?ruleId=different-rule-id`);
    
    // 新しいURLを確認
    expect(editPage.url()).toContain('ruleId=different-rule-id');
    expect(editPage.url()).not.toContain('ruleId=sample-rule-id');
    
    // ページが正常にロードされることを確認
    await expect(editPage.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('pageフィクスチャで複数の異なるURLにナビゲートできる', async ({ page }) => {
    // 最初のURL
    await page.goto('http://localhost:8080/agile-manifesto.html');
    expect(page.url()).toBe('http://localhost:8080/agile-manifesto.html');
    await expect(page.locator('body')).toBeVisible();
    
    // 2番目のURL
    await page.goto('http://localhost:8080/book-page.html');
    expect(page.url()).toBe('http://localhost:8080/book-page.html');
    await expect(page.locator('body')).toBeVisible();
    
    // about:blank
    await page.goto('about:blank');
    expect(page.url()).toBe('about:blank');
  });
});

test.describe('Playwright Fixtures - 型の整合性検証', () => {
  test('フィクスチャの型が正しく定義されている', async ({ context, extensionId, popupPage, page, rulesPage, editPage }) => {
    // context が BrowserContext 型であることを確認
    expect(typeof context.newPage).toBe('function');
    expect(typeof context.close).toBe('function');
    expect(typeof context.pages).toBe('function');
    
    // extensionId が string 型であることを確認
    expect(typeof extensionId).toBe('string');
    
    // すべてのページフィクスチャが Page 型であることを確認
    const pages = [popupPage, page, rulesPage, editPage];
    pages.forEach(p => {
      expect(typeof p.goto).toBe('function');
      expect(typeof p.url).toBe('function');
      expect(typeof p.locator).toBe('function');
      expect(typeof p.reload).toBe('function');
      expect(typeof p.close).toBe('function');
    });
  });
});

test.describe('Playwright Fixtures - 拡張機能の状態管理', () => {
  test('各テストで拡張機能が新しい状態から開始される', async ({ rulesPage }) => {
    // ルール一覧ページで空の状態が表示されることを確認
    // （各テストで独立したブラウザコンテキストが使用されるため）
    await expect(rulesPage.locator('[data-testid="empty-state"]')).toBeVisible({ timeout: 10000 });
    await expect(rulesPage.locator('text=保存されたルールがありません。')).toBeVisible();
  });

  test('コンテキスト内で作成したデータが他のページから見える', async ({ context, extensionId, popupPage, rulesPage, page }) => {
    // コンソールエラー監視
    const consoleMessages: string[] = [];
    popupPage.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text());
      }
    });
    
    // テストページに移動
    await page.goto('http://localhost:8080/agile-manifesto.html');
    await page.bringToFront();
    
    // ポップアップをリロード
    await popupPage.reload();
    await popupPage.bringToFront();
    
    // URLパターンの自動入力を待機
    const urlPatternInput = popupPage.locator('input[name="urlPattern"]');
    await expect(urlPatternInput).toHaveValue('http://localhost:8080', { timeout: 60000 });
    
    // ルールを保存
    const beforeInput = popupPage.locator('textarea[name="oldString"]');
    const afterInput = popupPage.locator('textarea[name="newString"]');
    
    await beforeInput.fill('テスト');
    await afterInput.fill('置換済み');
    
    const saveButton = popupPage.getByRole('button', { name: '保存', exact: true });
    await expect(saveButton).toBeVisible({ timeout: 60000 });
    await expect(saveButton).toBeEnabled({ timeout: 60000 });
    
    // ダイアログを待機して保存
    const [dialog] = await Promise.all([
      popupPage.waitForEvent('dialog', { timeout: 60000 }),
      saveButton.click(),
    ]);
    
    expect(dialog.message()).toBe('保存して適用しました！');
    await dialog.accept();
    
    // ルール一覧ページをリロード
    await rulesPage.reload();
    
    // 保存したルールがルール一覧ページに表示されることを確認
    await expect(rulesPage.locator('[data-testid="rules-table"]')).toBeVisible({ timeout: 60000 });
    
    // ルールが実際に表示されていることを確認
    const ruleRows = rulesPage.locator('[data-testid="rule-row"]');
    await expect(ruleRows).toHaveCount(1, { timeout: 10000 });
    
    // コンソールエラーがないことを確認
    expect(consoleMessages).toHaveLength(0);
  });
});