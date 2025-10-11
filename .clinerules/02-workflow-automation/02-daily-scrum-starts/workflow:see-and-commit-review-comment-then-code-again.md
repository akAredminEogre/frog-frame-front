favorite-keyword-link-frog/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-and-commit-review-comment-then-code-again.md


cline-instructionsの手順をチャットスレッドに表示してから実行してください。
その中で別のworkflowに従うと指示されてる場合は、その手順も検索・確認して再帰的にチャットスレッドに表示してください
手順を全体を表示してから、その表示した手順に従って実行してください

```cline-instructions
- 下記の内容で採番を行う
  - nnn=(カレントブランチ名からissue番号を取得)
  - kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
  - ii=(docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.mdの進捗の最大の番号。01から始まる連番。ない場合はii=01)

- 進捗ドキュメントのコミット
  - 対象：favorite-keyword-link-frog/docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.md
  - コミットメッセージ
    - docs: スクラムkk ii回目のコードレビュー
    - 他のファイルの無許可コミットを禁止する

- レビューコメントに応じたコーディング修正
  - 参照すべきドキュメント
    - favorite-keyword-link-frog/docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.md
      - の、 `### スクラム-kk(ii回目) のレビューコメント`
  - コーディングにおけるルール、規約
    - workflow:code-according-to-the-rules
    - に必ず準拠すること
- 実装完了後の処理
  - 修正したファイルでも、許可なくコミットしないこと
  - 下記のワークフローに従って進捗をまとめてください
    - workflow:record-progress
```
