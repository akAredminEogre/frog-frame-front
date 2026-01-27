# ヘルパー関数のエラー処理パターン

同一モジュール内のヘルパー関数で一貫したエラー処理を行うためのルール。

## 規約

同一モジュール内のヘルパー関数は**一貫したエラー処理パターン**を使用すること。

## 理由

- インデックス指定で要素を取得する関数が、範囲外の場合にタイムアウトエラーになると原因が分かりにくい
- 同一モジュール内で一部の関数だけ範囲チェックがあると、開発者が混乱する

## パターン：インデックス指定ヘルパーの範囲チェック

インデックスを引数に取るヘルパー関数は、操作前に範囲チェックを行い、範囲外の場合は明示的な例外を投げること。

```typescript
// ✅ 良い例：範囲チェックあり
export async function getRuleOldString(page: Page, ruleIndex: number): Promise<string> {
  const rows = page.locator('[data-testid="rules-table"] tbody tr');
  const count = await rows.count();

  if (ruleIndex < 0 || ruleIndex >= count) {
    throw new Error(`ルール行が見つかりません: index=${ruleIndex}, 存在する行数=${count}`);
  }

  const row = rows.nth(ruleIndex);
  // ...
}

// ❌ 悪い例：範囲チェックなし（タイムアウトで原因不明）
export async function getRuleOldString(page: Page, ruleIndex: number): Promise<string> {
  const rows = page.locator('[data-testid="rules-table"] tbody tr');
  const row = rows.nth(ruleIndex);  // 範囲外でも即座にエラーにならない
  // ...
}
```

## チェックリスト

同一モジュール内に複数のインデックス指定ヘルパーがある場合：

- [ ] 全てのヘルパーで範囲チェックパターンが統一されているか
- [ ] エラーメッセージのフォーマットが統一されているか（`index=${index}, 存在する行数=${count}`）
- [ ] JSDocに`@throws`を記載しているか
