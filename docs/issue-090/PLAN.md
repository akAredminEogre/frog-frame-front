# Issueの計画

# DAILY-SCRUM単位のタスク
- ISSUE.mdを元に、開発タスクをデイリースクラム単位に分解する
- [x] .clinerulesの重要なルールを特定（相談結果：02-workflow-automation, 03-test-coding-standards/, 03-test-coding-standards.md, 01-coding-standards.md）
- [x] CLAUDE.mdファイルを作成し、プロジェクト固有のルールとガイドラインを記載する
  - プロジェクト概要（日本語対応を含む）
  - 開発コマンド（CRITICAL: test-and-lintの必須実行を強調）
  - アーキテクチャ概要
  - インポートパスルール
  - オブジェクト指向設計ルール（ThoughtWorksアンソロジーの9原則）
  - テスト要件
  - WXTフレームワーク固有の情報
  - Gitワークフロー
  - トラブルシューティング
  - **CLAUDE.mdから.clinerulesへの参照方法を明記**
- [ ] CLAUDE.mdの内容をレビューし、必要に応じて調整する
- [ ] 動作確認：claude codeがCLAUDE.mdを参照してタスクを実行できることを確認

# ISSUEを通した相談事
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->
<!-- について、体言止めでの相談ではなににどう答えればよいのか明確にならないので使わないでください-->
<!-- 相談は具体的な内容を記載してください。 -->
<!-- 質問は不明点を明確に記載してください。 -->
<!-- レビューしてほしいことは、レビュー対象を具体的に記載してください。 -->
<!-- また上記相談・質問・レビューのトピックが重複する場合は、まとめて記載してください。 -->

## CLAUDE.mdの記載内容について
- .clinerulesの中でも特に重要で、claude codeが常に意識すべきルールは何か？
  - 02-workflow-automation
  - .clinerules/03-test-coding-standards
  - .clinerules/03-test-coding-standards.md
  - .clinerules/01-coding-standards.md
- claude codeのコンテキストウィンドウサイズを考慮して、どの程度詳細に記載すべきか？
  - それについてはプロジェクトを進行する中で調整していく
  - むしろCLAUDE.mdから、.clinerulesの中身を参照できることのほうが大事
- .clinerulesとの役割分担をどう考えるべきか（CLAUDE.mdは概要、.clinerulesは詳細、など）
  - 現時点ではご指摘の通り、CLAUDE.mdは概要、.clinerulesは詳細と考えるのが良いと思います。
  - それよりも、CLAUDE.mdを通して、claude codeが.clinerulesの内容を参照できることが重要です。
- 追加
  - Claude codeに日本語で指示できること、Claude codeが日本語で回答できるようにすること

# 残タスク
<!-- issueの進捗に応じて記入 -->
