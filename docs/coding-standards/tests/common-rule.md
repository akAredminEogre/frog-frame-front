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

- 関数をモック型（`ReturnType<typeof vi.fn>` 等）に `as` でキャストしてはならない
- モック固有のメソッド（`.mockReturnValue()`, `.toHaveBeenCalled()` 等）にアクセスする場合は、用途に応じて以下を使用すること:
  - `vi.mock` で既にモック化された関数 → `vi.mocked()` で型安全にアクセス
  - 通常の関数にモック機能を付与したい場合 → `vi.fn()` でラップ

### 禁止事項

- 関数を `as ReturnType<typeof vi.fn>` でキャストすること: `as` キャストは TypeScript の型チェックを無効化するだけで、ランタイムの実体を変えない

### 許可事項

- `vi.mocked(someModule.method)` で `vi.mock` 済み関数のモック型にアクセスすること
- `vi.fn(someFunction)` でラップして元の関数の動作を維持しつつモック機能を付与すること

### 根拠

`as` キャストは TypeScript の型チェックを無効化するだけで、ランタイムの実体は変わらない。`vi.mocked()` は Vitest が提供する型安全なユーティリティであり、`vi.mock` で既にモック化された関数に対して正しい型を返す。テストヘルパーやテストファイルの `beforeEach` など複数箇所で使われるため、型の不整合の影響範囲が広い。

### 適用シナリオ

- テストヘルパーのコンストラクタで `onDeleteSuccess` コールバックを受け取り、モックアサーションで呼び出し回数を検証したい場合: `vi.fn(onDeleteSuccess)` でラップして保持する
- `vi.mock` でモジュール全体をモック化し、`beforeEach` でモック関数の戻り値を設定したい場合: `vi.mocked(container.resolve).mockReturnValue(...)` で型安全にアクセスする

## eslint-rule

ESLint化不可（`as` キャストの用途を文脈判断する必要があるため。PRレビューで確認）

---

## 5. 非同期処理中のState排他制御（try/finally パターン）

### 規約

`Set` や `boolean` でUI上の処理中状態（`deletingIds`、`togglingIds` 等）を管理する場合、非同期処理の完了後にStateを解除するコードは `try/finally` で保護すること。

### 禁止事項

- 処理中 State に ID を追加した後、`try/finally` なしで `await` し、その後に State から ID を削除すること: 例外時に State が残留し、同一 ID の再操作が永久にブロックされる

### 許可事項

- 処理中 State への追加後、`try` ブロック内で `await` し、`finally` ブロックで State から ID を削除すること: 例外時も State が解除される

### 根拠

`await` の前に確保し `await` の後に解放するリソースがある場合、例外発生時に解放処理に到達せずリソースがリークする。これは `lock/unlock`、`open/close`、`add/remove` すべてに共通するパターン。

### 適用シナリオ

- 削除中ルール ID を `deletingIds` で管理し、`deleteRule()` を `await` する場合: `try/finally` で `deletingIds` からの削除を保証する

## eslint-rule

ESLint化不可（State管理のパターンを文脈判断する必要があるため。PRレビューで確認）

---

## 6. テストケース配列のフィールド使用検証

### 規約

- `testCases.forEach()` パターンでテストケース配列を使用する場合、配列要素のすべてのプロパティ（`description` を除く）がテスト本体内で参照されていること
- データ駆動テストの目的は、テストケースごとに異なる入力・期待値を使うことにある。定義したフィールドを使わないテストはコピー&ペーストミスの兆候

### 禁止事項

- テストケース配列に `propertyName` 等のフィールドを定義しているが、テスト本体の `expect()` で使用せず、無関係な値を検証していること

### 許可事項

- テストケース配列に定義したフィールドを `expect()` 内で参照し、各ケースの差異がアサーションに反映されていること

### 根拠

テストケース配列のフィールドが未使用の場合、テストが意図した検証を行っていない可能性が高い。各テストケースの差異がアサーションに反映されなければ、配列化した意味がない。§3の型注釈ルールと組み合わせることで、型注釈で構造を保証し、本ルールで使用漏れを防ぐ二重チェックとなる。

### 適用シナリオ

- フックの戻り値のメソッド型検証テスト: `propertyName` フィールドを定義した場合、`result[testCase.propertyName]` の `typeof` を検証する

## eslint-rule

ESLint化不可（テスト配列のセマンティクスを静的解析で判定できないため。PRレビューで確認）

---

## 7. モック初期化・リセットの明示的呼び出し

### 規約

- `beforeEach` の先頭で `vi.clearAllMocks()` を呼び出すこと
- `afterEach` の末尾で `vi.resetAllMocks()` を呼び出すこと
- テストヘルパークラスの `setup()` / `cleanup()` 内に `vi.clearAllMocks()` / `vi.resetAllMocks()` を隠蔽しないこと

### 禁止事項

- テストヘルパーの `setup()` / `cleanup()` 内に `vi.clearAllMocks()` / `vi.resetAllMocks()` を配置すること: テストファイルを読んだだけではモック状態の初期化が行われているか判断できない

### 許可事項

- テストファイルの `beforeEach` / `afterEach` でモックリセットを明示的に呼び出し、テストヘルパーの `setup()` / `cleanup()` は DOM セットアップ・クリーンアップのみを担当すること

### 根拠

テストヘルパーの責務は DOM のセットアップ・クリーンアップであり、Vitest のモック状態管理はテストファイル側の責務である。モックリセットをヘルパー内部に隠蔽すると、テストファイルを読んだだけではモック状態の初期化が行われているか判断できず、レビュー時に見落としの原因となる。

### 適用シナリオ

- カスタムフックのテストで `UseDeleteRuleTestHelper` を使用する場合: `helper.setup()` は DOM 要素の作成のみを行い、`vi.clearAllMocks()` はテストファイルの `beforeEach` で明示的に呼び出す

## eslint-rule

ESLint化不可（`beforeEach` / `afterEach` 内の呼び出し有無を文脈判断する必要があるため。PRレビューで確認）
