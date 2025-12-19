## 2. JSDocと実装の一致性

### 2.1 JSDocの更新義務
テスト内容を変更した場合、JSDocコメントも必ず更新：

```typescript
/**
 * Chrome Storage APIの正しい呼び出し、正常解決、Promise型確認を統合的にテスト
 */
describe('SelectedPageTextService.setSelectedPageText - 正常系', () => {
  // 実装がJSDocの説明と一致していること
});
```

### 2.2 JSDoc記述原則
- 1ケースにつき1行でまとめる
- テストの実際の動作を正確に説明
  - 入出力値とそこから考えられるテストの目的
- 抽象的な表現を避け、具体的な検証内容を記述

#### 例
```typescript
/**
 * 1. 空文字列の保存処理
 * 2. 特殊文字・Unicodeの保存処理
 * 3. 長文テキストの保存処理
 * 4. 改行・制御文字の保存処理
 */
describe('SelectedPageTextService.setSelectedPageText - エッジケース', () => {
  // 各ケースの実装
});
```

### 2.3 配列ベーステストのJSDoc
配列化したテストケース群では、JSDocの各行が配列内の`description`と一致すること。
番号付きリスト形式で記述してよい。

```typescript
/**
 * RewriteRule.withActive - 正常系テスト（isActive状態変更）
 * 1. isActive=true のルールを false に変更できる
 * 2. isActive=false のルールを true に変更できる
 * 3. 同じ値(true)を設定しても新しいインスタンスが返される
 * 4. 同じ値(false)を設定しても新しいインスタンスが返される
 */

const testCases = [
  {
    description: 'isActive=true のルールを false に変更できる',  // JSDocの1と一致
    ...
  },
  {
    description: 'isActive=false のルールを true に変更できる',  // JSDocの2と一致
    ...
  },
  // 以下同様
];
```