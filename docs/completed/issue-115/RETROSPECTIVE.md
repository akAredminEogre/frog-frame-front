# 振り返り

このファイルでデイリースクラムの振り返りを行います。追記専用です。過去の内容を修正しないでください。
追記のときは最後尾に追加してください。

## スクラム01 の振り返り
<!-- KPT法で振り返りを行なってください -->

### Keep
<!-- うまく行ったこと、続けていきたいこと -->

- プロダクションコード内での使用箇所を徹底的に調査してから削除を実行したこと
  - 6ファイルでのインポート箇所を確認し、実際に使用されているのは `toArray()` メソッドのみであることを正確に把握できた
- テストコードの修正を慎重に行ったこと
  - `toObject()` を `toArray()` に、`RewriteRules.getById()` を `repository.getById()` に適切に置き換えた
- 削除前後でmake testlintによる包括的な検証を実施したこと
  - 全テスト通過（276ユニットテスト + 12 E2Eテスト）を確認
  - knip警告が完全に解消されたことを確認

### Problem
<!-- 問題点、苦労したこと、レビューで指摘を受けたこと -->

- 最初のmake testlint実行でDexieRewriteRuleRepositoryのテストが失敗したこと
  - `RewriteRules.getById()` を使用している箇所が残っていた
  - Repository自体が独自の `getById()` メソッドを持っているため、そちらを使用すべきだった
- テストコードでの依存関係の理解に時間を要したこと
  - どのメソッドがテスト専用で、どのメソッドがプロダクションコードで使われているかの判別

### Try
<!-- 次回やってみたいこと -->
<!-- タスクベースではなく、行動ルールとして記載してください。 -->

- メソッド削除前に、そのメソッドを使用しているすべての箇所（プロダクションコード・テストコード両方）を一覧化する
- Repositoryパターンを使用している場合、ドメインオブジェクトとRepositoryの責務分離を意識した設計を心がける
- knipやTypeScriptコンパイラのエラーメッセージを先読みして、影響範囲を事前に予測する習慣をつける

---
<!-- ユーザーが使うコマンド workflow-commit-daily-scrum -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-commit-daily-scrum-then-start-next-daily-scrum.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-commit-daily-scrum-then-create-pr.md -->
