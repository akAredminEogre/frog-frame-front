# ISSUE-068 PULL REQUEST

## タイトル
RewriteRuleのurlPattern必須化とテストコード品質向上リファクタリング

## 概要と理由
RewriteRuleのurlPatternプロパティを必須化し、テストコードの保守性を向上させる。現在urlPatternはオプショナルプロパティとして定義されているが、実際には全てのRewriteRuleで必要となるため、型定義を必須に変更する。併せて、array-based-testルールを適用してテストコードの品質を向上させる。

## 主な変更点

### 1. RewriteRuleのurlPattern必須化
- RewriteRule.tsで`urlPattern?: string` → `urlPattern: string`に変更
- 関連テストファイル10個でurlPatternパラメータを追加（空文字列""を設定）

### 2. HtmlContent関連テストの整理
- array-based-testルール適用（input/expected構造）
- テストファイルを3つに分離：
  - normal-cases.test.ts（正常系基本テスト - 3ケース）
  - regex-rule.test.ts（正規表現ルールテスト - 6ケース）
  - edge-cases.test.ts（エッジケーステスト - 1ケース）
- JSDocコメント追加
- HtmlContentディレクトリを作成して移動

### 3. HtmlReplacer関連テストの整理
- array-based-testルール適用（input/expected構造）
- RewriteRuleの共通値をまとめて効率化
- テストファイルを2つに分離：
  - normal-cases.test.ts（通常のテストケース - 12ケース）
  - regex-pattern.test.ts（正規表現パターンのテスト - 3ケース）
- HtmlReplacerディレクトリを作成して移動

### 4. RewriteRule/createRedundantPatternテストの共通値整理
- regex-pattern.test.ts、string-pattern.test.tsにおいて
- テストケースに関係のない共通値（id, newString, urlPattern等）をベタ書きに変更
- テストケースの配列がより見やすく、保守性が向上

### 5. テストコーディング標準の更新
- .clinerules/03-test-coding-standards/01-common-rule/02-array-based-test.mdを更新

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認

## 本スコープの対象外となったタスク
なし（予定していた全タスクを完了）

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
