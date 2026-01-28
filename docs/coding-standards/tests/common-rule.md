# テスト共通ルール

テストコード全般に適用される共通ルール。

---

## 1. インポートパスのルール

### 規約

- `tsconfig.json` で定義されているパスエイリアス（`src/*`, `tests/*`）を使用すること
- 相対パス（`../`, `./`）は使用しないこと
- 冗長なパス（`src/../tests/`）は使用しないこと

### 禁止事項

- `src/../tests/...` のような冗長パス
- `../helpers/...` のような相対パス
- `../../../src/...` のような深い相対パス

### 許可事項

- `tests/...` で始まるパス（testsディレクトリ内のファイル）
- `src/...` で始まるパス（srcディレクトリ内のファイル）

## eslint-rule

- srcディレクトリ: `eslint-rules/no-relative-paths.js`
- testsディレクトリ: `eslint-rules/tests/no-relative-paths-tests.js`

---

## 2. モックファイルの配置ルール

### 規約

- モックファイルは、モック対象クラスのsrcディレクトリ構造を `tests/` 配下で反映したディレクトリに配置すること
- モック対象クラスのパス: `src/{layer}/{category}/{ClassName}/`
- モックファイルのパス: `tests/{layer}/{category}/{ClassName}/`

### 配置例（新規作成時）

**注意**: 新規モック作成前に必ず「モック作成前の確認手順」で既存モックを検索すること。既存モックがある場合はそちらを使用する。

| モック対象クラス | モックファイル配置先 |
|------------------|---------------------|
| `src/frameworks-and-drivers/browser/ChromeTabsGateway/` | `tests/frameworks-and-drivers/browser/ChromeTabsGateway/` |
| `src/infrastructure/persistence/indexeddb/` | `tests/infrastructure/persistence/indexeddb/` |
| `src/application-business-rules/ports/gateway/ITabsGateway.ts` | `tests/unit/application-business-rules/ports/gateway/ITabsGateway/mocks/` ※既存モックがない場合 |

### 禁止事項

- テスト固有のディレクトリ（例: `tests/integration/{feature}/mocks/`）にモックを配置すること
- モック対象クラスのディレクトリ構造と異なる場所に配置すること
- **同一インターフェースのモックを複数箇所に作成すること**（重複モックの禁止）
- **既存モックの再エクスポート用ラッパーファイルを作成すること**（直接インポートを使用）

### 許可事項

- 複数のテストから共有されるモックは、モック対象クラスに対応するtestsディレクトリに配置

### モック作成前の確認手順（必須）

新規モックファクトリ作成前に、以下を確認すること：

1. **既存モックの検索**

   以下のコマンドは `host-frontend-root/frontend-src-root/` ディレクトリで実行すること:
   ```bash
   # 同一インターフェースのモックを検索（例：ITabsGateway）
   grep -r "createMockTabsGateway" tests/
   # または
   find tests/ -name "createMock*.ts" | xargs grep -l "ITabsGateway"
   ```

   リポジトリルートから実行する場合は `host-frontend-root/frontend-src-root/tests/` を指定すること。

2. **検索結果の判断**
   - 既存モックが見つかった場合 → **共有モックから直接インポートして使用**
     - 新しいモックファイルを作成してはならない（再エクスポート用ラッパーも禁止）
     - テストコードで共有モックのパスを直接指定すること
   - 見つからなかった場合 → モック対象クラスのtestsディレクトリに新規作成

3. **共有モックの配置先**
   - ポート/インターフェースレベルのモック → `tests/unit/{layer}/ports/{category}/{InterfaceName}/mocks/`
   - 例：`ITabsGateway` → `tests/unit/application-business-rules/ports/gateway/ITabsGateway/mocks/`
   - 例：`IRewriteRuleRepository` → `tests/unit/application-business-rules/ports/gateway/IRewriteRuleRepository/mocks/`

**重要**: この手順を省略すると、PRレビューで重複モックの指摘を受けます。

#### 既存コードへの適用

本規約に準拠していない既存コードは [user-story-008](../../user-stories/user-story-008/README.md) で対応予定。

**注意**: 新規作成時は必ず本規約に従うこと。

## eslint-rule

ESLint化不可（ディレクトリ構造の規約はファイルシステムレベルの検証が必要、PRレビューで確認）

---

## 3. テストデータの型注釈ルール

### 規約

- テストケース配列には明示的な型注釈を付けること
- 型注釈により、プロパティ名のタイポや型の不一致をコンパイル時に検出できる

### 禁止事項

- 型推論に頼ったテストデータ配列の定義

### 許可事項

- `Array<T>` または `T[]` 形式での型注釈
- 型エイリアス（`type` または `interface`）を定義しての型注釈

## eslint-rule

ESLint化不可（`@typescript-eslint/typedef`はすべての変数宣言に型注釈を要求するため過剰。テストデータ配列のみを対象とするルールは存在しない。PRレビューで確認）

---

## 4. モック型キャストの禁止

### 規約

- 通常の関数をモック型（`ReturnType<typeof vi.fn>` 等）に `as` でキャストしてはならない
- モック固有のアサーションメソッド（`.toHaveBeenCalled()` 等）を使用する必要がある場合は `vi.fn()` でラップすること

### 禁止事項

```typescript
// ❌ Bad: ランタイムでモック固有メソッドが存在しないためエラーになる
this.callback = someFunction as ReturnType<typeof vi.fn>;
```

### 許可事項

```typescript
// ✅ Good: vi.fn()でラップすることで元の関数の動作を維持しつつモック機能を付与
this.callback = vi.fn(someFunction);
```

### 根拠

`as` キャストは TypeScript の型チェックを無効化するだけで、ランタイムの実体は変わらない。テストヘルパーは複数のテストから使われるため、型の不整合の影響範囲が広い。

## eslint-rule

ESLint化不可（`as` キャストの用途を文脈判断する必要があるため。PRレビューで確認）

---

## 5. 非同期処理中のState排他制御（try/finally パターン）

### 規約

`Set` や `boolean` でUI上の処理中状態（`deletingIds`、`togglingIds` 等）を管理する場合、非同期処理の完了後にStateを解除するコードは `try/finally` で保護すること。

### 禁止事項

```typescript
// ❌ Bad: 例外時にStateが残留し、同一IDの再操作が永久にブロックされる
setProcessingIds((prev) => new Set(prev).add(id));
await someAsyncOperation(id);
setProcessingIds((prev) => {
  const next = new Set(prev);
  next.delete(id);
  return next;
});
```

### 許可事項

```typescript
// ✅ Good: 例外時もStateが解除される
setProcessingIds((prev) => new Set(prev).add(id));
try {
  await someAsyncOperation(id);
} finally {
  setProcessingIds((prev) => {
    const next = new Set(prev);
    next.delete(id);
    return next;
  });
}
```

### 根拠

`await` の前に確保し `await` の後に解放するリソースがある場合、例外発生時に解放処理に到達せずリソースがリークする。これは `lock/unlock`、`open/close`、`add/remove` すべてに共通するパターン。

## eslint-rule

ESLint化不可（State管理のパターンを文脈判断する必要があるため。PRレビューで確認）

---

## 6. テストケース配列のフィールド使用検証

### 規約

- `testCases.forEach()` パターンでテストケース配列を使用する場合、配列要素のすべてのプロパティ（`description` を除く）がテスト本体内で参照されていること
- データ駆動テストの目的は、テストケースごとに異なる入力・期待値を使うことにある。定義したフィールドを使わないテストはコピー&ペーストミスの兆候

### 禁止事項

```typescript
// ❌ Bad: propertyNameを定義しているがテスト本体で未使用
const testCases = [{ description: '...', propertyName: 'foo' }];
testCases.forEach((testCase) => {
  it(testCase.description, () => {
    expect(someUnrelatedValue).toBe(true); // propertyNameを使っていない
  });
});
```

### 許可事項

```typescript
// ✅ Good: 定義したフィールドをアサーションで使用している
const testCases: Array<{ description: string; propertyName: keyof SomeType }> = [
  { description: '...', propertyName: 'foo' },
];
testCases.forEach((testCase) => {
  it(testCase.description, () => {
    const result = getResult();
    expect(typeof result[testCase.propertyName]).toBe('function');
  });
});
```

### 根拠

テストケース配列のフィールドが未使用の場合、テストが意図した検証を行っていない可能性が高い。各テストケースの差異がアサーションに反映されなければ、配列化した意味がない。§3の型注釈ルールと組み合わせることで、型注釈で構造を保証し、本ルールで使用漏れを防ぐ二重チェックとなる。

## eslint-rule

ESLint化不可（テスト配列のセマンティクスを静的解析で判定できないため。PRレビューで確認）

---

## 7. モック初期化・リセットの明示的呼び出し

### 規約

- `beforeEach` の先頭で `vi.clearAllMocks()` を呼び出すこと
- `afterEach` の末尾で `vi.resetAllMocks()` を呼び出すこと
- テストヘルパークラスの `setup()` / `cleanup()` 内に `vi.clearAllMocks()` / `vi.resetAllMocks()` を隠蔽しないこと

### 禁止事項

```typescript
// ❌ Bad: テストヘルパー内部にモックリセットを隠蔽している
class TestHelper {
  setup(): void {
    vi.clearAllMocks(); // テストファイルから見えない
    // ... DOM セットアップ
  }
  cleanup(): void {
    // ... DOM クリーンアップ
    vi.resetAllMocks(); // テストファイルから見えない
  }
}

// テストファイル側ではモックリセットが行われているか不明
beforeEach(() => {
  helper.setup();
});
afterEach(() => {
  helper.cleanup();
});
```

### 許可事項

```typescript
// ✅ Good: テストファイルでモックリセットを明示的に呼び出す
beforeEach(() => {
  vi.clearAllMocks();
  helper.setup();
  // ... モック設定
});

afterEach(() => {
  helper.cleanup();
  vi.resetAllMocks();
});
```

### 根拠

テストヘルパーの責務は DOM のセットアップ・クリーンアップであり、Vitest のモック状態管理はテストファイル側の責務である。モックリセットをヘルパー内部に隠蔽すると、テストファイルを読んだだけではモック状態の初期化が行われているか判断できず、レビュー時に見落としの原因となる。

## eslint-rule

ESLint化不可（`beforeEach` / `afterEach` 内の呼び出し有無を文脈判断する必要があるため。PRレビューで確認）
