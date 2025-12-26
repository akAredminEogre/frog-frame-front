# 配列ベースのテスト

類似のテストケースは配列で管理し、専用ファイルに切り出す。
ユニットテスト、結合テスト、E2Eテストすべてに適用される。

---

## 手順

1. 類似する複数の個別テストケースを特定
2. 配列形式でテストケースを定義
3. 新しい専用ファイルに切り出す
4. 元のファイルから該当テストケースを削除
5. 入力値は `input: { hoge: 'hoge' }`、期待値は `expected: { hoge: 'moge' }` のようにまとめる
6. テストをまとめた配列は、1ファイルに1つとし、それ以外のテストケースは別ファイルに切り出す

---

## コード例（ユニットテスト）

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

---

## コード例（E2Eテスト）

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

---

## 利点

- 類似テストケースの一元管理
- 配列ベースによる保守性向上
- テストファイルの責務の明確化
- 新しいケース追加時の効率化

---

## 規約

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

---

## eslint-rule

ESLint化不可（配列ベースかどうかは静的解析で判定困難。PRレビューで確認）
