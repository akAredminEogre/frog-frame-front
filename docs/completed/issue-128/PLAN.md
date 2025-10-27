# Issueの計画

# DAILY-SCRUM単位のタスク
- ISSUE.mdを元に、開発タスクをデイリースクラム単位に分解する
- [x] 右クリック選択メニューのロジックの統合作業
  - [x] ISelectedPageTextServiceの内容をISelectedPageTextRepositoryに移動
    - [x] `src/application/ports/ISelectedPageTextService.ts`の内容を確認
    - [x] `src/application/ports/ISelectedPageTextRepository.ts`に内容を統合
    - [x] ISelectedPageTextServiceファイルを削除
  - [x] infrastructure層のSelectedPageTextServiceの統合
    - [x] `src/infrastructure/persistance/storage/SelectedPageTextService.ts`の内容を確認
    - [x] `src/infrastructure/persistance/storage/SelectedPageTextRepository.ts`に内容を統合
    - [x] SelectedPageTextServiceファイルを削除
  - [x] SelectedPageTextRepositoryの移動
    - [x] `src/infrastructure/storage/SelectedPageTextRepository.ts`を`src/infrastructure/persistance/storage/SelectedPageTextRepository.ts`に移動
  - [x] 参照の修正
    - [x] import文の修正
    - [x] DI containerの修正
    - [x] その他参照している箇所の修正
  - [x] テストの実行と動作確認
    - [x] `make testcheck`でテスト通過を確認
    - [x] 機能が正常に動作することを確認
- [x] 次回以降のスクラムに先送りする課題（完了）
  - [x] SelectionServiceの削除（ISSUE.mdの残タスク）→次回対応予定
  - [x] HandleContextMenuReplaceDomElementのテストを変更したリポジトリに合わせて修正

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