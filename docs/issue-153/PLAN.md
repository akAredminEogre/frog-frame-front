# Issueの計画

# DAILY-SCRUM単位のタスク
- ISSUE.mdを元に、開発タスクをデイリースクラム単位に分解する
- [x] issue-147の成果と現在のコードベースの差分を調査
  - issue-147で実装予定だったコンポーネント構造の確認
  - インフラ・アーキテクチャの変更点の把握
  - 現在のRulesApp.tsxとその関連コンポーネントの状態確認
- [x] RulesTable、EmptyStateMessageコンポーネントの実装
  - Organism層としてRulesTable, EmptyStateMessageを作成
- [x] RuleTableRow、LoadingMessage、ErrorMessageコンポーネントの実装
  - Molecule層としてRuleTableRow, LoadingMessage, ErrorMessageを作成
- [x] RulesApp.tsxのリファクタリング
  - 作成したコンポーネントを使用してRulesApp.tsxを再構成
  - Clean Architecture原則に従った実装
- [x] Storybookの作成
  - 分割したコンポーネントのStoryを作成
  - 各状態やパターンのストーリーを網羅
- [ ] 最終確認とリファクタリング
  - コードレビューと最適化
  - make testlintの実行と修正

# ISSUEを通した相談事
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->
<!-- について、体言止めでの相談ではなににどう答えればよいのか明確にならないので使わないでください-->
<!-- 相談は具体的な内容を記載してください。 -->
<!-- 質問は不明点を明確に記載してください。 -->
<!-- レビューしてほしいことは、レビュー対象を具体的に記載してください。 -->
<!-- また上記相談・質問・レビューのトピックが重複する場合は、まとめて記載してください。 -->

# 残タスク
<!-- issueの進捗に応じて記入 -->

# 本issueの対象外とする課題
<!-- issueの進捗に応じて記入 -->