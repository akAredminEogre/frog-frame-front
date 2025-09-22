# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=05
実装が完了したらPROGRESS-05.mdを追記してコードレビューを依頼してください
## スクラム-05(03回目) の進捗
<!-- ここに進捗を記載 -->

### 実装内容
- `HtmlContent.test.ts`を`workflow:array-based-test`に準拠させる修正を実施
- 配列ベースのテスト形式にリファクタリング
- 類似テストケースを専用ファイルに分割・切り出し

### 修正したファイル

#### テストファイル分割（2件新規作成、1件削除）
- `host-frontend-root/frontend-src-root/tests/unit/HtmlContent/regex-pattern-replacement.test.ts` (新規作成)
  - 正規表現パターンでのキャプチャグループ置換テスト専用ファイル
  - `input/expected`形式で配列ベースのテストに準拠
- `host-frontend-root/frontend-src-root/tests/unit/HtmlContent/string-pattern-replacement.test.ts` (新規作成)
  - 通常文字列での置換テスト専用ファイル
  - `input/expected`形式で配列ベースのテストに準拠
- `host-frontend-root/frontend-src-root/tests/unit/HtmlContent.test.ts` (削除)
  - 元の統合テストファイルを削除（テストケースは上記2ファイルに移動）

**合計3ファイル操作（2ファイル新規作成、1ファイル削除）**

### 次回以降のスクラムに先送りする課題
<!-- 本issueで解決するが、本スクラムでは取り扱わない課題 -->

特になし

### 本issueの対象外とする課題

特になし

### スクラム-05(03回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド workflow:see-and-commit-review-comment-then-code-again -->
- `host-frontend-root/frontend-src-root/tests/unit/HtmlContent/regex-pattern-replacement.test.ts` 
- `host-frontend-root/frontend-src-root/tests/unit/HtmlContent/string-pattern-replacement.test.ts`
  - どちらも、RewriteRuleに使われる値は、input: { rewriteRule: {id: 'testid'} }、のようRewriteRuleに準拠する形にまとめてください
  - assertionTypeはexpect(result).toBe(expected)に統一してください
---
