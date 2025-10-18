workflow-array-based-test
### 1.2 配列ベースのテスト
類似のテストケースは配列で管理し、専用ファイルに切り出す：

**手順:**
1. 類似する複数の個別テストケースを特定
2. 配列形式でテストケースを定義
3. 新しい専用ファイルに切り出す
4. 元のファイルから該当テストケースを削除
5. 入力値は input:{hoge: 'hoge'}, 期待値は expected:{hoge: 'moge'} のようにまとめる
6. テストをまとめた配列は、1ファイルに1つとする。

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
