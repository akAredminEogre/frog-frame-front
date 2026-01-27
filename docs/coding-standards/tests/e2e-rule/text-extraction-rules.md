# テキスト取得ルール

E2Eテストで要素からテキストを取得する際のルール。

## textContent()の正規化

### 規約

`textContent()`で取得したテキストは**必ず`trim()`で正規化すること**。

### 理由

Reactのレンダリングでは、コンポーネント構造に起因する改行やインデント（空白文字）がテキストに含まれることがある。これにより`toBe()`等の厳密比較が失敗する。

```html
<!-- Reactがレンダリングした実際のDOM -->
<td data-testid="rule-old-string">
  テスト文字列
</td>
```

```typescript
// textContent()の結果: "\n  テスト文字列\n"
// 期待値: "テスト文字列"
// → 一致しない！
```

### NG例：trim()なし

```typescript
// ❌ 空白文字を含む可能性がある
export async function getRuleOldString(page: Page, index: number): Promise<string> {
  const cell = page.locator('[data-testid="rule-old-string"]').nth(index);
  return await cell.textContent() || '';
}
```

### OK例：trim()で正規化

```typescript
// ✅ 前後の空白を除去
export async function getRuleOldString(page: Page, index: number): Promise<string> {
  const cell = page.locator('[data-testid="rule-old-string"]').nth(index);
  const text = await cell.textContent();
  return (text || '').trim();
}
```

## textContent() vs innerText()

| メソッド | 特徴 | 用途 |
|---------|------|------|
| `textContent()` | 非表示要素含む全テキスト、空白そのまま | 生のテキスト取得 |
| `innerText()` | 表示テキストのみ、空白は正規化される | ユーザー視点のテキスト |

**推奨**: `textContent()` + `trim()` を基本とし、複雑な空白処理が必要な場合は `innerText()` を検討する。

## チェックリスト

テキスト取得ヘルパーを実装する際：

- [ ] `textContent()`の結果に`trim()`を適用しているか
- [ ] 戻り値のJSDocに「前後の空白を除去済み」と明記しているか
- [ ] 一致判定に使用する場合、正規化を考慮しているか
