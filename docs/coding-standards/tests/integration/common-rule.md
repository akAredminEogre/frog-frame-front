# 結合テスト共通ルール

結合テストを作成する際の共通ルールをまとめたドキュメント。

---

## 1. インポートパスのルール

### パスエイリアスを使用する

`tsconfig.json` で定義されているパスエイリアスを使用する。

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "src/*": ["./src/*"],
      "tests/*": ["./tests/*"]
    }
  }
}
```

### 推奨パターン

```typescript
// OK: パスエイリアスを使用
import 'tests/integration/toggle-rule-active/setup';
import { createTestRule } from 'tests/integration/toggle-rule-active/helpers/createTestRule';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';
```

### NG例

```typescript
// NG: 相対パスや冗長なパスは使用しない
import 'src/../tests/integration/toggle-rule-active/setup';
import { createTestRule } from '../helpers/createTestRule';
import { DexieRewriteRuleRepository } from '../../../src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';
```

---

## 2. fake-indexeddb のセットアップ

### 推奨パターン（自動セットアップ）

```typescript
import 'fake-indexeddb/auto';
// これだけで globalThis.indexedDB が自動設定される
```

`fake-indexeddb/auto` をインポートするだけで、`globalThis.indexedDB` が自動的に設定される。
手動で代入する必要はない。

### NG例

```typescript
// NG: 自動セットアップと手動セットアップの併用は冗長
import 'fake-indexeddb/auto';
import { IDBFactory } from 'fake-indexeddb';
globalThis.indexedDB = new IDBFactory(); // 不要
```

### 手動セットアップ（特別な理由がある場合のみ）

```typescript
// autoインポートを使わない場合のみ
import { IDBFactory } from 'fake-indexeddb';
globalThis.indexedDB = new IDBFactory();
```

---

## 3. Vitestモック管理

### clearAllMocks vs resetAllMocks の違い

| メソッド          | 呼び出し履歴 | 実装(mockImplementation) |
| ----------------- | ------------ | ------------------------ |
| `clearAllMocks()` | クリア       | 維持                     |
| `resetAllMocks()` | クリア       | リセット                 |
| `restoreAllMocks()` | クリア     | 元の実装に復元           |

### 推奨パターン

- `beforeEach` で `vi.clearAllMocks()` を使用
- `afterEach` は原則不要（次の `beforeEach` でクリアされる）

```typescript
// OK: beforeEachのみでモッククリア
beforeEach(() => {
  vi.clearAllMocks();
  // その他のセットアップ
});

// afterEach不要
```

### NG例

```typescript
// NG: beforeEachとafterEachの両方でモック操作は冗長
beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.resetAllMocks(); // 不要：次のbeforeEachでクリアされる
});
```

### afterEachが必要なケース

以下のようなリソースクリーンアップが必要な場合のみ `afterEach` を使用：

```typescript
afterEach(async () => {
  // 外部リソースのクリーンアップ（モック操作ではない）
  await someExternalResource.cleanup();
});
```

---

## 4. テストセットアップの順序

`beforeEach` 内での処理順序：

```typescript
beforeEach(async () => {
  // 1. モックのクリア
  vi.clearAllMocks();

  // 2. DBのクリア
  await dexieDatabase.rewriteRules.clear();

  // 3. 依存オブジェクトの初期化
  repository = new DexieRewriteRuleRepository();
  mockTabsGateway = createMockTabsGateway();

  // 4. コールバック関数の初期化
  onSuccess = vi.fn();
  onError = vi.fn();
});
```
