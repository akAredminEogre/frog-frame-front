# アサーションルール

E2Eテストでのアサーション（検証）に関するルール。

---

## 1. ヘルパー関数使用時の重複アサーション禁止

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

---

## 2. 検索・取得結果の前提条件検証

### 規約

- インデックスや要素を検索・取得するヘルパー関数を使用した後、その結果が期待通りであることを明示的に検証すること
- 前提条件が満たされない場合に明確な失敗メッセージを出すことで、デバッグを容易にする

### 対象となるパターン

| 戻り値の型 | 検証方法 |
|-----------|---------|
| インデックス（-1が失敗を示す） | `expect(index).toBeGreaterThanOrEqual(0)` |
| nullable値（null/undefinedが失敗を示す） | `expect(value).toBeDefined()` または `expect(value).not.toBeNull()` |
| 配列（空が失敗を示す） | `expect(array.length).toBeGreaterThan(0)` |

### 例

```typescript
// ❌ 悪い例：検索結果を検証せずに使用（失敗時に原因不明のエラー）
const deleteIndex = await getRuleIndexByOldString(rulesPage, targetOldString);
await clickDeleteButton(rulesPage, deleteIndex);  // deleteIndexが-1だと不明瞭なエラー

// ✅ 良い例：前提条件を明示的に検証
const deleteIndex = await getRuleIndexByOldString(rulesPage, targetOldString);
expect(deleteIndex).toBeGreaterThanOrEqual(0);  // 失敗時「期待: >= 0、実際: -1」と明確
await clickDeleteButton(rulesPage, deleteIndex);
```

### eslint-rule

ESLint化不可（ヘルパー関数の戻り値の意味はコード静的解析では判定困難。PRレビューで確認）
