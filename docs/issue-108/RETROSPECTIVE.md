# 振り返り

このファイルでデイリースクラムの振り返りを行います。追記専用です。過去の内容を修正しないでください。
追記のときは最後尾に追加してください。

## スクラム02 の振り返り
<!-- KPT法で振り返りを行なってください -->

### Keep
<!-- うまく行ったこと、続けていきたいこと -->

- Clean Architectureの原則に従い、Domain層に`TabUrl`値オブジェクトを配置してURLフィルタリングロジックを実装できた
- コードレビューを受けて`CanInjectContentScript`を`TabUrl`に統合し、コードの凝集度を高めることができた
- テストファースト開発を実践し、合計13テストケースで網羅的にテストを実施できた
- `make test-and-check`を実行して品質を確認しながら進められた
- リファクタリングによって、`tabUrl.canInjectContentScript()`という直感的で読みやすいAPIになった

### Problem
<!-- 問題点、苦労したこと、レビューで指摘を受けたこと -->

- 初回実装で値オブジェクトの責務分担が最適でなく、レビューで修正が必要になった
  - `CanInjectContentScript`を独立させるよりも`TabUrl`に統合する方が自然だった
- 値オブジェクトの設計において、関連する機能をどこまで1つのクラスに集約すべきかの判断が難しかった
- ThoughtWorks Anthologyの「最大2つのインスタンス変数」ルールと、機能の凝集度のバランスを取る必要があった

### Try
<!-- 次回やってみたいこと -->
<!-- タスクベースではなく、行動ルールとして記載してください。 -->

- 値オブジェクトを設計する際は、「このクラスがどんな責務を持つべきか」を先に考え、関連する機能は最初から同じクラスに配置する
- コードレビュー前に、既存の関連クラスに統合できないか自己レビューする習慣をつける
- Clean Architectureの原則とOOPの原則の両方を満たす設計を最初から意識する

---
<!-- ユーザーが使うコマンド workflow-commit-daily-scrum -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-commit-daily-scrum-then-start-next-daily-scrum.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-commit-daily-scrum-then-create-pr.md -->
