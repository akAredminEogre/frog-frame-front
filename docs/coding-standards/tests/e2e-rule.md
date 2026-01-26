# E2Eテストルール

E2Eテスト（Playwright）に適用されるルール。

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

## 3. 共通定数・ヘルパーの再利用

### 規約

- E2Eテスト用の共通定数・ヘルパー関数は `tests/e2e/helpers.ts` に定義されている
- 新規ファイル作成時は、まず既存の共通定数を確認し再利用すること
- 同じ値・用途の定数を複数ファイルで重複定義しないこと

### 確認手順（必須）

新規E2Eテストファイル作成前に以下を確認：

```bash
# 既存の定数・ヘルパーを確認
cat tests/e2e/helpers.ts
```

### 既存の共通定数

| 定数名 | 値 | 用途 |
|--------|-----|------|
| `DEFAULT_TIMEOUT` | 60000 | 要素の表示・入力待機 |
| `RULES_TABLE_TIMEOUT` | 60000 | ルールテーブル表示待機 |
| `DIALOG_TIMEOUT` | 60000 | ダイアログ待機 |
| `TEST_SERVER_URL` | 環境変数または既定値 | テストサーバーのベースURL |

### 既存の共通ヘルパー関数

| 関数名 | 用途 |
|--------|------|
| `setupConsoleErrorMonitoring` | コンソールエラー監視のセットアップ |
| `assertNoConsoleErrors` | コンソールエラーがないことの確認 |
| `clearAllRules` | 全ルール削除（テストデータクリーンアップ） |
| `reloadAndWaitForTable` | ページリロードしてテーブル表示を待機 |
| `saveRule` | ポップアップからルールを保存 |

### 例

```typescript
// ❌ 悪い例：既存定数と同じ値を重複定義
export const PAGE_LOAD_TIMEOUT = 60000;  // DEFAULT_TIMEOUTと重複

// ✅ 良い例：既存定数をインポートして使用
import { DEFAULT_TIMEOUT } from 'tests/e2e/helpers';
```

### eslint-rule

ESLint化不可（定数の意味的な重複はコード静的解析では判定困難。PRレビューで確認）

---

## 4. getByRole使用時の厳密マッチ

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

---

## 5. ヘルパー関数使用時の重複アサーション禁止

### 規約

- アサーションを含むヘルパー関数を使用した後、同じ検証を重複して行わないこと
- ヘルパー関数の内部実装を信頼する

### 禁止事項

- ヘルパー関数が既に行っている検証と同じ内容を再度アサーションすること
  - テストコードが冗長になり、保守性が低下する

### 例

```typescript
// ❌ 悪い例：waitForRuleCountが既にカウント検証を含むのに重複
await waitForRuleCount(rulesPage, 0);
const finalCount = await getRuleCount(rulesPage);
expect(finalCount).toBe(0);  // 冗長

// ✅ 良い例：ヘルパー関数に検証を委譲
await waitForRuleCount(rulesPage, 0);
```

### eslint-rule

ESLint化不可（ヘルパー関数の内部実装との重複はコード静的解析では判定困難。PRレビューで確認）
