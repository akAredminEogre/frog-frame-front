import { test, expect } from './fixtures';

/**
 * Chrome拡張機能ポップアップのE2Eテスト
 * このテストでは拡張機能のポップアップが正しく表示され、
 * 必要な要素が含まれていることを確認します
 */
test('拡張機能のポップアップが正しく表示される', async ({ popupPage }) => {
  const popup = popupPage;
  // テスト1: ポップアップがエラーなく表示される
  await expect(popup.locator('body')).toBeVisible();
    
  // ページタイトルの確認
  const title = await popup.title();
  console.log(`ポップアップのタイトル: ${title}`);
    
  // テスト2: ポップアップに「置換前」の文字列が含まれている
  const oldTextPatternLabel = popup.locator('text=置換前');
  await expect(oldTextPatternLabel).toBeVisible();
    
  // テスト3: ポップアップに「置換後」の文字列が含まれている
  const newTextValueLabel = popup.locator('text=置換後');
  await expect(newTextValueLabel).toBeVisible();
    
  // テスト4: ポップアップに「URLパターン (前方一致)」の文字列が含まれている
  const urlPatternLabel = popup.locator('text=URLパターン (前方一致)');
  await expect(urlPatternLabel).toBeVisible();
    
  // ヘッダーが正しく表示されていることを確認
  const header = popup.locator('h2:has-text("fklf: Rewrite Rule")');
  await expect(header).toBeVisible();
    
  // 入力フィールドが存在することを確認
  await expect(popup.locator('textarea[name="oldString"]')).toBeVisible();
  await expect(popup.locator('textarea[name="newString"]')).toBeVisible();
  await expect(popup.locator('input[name="urlPattern"]')).toBeVisible();
    
  // 保存ボタンが存在することを確認
  const saveButton = popup.locator('button:has-text("保存")');
  await expect(saveButton).toBeVisible();
    
  console.log('ポップアップテスト完了: すべての要素が正しく表示されています');
});
