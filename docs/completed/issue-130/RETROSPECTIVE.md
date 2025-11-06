# 振り返り

このファイルでデイリースクラムの振り返りを行います。追記専用です。過去の内容を修正しないでください。
追記のときは最後尾に追加してください。

## スクラム01 の振り返り
<!-- KPT法で振り返りを行なってください -->

### Keep
<!-- うまく行ったこと、続けていきたいこと -->
- ディレクトリのリネーム作業が効率的に実行できた
- 全てのインポートパスを漏れなく修正できた
- テストを実行して変更の正確性を確認できた
- 事前に影響範囲を適切に調査できた（grepを使った全ファイル検索）
- バッチ処理（sedコマンド）を活用して複数ファイルの一括修正ができた

### Problem
<!-- 問題点、苦労したこと、レビューで指摘を受けたこと -->
- 一つの文字列エラーメッセージ内の`persistance`を見落とした（normal-cases.test.ts内）
- 最初のgrep検索で88ファイルがヒットしたため、多くがドキュメントファイルであることに気づくのに時間がかかった

### Try
<!-- 次回やってみたいこと -->
<!-- タスクベースではなく、行動ルールとして記載してください。 -->
- 文字列の一括置換作業では、コード内だけでなくコメントやエラーメッセージ内の記述も確認する
- grep結果を種類別（ソースコード/テスト/ドキュメント）に分類してから作業する

---
<!-- ユーザーが使うコマンド workflow-commit-daily-scrum -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-commit-daily-scrum-then-start-next-daily-scrum.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-commit-daily-scrum-then-create-pr.md -->