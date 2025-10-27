# Issueの計画

# DAILY-SCRUM単位のタスク
- ISSUE.mdを元に、開発タスクをデイリースクラム単位に分解する
- [x] content.tsのリファクタリング実装
  - chrome.runtime.onMessage.addListenerのロジックを関数に分割
  - background.tsと同様のパターンでリスナー登録関数を作成
  - src/infrastructure/browser/listeners/配下に新規ファイル作成
  - 既存の動作を保持したままリファクタリング
  - メッセージルーターパターンを導入し、さらに分割
  - 依存性注入の最適化を実施
- [x] テストの実装・更新
  - infrastructure/listeners/ は Optional なのでスキップ
  - 既存テストはすべて成功 (267 unit tests + 12 E2E tests)
- [x] make testlintでの検証
  - すべてのテスト・リント・未使用コード検出をパス
- [x] content.ts関係のファイルの配置を検討
  - content.ts関係のファイルを、entrypoints/content配下にパッケージとしてまとめることが、Clean Architecture、DDDの観点から適切か検討する
  - 結論: 現在の配置 (src/infrastructure/browser/) を維持し、命名規則を強化
  - 理由: Clean Architectureの依存性ルール、WXT規約、background.tsとの一貫性
  - 実施: content関連ファイルに content. 接頭辞を適用してグルーピングを明確化
    - runtime.onMessage.content.ts → content.runtime.onMessage.ts
    - messageRouter.content.ts → content.messageRouter.ts
    - messageHandlers.content.ts → content.messageHandlers.ts
- [x] PR指摘事項
  - [x] content.messageRouter.tsと、messageRouter(既存のbackground.ts関連のもの)はほぼ同じコードであるが、このWETは許容できるものなのか検討する
    - Clean Architecture、DDDの観点から同一したほうが良いのか。それとも実装部分は共通しながら、それぞれのクラスから呼び出す形が良いのか、
    - Chrome Extension開発の観点からmessageRounterは、content用、background用両方が使うものでも一つに集約したほうが良いのか
    - 結論: 現在の分離アーキテクチャを維持
    - 理由: DDD境界コンテキスト原則、Clean Architecture文脈分離、Chrome Extension セキュリティベストプラクティスに準拠
- [x] ディレクトリ構造の改善
  - content関連ファイルのディレクトリ分離と接頭辞からディレクトリへの移行実施
  - router/content/, handlers/content/ による一貫性のある構造を実現
  - 段階的改善アプローチによる部分的アーキテクチャ改善

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
background関連ファイルのディレクトリ整理（別issueで実施予定）
