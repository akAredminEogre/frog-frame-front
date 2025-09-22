# ISSUE-052 PULL REQUEST

## タイトル
正規表現によるDOM置換機能の実装とRegex定数クラスの追加

## 概要と理由
E2Eテスト `replace-inside-dom-with-regex.spec.ts` を通過するための正規表現によるDOM置換機能を実装しました。既存のUIには正規表現チェックボックスが実装されていましたが、バックエンド処理で正規表現パターンの改行コード無視変換が適用されており、ユーザーが意図した正規表現（特にキャプチャグループ）が正しく動作しない問題がありました。

また、プロジェクト全体の保守性向上のため、散在していた正規表現パターンとマジックナンバーを統一的に管理するRegex定数クラスを新規作成し、既存コードのリファクタリングを実施しました。

## 主な変更点
### 正規表現機能実装
- **HtmlContent.ts**: 正規表現パターンの場合、改行コード無視変換をスキップするよう修正
- **RegexConstants.ts**: 正規表現パターンと特殊文字エスケープ用定数クラスを新規作成
- **StringPatternProcessingStrategy.ts**: 特殊文字エスケープ処理をRegexConstants使用に変更
- **RewriteRule.ts**: HTML要素間改行コード無視処理をRegexConstants使用に変更
- **RegexConstants.test.ts**: 包括的な単体テスト追加（各定数の値と動作確認）
- **複数テストファイル**: 新機能に対応する単体テスト追加
- **e2eテストの改善**: 
  - 拡張機能が出しているコンソールエラーを検知
  - タイムアウト時間を変更

### ファイル構造のリファクタリング（daily-scrum-05実施）
- **RewriteRule関連ファイルの再構成**: 
  - `RewriteRule.ts` → `RewriteRule/RewriteRule.ts`に移動
  - 関連するStrategy関連ファイルをRewriteRule/配下に移動
  - import文の調整（全21ファイル）

### テストファイルの標準準拠（daily-scrum-05実施）
- **.clinerules/03-testing-standards準拠**: 
  - テストの配列化とJSDocコメントの追加
  - `createRedundantPattern.test.ts`の正規表現パターンと文字列パターンでのファイル分割
  - `HtmlContent.test.ts`の配列ベースのテストへの分割
  - テストデータ構造の統一（RewriteRuleコンストラクタパラメータに準拠）
  - assertionTypeの統一（expect(result).toBe(expected)）
  - パラメータ名の統一（searchPattern → oldString, replacePattern → newString）
  - 繰り返し使用されるHTML文字列の定数化

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run unused:safe` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認
- E2Eテスト `replace-inside-dom-with-regex.spec.ts` の通過確認
- 全単体テスト通過（209テスト）
- 全E2Eテスト通過（6テスト）
- リンターとknipのチェック通過

## 補足
正規表現機能の実装において、以下の技術的ポイントがあります：
- キャプチャグループ `(.+?)` で取得した値がプレースホルダー `$1` として正しく埋め込まれること
- 既存の通常文字列置換機能への影響がないこと
- 定数クラスによりマジックナンバーや文字列リテラルが排除され、保守性が大幅に向上

## 本スコープの対象外となったタスク
なし（issue-052の全タスクが完了）
