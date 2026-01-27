# セレクタルール

E2Eテストで要素を特定する際のルール。

---

## 1. 要素セレクタの優先順位

### 規約

E2Eテストで要素を特定する際は、以下の優先順位に従うこと：

1. **`data-testid`属性**（最優先）- 最も安定、文言変更・i18nの影響を受けない
2. **`aria-*`属性** - アクセシビリティ属性、セマンティックな意味を持つ
3. **`role`属性** - WAI-ARIA role
4. **テキスト内容**（最後の手段）- 文言変更で壊れやすい

### 禁止事項

- **テキスト内容のみに依存したセレクタ**（`getByText`のみの使用）
  - 文言変更、句読点差分、i18nで容易に破綻する
- **CSSクラスセレクタ**（`.className`）
  - スタイリング実装の詳細に依存し、リファクタリングで壊れやすい

### 許可事項

- `data-testid`による要素特定（推奨）
- `data-testid`確認後の補助的なテキスト検証（`toContainText`）

### 例

```typescript
// ❌ 悪い例：テキストのみに依存
const emptyMessage = page.getByText('保存されたルールがありません');
await expect(emptyMessage).toBeVisible();

// ✅ 良い例：data-testidを使用
const emptyState = page.locator('[data-testid="empty-state"]');
await expect(emptyState).toBeVisible();

// ✅ 良い例：data-testid + テキスト検証の組み合わせ（テキスト内容も検証したい場合）
const emptyState = page.locator('[data-testid="empty-state"]');
await expect(emptyState).toBeVisible();
await expect(emptyState).toContainText('保存されたルール');
```

### eslint-rule

ESLint化不可（Playwrightのセレクタ選択はコード静的解析では判定困難。PRレビューで確認）

---

## 2. data-testidの命名規則

### 規約

- ケバブケース（`kebab-case`）を使用すること
- コンポーネント名または機能を表す名前を使用すること
- 一意性を確保すること（同一ページ内で重複しない）

### 例

```typescript
// ✅ 良い例
data-testid="empty-state"
data-testid="confirm-dialog"
data-testid="confirm-dialog-cancel-button"
data-testid="rules-table"

// ❌ 悪い例
data-testid="EmptyState"      // PascalCase
data-testid="empty_state"     // snake_case
data-testid="btn1"            // 意味不明な名前
```

### eslint-rule

ESLint化不可（HTMLテンプレート内の属性値の命名規則チェックは困難。PRレビューで確認）

---

## 3. getByRole使用時の厳密マッチ

### 規約

- `getByRole`でボタンやリンクを取得する際は、`exact: true`オプションを使用すること
- 部分一致マッチはラベル拡張時に意図しない要素を取得するリスクがある

### 禁止事項

- `exact: true`なしの`getByRole`（部分一致マッチ）
  - 将来のラベル変更で意図しない要素を取得する可能性がある

### 例

```typescript
// ❌ 悪い例：部分一致（ラベル変更で壊れやすい）
const deleteButton = page.getByRole('button', { name: 'ルールを削除' });

// ✅ 良い例：厳密マッチ
const deleteButton = page.getByRole('button', { name: 'ルールを削除', exact: true });
```

### eslint-rule

ESLint化不可（Playwrightのオプション使用はコード静的解析では判定困難。PRレビューで確認）
