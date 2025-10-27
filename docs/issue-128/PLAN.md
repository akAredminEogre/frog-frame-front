# Issueの計画

# DAILY-SCRUM単位のタスク
- ISSUE.mdを元に、開発タスクをデイリースクラム単位に分解する
- [ ] 右クリック選択メニューのロジックの統合作業
  - [ ] ISelectedPageTextServiceの内容をISelectedPageTextRepositoryに移動
    - [ ] `src/application/ports/ISelectedPageTextService.ts`の内容を確認
    - [ ] `src/application/ports/ISelectedPageTextRepository.ts`に内容を統合
    - [ ] ISelectedPageTextServiceファイルを削除
  - [ ] infrastructure層のSelectedPageTextServiceの統合
    - [ ] `src/infrastructure/persistance/storage/SelectedPageTextService.ts`の内容を確認
    - [ ] `src/infrastructure/persistance/storage/SelectedPageTextRepository.ts`に内容を統合
    - [ ] SelectedPageTextServiceファイルを削除
  - [ ] SelectedPageTextRepositoryの移動
    - [ ] `src/infrastructure/storage/SelectedPageTextRepository.ts`を`src/infrastructure/persistance/storage/SelectedPageTextRepository.ts`に移動
  - [ ] 参照の修正
    - [ ] import文の修正
    - [ ] DI containerの修正
    - [ ] その他参照している箇所の修正
  - [ ] SelectionServiceの削除
    - [ ] `src/infrastructure/selection/SelectionService.ts`を削除
    - [ ] 関連する参照の削除・修正
  - [ ] テストの実行と動作確認
    - [ ] `make testcheck`でテスト通過を確認
    - [ ] 機能が正常に動作することを確認

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