# E2Eテスト共通ルール

## ディレクトリ構造
E2Eテストは機能ごとに作成し、docs/designのディレクトリ構造を踏襲した形で配置する。

```plaintext
tests/e2e/pages/{page-name}/features/{feature-name}/
└── {テスト観点}.spec.ts
```

## コンソールエラーの検知

拡張機能側で発生しているコンソールエラーを検知し、1件以上あった場合はテストを失敗させる。
- ページ側のコンソールエラーは検知しない

### 実装例

```typescript
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

  // Assert: コンソールエラーが発生していないことを確認
  expect(consoleMessages).toHaveLength(0);
});
```