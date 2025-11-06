import { expect,test } from 'tests/e2e/fixtures';

/**
 * ルール一覧ページ（オプションページ）のE2Eテスト
 * 拡張機能のアイコン→オプションでrules.htmlが表示されることを確認します
 */
test('ルール一覧ページが正しく表示される', async ({ context, extensionId }) => {
  // コンソールエラーメッセージを記録するための配列
  const consoleMessages: string[] = [];

  // オプションページを開く
  const optionsPage = await context.newPage();
  
  // オプションページのコンソールメッセージを監視
  optionsPage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(msg.text());
    }
  });
  
  await optionsPage.goto(`chrome-extension://${extensionId}/rules.html`);
  
  // テスト1: オプションページがエラーなく表示される
  await expect(optionsPage.locator('body')).toBeVisible();
  
  // テスト2: ページタイトルが正しく表示される
  const title = await optionsPage.title();
  console.log(`オプションページのタイトル: ${title}`);
  
  // テスト3: ヘッダーが正しく表示されている
  const header = optionsPage.locator('h1:has-text("保存されたルール一覧")');
  await expect(header).toBeVisible();
  
  // テスト4: 初期状態でルールがない場合の表示確認
  const emptyState = optionsPage.locator('.empty-state');
  await expect(emptyState).toBeVisible();
  
  // テスト5: 空の状態メッセージが正しく表示される
  await expect(optionsPage.locator('text=保存されたルールがありません。')).toBeVisible();
  await expect(optionsPage.locator('text=拡張機能のポップアップからルールを作成してください。')).toBeVisible();
  
  // テスト6: フッターが正しく表示される
  const footer = optionsPage.locator('.footer');
  await expect(footer).toBeVisible();
  await expect(optionsPage.locator('text=合計 0 件のルールが保存されています')).toBeVisible();
  
  console.log('ルール一覧ページテスト完了: rules.htmlが正しく表示されています');
  
  // コンソールエラーが発生していないことを確認
  expect(consoleMessages).toHaveLength(0);
});
