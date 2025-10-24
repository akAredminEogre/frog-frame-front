# 振り返り

このファイルでデイリースクラムの振り返りを行います。追記専用です。過去の内容を修正しないでください。
追記のときは最後尾に追加してください。

## スクラム01 の振り返り

### Keep
- `node --trace-deprecation` を使った問題箇所の特定方法が効果的でした
- 問題の根本原因（`http-server` → `union` パッケージの依存関係）を正確に特定できました
- 代替パッケージ（`serve`）の評価を事前に行い、非推奨API警告が出ないことを確認してから実装しました
- 変更後に `make testlint` で全テスト（276件の単体テスト + 12件のE2Eテスト）が成功し、副作用がないことを確認できました

### Problem
- 最初は `http-server` の最新版でも問題が残っていることに気づくまで少し時間がかかりました
- 依存パッケージの深い階層（`http-server` → `union` → `response-stream.js`）の問題だったため、直接修正できませんでした

### Try
- 次回からは、npxで使用しているパッケージの依存関係も事前に確認するようにします
- 非推奨API警告が出た場合は、まず `--trace-deprecation` で原因を特定してから対策を検討します

---
<!-- ユーザーが使うコマンド workflow-commit-daily-scrum -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-commit-daily-scrum-then-start-next-daily-scrum.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-commit-daily-scrum-then-create-pr.md -->
