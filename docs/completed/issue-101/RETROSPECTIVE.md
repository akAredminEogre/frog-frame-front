# 振り返り

このファイルでデイリースクラムの振り返りを行います。追記専用です。過去の内容を修正しないでください。
追記のときは最後尾に追加してください。

## スクラム02 の振り返り
<!-- KPT法で振り返りを行なってください -->

### Keep
<!-- うまく行ったこと、続けていきたいこと -->

- Clean Architectureの原則に従った設計ができ、適切な層間分離を実現できた
- レビューフィードバックを受けて、より良い設計に改善できた（特にプリミティブ型 vs 値オブジェクトの使い分け）
- 段階的なリファクタリングにより、コードの品質を継続的に向上させることができた
- コードレビューを通じて、Clean Architectureの深い理解を得られた
- 包括的なユニットテストを作成し、リファクタリング時の安全性を確保できた

### Problem
<!-- 問題点、苦労したこと、レビューで指摘を受けたこと -->

- 初回実装時に、Application層からPresentation層への戻り値として値オブジェクトを使用したが、実際にはプリミティブ型の方が適切だった
- 冗長な三項演算子やnullチェックが残ってしまい、コードの簡潔性を損なった
- 設計判断において、「値オブジェクト vs プリミティブ型」の使い分け基準を最初から明確にできていなかった

### Try
<!-- 次回やってみたいこと -->
<!-- タスクベースではなく、行動ルールとして記載してください。 -->

- 実装前に、層間のデータ転送において値オブジェクトとプリミティブ型のどちらが適切かを事前に検討する
- レビューフィードバックをより積極的に活用し、設計の改善点を早期に特定する
- Clean Architectureの設計パターンについて、実装前により深く検討する時間を設ける

---
<!-- ユーザーが使うコマンド workflow-commit-daily-scrum -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-commit-daily-scrum-then-start-next-daily-scrum.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-commit-daily-scrum-then-create-pr.md -->