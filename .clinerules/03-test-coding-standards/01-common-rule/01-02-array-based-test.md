workflow-array-based-test
### 1.2 配列ベースのテスト
類似のテストケースは配列で管理し、専用ファイルに切り出す：

**手順:**
1. 類似する複数の個別テストケースを特定
2. 配列形式でテストケースを定義
3. 新しい専用ファイルに切り出す
4. 元のファイルから該当テストケースを削除
5. 入力値は input:{hoge: 'hoge'}, 期待値は expected:{hoge: 'moge'} のようにまとめる
6. テストをまとめた配列は、1ファイルに1つとし、それ以外のテストケースは別ファイルに切り出す

```typescript
const testCases = [
  {
    description: 'Chromeでundefinedが返るケース1',
    input: { /* 入力値 */ },
    expected: { /* 期待値 */ },
  },
  {
    description: 'Chromeでundefinedが返るケース2',
    input: { /* 入力値 */ },
    expected: { /* 期待値 */ },
  },
  // 他のケースも同様に追加
];

testCases.forEach((testCase) => {
  it(testCase.description, async () => {
    // 統一されたテストロジック
  });
});
```

**ファイル切り出しの利点:**
- 類似テストケースの一元管理
- 配列ベースによる保守性向上
- テストファイルの責務の明確化
- 新しいケース追加時の効率化

### 規約
- 下記の場合は無理な配列化は行わない
  - Actが異なる場合
  - 入力値/期待値の構造や型が異なる場合
  - その他 `testCases.forEach` の中でif文が必要になる場合。
    - if文が必要ということはarrange/act/assertの手法が異なるので、テストファイルを分けること
- JSDoc
  - 配列化したテストケース群のJSDocは日本語で記述し、配列内の`description`は必ず一致させること