frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-start-coding-according-to-daily-scrum.md

cline-instructionsの手順をチャットスレッドに表示してから実行してください。
その中で別のworkflowに従うと指示されてる場合は、その手順も検索・確認して再帰的にチャットスレッドに表示してください
手順を全体を表示してから、その表示した手順に従って実行してください

```cline-instructions
- 下記の内容で採番を行う
  - nnn=(カレントブランチ名からissue番号を取得)
  - kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)

- デイリースクラム開始時ドキュメントのコミット
  - 対象：docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md
  - コミットメッセージ
    - docs: デイリースクラムkk回目開始時のドキュメント
    - 他のファイルの無許可コミットを禁止する

- DAILY_SCRUM-kk.mdに応じたコーディング修正
  - 修正したファイルでも、許可なくコミットしないこと
  - 参照すべきドキュメント
    - docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md
  - コーディングにおけるルール、規約
    - workflow-code-according-to-the-rules
    - に必ず準拠すること

- 実装完了後の処理
  - 修正したファイルでも、許可なくコミットしないこと
  - 下記のワークフローに従って進捗をまとめてください
    - workflow-record-progress

```