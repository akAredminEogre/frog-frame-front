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

### 配置例

| モック対象クラス | モックファイル配置先 |
|------------------|---------------------|
| `src/frameworks-and-drivers/browser/ChromeTabsGateway/` | `tests/frameworks-and-drivers/browser/ChromeTabsGateway/` |
| `src/infrastructure/persistence/indexeddb/` | `tests/infrastructure/persistence/indexeddb/` |

### 禁止事項

- テスト固有のディレクトリ（例: `tests/integration/{feature}/mocks/`）にモックを配置すること
- モック対象クラスのディレクトリ構造と異なる場所に配置すること

### 許可事項

- 複数のテストから共有されるモックは、モック対象クラスに対応するtestsディレクトリに配置

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

## 4. 配列ベースのテスト

類似のテストケースは配列で管理し、専用ファイルに切り出す。
ユニットテスト、結合テスト、E2Eテストすべてに適用される。

### 手順

1. 類似する複数の個別テストケースを特定
2. 配列形式でテストケースを定義
3. 新しい専用ファイルに切り出す
4. 元のファイルから該当テストケースを削除
5. 入力値は `input: { hoge: 'hoge' }`、期待値は `expected: { hoge: 'moge' }` のようにまとめる
6. テストをまとめた配列は、1ファイルに1つとし、それ以外のテストケースは別ファイルに切り出す

### コード例（ユニットテスト）

```typescript
interface TestCase {
  description: string;
  input: { /* 入力値の型 */ };
  expected: { /* 期待値の型 */ };
}

const testCases: TestCase[] = [
  {
    description: 'ケース1の説明',
    input: { /* 入力値 */ },
    expected: { /* 期待値 */ },
  },
  {
    description: 'ケース2の説明',
    input: { /* 入力値 */ },
    expected: { /* 期待値 */ },
  },
];

testCases.forEach((testCase) => {
  it(testCase.description, async () => {
    // 統一されたテストロジック
  });
});
```

### コード例（E2Eテスト）

```typescript
interface ToggleTestCase {
  name: string;
  testDataId: string;
  initialState: boolean;
  expectedState: boolean;
}

const testCases: ToggleTestCase[] = [
  {
    name: '有効なルールを無効に切り替えられる',
    testDataId: 'A',
    initialState: true,
    expectedState: false,
  },
  {
    name: '無効なルールを有効に切り替えられる',
    testDataId: 'B',
    initialState: false,
    expectedState: true,
  },
];

testCases.forEach(({ name, testDataId, initialState, expectedState }) => {
  test(name, async ({ page, popupPage, rulesPage }) => {
    // 統一されたテストロジック
  });
});
```

### 利点

- 類似テストケースの一元管理
- 配列ベースによる保守性向上
- テストファイルの責務の明確化
- 新しいケース追加時の効率化

### 規約

- 下記の場合は無理な配列化は行わない
  - Actが異なる場合
  - 入力値/期待値の構造や型が異なる場合
  - その他 `testCases.forEach` の中でif文が必要になる場合
    - if文が必要ということはarrange/act/assertの手法が異なるので、テストファイルを分けること
- テスト用配列
  - inputについて
    - JSDocにかかれているテスト観点に関係のないinputの値は共通化し、forEach内で設定すること
- JSDoc
  - 配列化したテストケース群のJSDocは日本語で記述し、配列内の`description`または`name`は必ず一致させること

## eslint-rule

ESLint化不可（配列ベースかどうかは静的解析で判定困難。PRレビューで確認）
