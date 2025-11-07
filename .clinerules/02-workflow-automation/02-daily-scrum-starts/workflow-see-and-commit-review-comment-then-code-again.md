frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-and-commit-review-comment-then-code-again.md


cline-instructionsの手順をチャットスレッドに表示してから実行してください。
その中で別のworkflowに従うと指示されてる場合は、その手順も検索・確認して再帰的にチャットスレッドに表示してください
手順全体表示はあなたの確認のために行うものなので、開発者の指示・操作を待たずその表示した手順に従って実行してください

```cline-instructions
- 下記の内容で採番を行う
  - nnn=(カレントブランチ名からissue番号を取得)
  - kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
  - ii=(docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.mdの進捗の最大の番号。01から始まる連番。ない場合はii=01)

- 進捗ドキュメントをインプットとした、他ドキュメントの反映
  - `### 次回以降のスクラムに先送りする課題` があれば、frog-frame-front/docs/issue-nnn/PLAN.md の`# DAILY-SCRUM単位のタスク` に追加
  - `### 本issueの対象外とする課題` があれば、frog-frame-front/docs/issue-nnn/PLAN.md の `# 本issueの対象外とする課題` に追加

- 進捗ドキュメントのコミット
  - 対象：frog-frame-front/docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.md
  - コミットメッセージ
    - docs: スクラムkk ii回目のコードレビュー
    - 他のファイルの無許可コミットを禁止する

- レビューコメントに応じたコーディング修正
  - **事前準備：アーキテクチャ状況調査（必須ステップ）**
    - レビュー対応開始前に、現在のアーキテクチャと関連クラスの存在状況を必ず調査する
    - 過去の実装変更により廃止されたクラスや手法がないか確認する
    - レビュー対象コードと関連する既存実装の責務範囲を明確化する
  - 参照すべきドキュメント
    - frog-frame-front/docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.md
      - の、 `### スクラム-kk(ii回目) のレビューコメント`
  - コーディングにおけるルール、規約
    - workflow-code-according-to-the-rules
    - review-response-guidelines.md
    - に必ず準拠すること
- 実装完了後の処理
  - 修正したファイルでも、許可なくコミットしないこと
  - 下記のワークフローに従って進捗をまとめてください
    - workflow-record-progress
```
