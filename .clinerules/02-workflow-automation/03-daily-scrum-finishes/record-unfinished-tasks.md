workflow-record-unfinished-tasks

```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
ii=(docs/issue-nnn/daily-scrum-kk/PROGRESS-kk.mdの進捗の最大の番号)
スクラムkk回目の作業で完了しなかった課題を記録します。
- docs/issue-nnn/daily-scrum-kk/PROGRESS-kk.md
  - `## 次回以降のスクラムに先送りする課題`
    - の課題を、docs/issue-nnn/PLAN.mdのチェックリストに追加してください
  - `## 本issueの対象外とする課題` 
    - の課題を、docs/issue-nnn/PLAN.mdのチェックリストにあれば削除してください
    - それらの課題を、docs/issues.mdのチェックリストに追加してください
```
