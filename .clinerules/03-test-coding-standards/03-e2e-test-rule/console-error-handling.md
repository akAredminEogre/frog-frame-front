e2eテストにおけるコンソールエラーの検知
拡張機能側で発生しているコンソールエラーを検知し、1件以上あった場合はテストを失敗させる
  - ページ側のコンソールエラーは検知しない

例
```
import { test, expect } from './fixtures';

test('', async ({ page, popupPage }) => {
  // 前略

  // コンソールエラーメッセージを記録するための配列
  const consoleMessages: string[] = [];

  // ポップアップページのコンソールメッセージを監視

  popupPage.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(msg.text());
    }
  });
  
  // 9. Assert: コンソールエラーが発生していないことを確認
  expect(consoleMessages).toHaveLength(0);
});
```
