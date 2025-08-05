import { test, expect } from './fixtures';

test('ポップアップを開くと、URLパターンのフォームにブラウザに表示されているページのURLのドメインが自動入力されている', async ({ page, context, popupPage }) => {

  // メインページに移動し、フォーカスを当てる
  await page.goto('https://agilemanifesto.org/iso/ja/manifesto.html');
  await page.bringToFront();

  //  ポップアップをリロードして、最新のアクティブタブ情報を取得させる
  await popupPage.reload();

  // Assert
  const urlPatternInput = popupPage.getByLabel('URLパターン (前方一致):');
  
  // 値が設定されるまで、デフォルトより長いタイムアウトを設定して待機
  await expect(urlPatternInput).toHaveValue('https://agilemanifesto.org', { timeout: 10000 });
});
