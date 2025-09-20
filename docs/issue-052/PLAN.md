# 実装計画: issue-052-feat-replace-inside-dom-with-regex

## 概要

E2Eテスト `replace-inside-dom-with-regex.spec.ts` を通過するための正規表現によるDOM置換機能を実装する。

## 現状分析

### 既存実装の確認結果

1. **RewriteRule.ts**: `isRegex` フィールドが既に存在
2. **App.tsx**: 正規表現チェックボックスのUIが既に実装済み
3. **HtmlContent.ts**: 正規表現サポートが部分的に実装されている

### 問題の特定

`HtmlContent.ts` の `createRedundantPattern` メソッドで、正規表現パターンであっても改行コードを無視する変換（`<` → `\\s*<`、`>` → `>\\s*`）が適用されている。これにより、ユーザーが意図した正規表現パターンが変更されてしまう。

## E2Eテストの要求仕様

- **入力パターン**: `<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue">(.+?)</span></li>`
- **置換後**: `<li class="productInfo"><span class="category">ISBN</span>：&nbsp;&nbsp;<span class="categoryValue"><a href="https://www01.hanmoto.com/bd/isbn/$1">$1</a></span></li>`
- **期待結果**: キャプチャグループ `(.+?)` で取得した値（ISBN番号）が `$1` として正しく埋め込まれること

## 実装タスク

### 1. HtmlContent.ts の修正

**ファイル**: `src/domain/entities/HtmlContent.ts`

**修正内容**:
- `createRedundantPattern` メソッドで、`isRegex` が true の場合は元のパターンをそのまま返すように修正
- 正規表現の場合、改行コード無視の変換を適用しない

### 2. テストの実行と確認

**実行コマンド**:
```bash
npm run test:e2e -- replace-inside-dom-with-regex.spec.ts
```

### 3. 単体テストの追加

**ファイル**: `src/domain/entities/HtmlContent.test.ts` (新規作成)

**テスト内容**:
- 正規表現パターンでのキャプチャグループ置換
- 通常文字列での置換（既存機能の回帰テスト）

### 4. リント・テストの実行

```bash
npm run test-and-lint
```

## 予想される実装ポイント

### HtmlContent.ts の修正例

```typescript
private createRedundantPattern(pattern: string, isRegex: boolean): string {
  // 正規表現の場合は元のパターンをそのまま使用
  if (isRegex) {
    return pattern;
  }
  
  // 正規表現でない場合は特殊文字をエスケープして改行コード無視変換を適用
  const processedPattern = pattern.replace(/[.*+?^${}()|\\[\\]]/g, '\\\\$&');
  
  return processedPattern
    .replace(/</g, '\\\\s*<')
    .replace(/>/g, '>\\\\s*');
}
```

## リスク

1. **既存機能への影響**: 通常の文字列置換機能に影響しないよう注意
2. **正規表現の妥当性**: 不正な正規表現パターンに対するエラーハンドリング

## 受け入れ条件

- [x] E2Eテスト `replace-inside-dom-with-regex.spec.ts` が通過すること
- [x] 追加した単体テストが通過すること
- [x] `test-and-lint` コマンドでエラーが発生しないこと
- [x] 既存の文字列置換機能が正常に動作することを確認

## 次回以降のスクラムで対応する課題

- [x] E2Eテストでの複数aタグ問題の解決
  - E2Eテストで2つのaタグが見つかる問題の調査と修正 ✓
  - 置換処理が複数回実行される原因の特定と対処 ✓
- [x] E2Eテストの完全通過
  - `replace-inside-dom-with-regex.spec.ts`の全ての検証項目の通過 ✓
- [x] redundantPatternのリファクタリング、適切なdomainクラスへの移動
- [ ] regex関係の定数クラス作成
