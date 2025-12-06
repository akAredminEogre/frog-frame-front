workflow-record-progress

```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
ii=(docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.mdの進捗の最大の番号+1。01から始まる連番。ない場合はii=01)
- 保存先
  - frog-frame-front/docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.md
- 従うべきフォーマット
  - frog-frame-front/docs/issue-000/daily-scrum-00/PROGRESS-.md

- 進捗ドキュメントをインプットとした、他ドキュメントへの反映
  - 作成した進捗ドキュメントの `### 次回以降のスクラムに先送りする課題` に課題があれば、frog-frame-front/docs/issue-nnn/PLAN.md の `# DAILY-SCRUM単位のタスク` に追加
  - 作成した進捗ドキュメントの `### 本issueの対象外とする課題` に課題があれば、frog-frame-front/docs/issue-nnn/PLAN.md の `# 本issueの対象外とする課題` に追加

完了後開発者にコードレビューを依頼してください
コードレビューを依頼する前に許可なくファイルをコミットするのはやめてください

```