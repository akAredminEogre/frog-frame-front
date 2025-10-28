# Issueの計画

# DAILY-SCRUM単位のタスク
- ISSUE.mdを元に、開発タスクをデイリースクラム単位に分解する
- [x] SelectionServiceのリファクタリング作業
  - [x] 現在のSelectionServiceの内容を確認
    - [x] `src/infrastructure/selection/SelectionService.ts`の実装内容を確認
    - [x] 使用している箇所を特定
  - [x] application層にインターフェースを追加
    - [x] `src/application/ports/IGetSelectionService.ts`を作成
    - [x] 適切なメソッドシグネチャを定義
  - [x] infrastructure層に新しい実装を作成
    - [x] `src/infrastructure/windows/getSelectionService.ts`を作成
    - [x] SelectionServiceの機能を新しいファイルに移植
    - [x] IGetSelectionServiceインターフェースを実装
  - [x] 依存関係の修正
    - [x] 既存のSelectionServiceを使用している箇所を特定
    - [x] 新しいインターフェースを使用するように修正
    - [x] DIコンテナの設定を更新
  - [x] 旧ファイルの削除と整理
    - [x] `src/infrastructure/selection/SelectionService.ts`を削除
    - [x] 空になったselectionディレクトリを削除
    - [x] import文の修正
  - [x] テストの更新と動作確認
    - [x] 関連するテストファイルの修正
    - [x] `make testcheck`でテスト通過を確認
    - [x] 機能が正常に動作することを確認

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