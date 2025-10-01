workflow:commit-plan-then-start-daily-issue
```cline-instructions
- 下記の内容で採番を行う
  - nnn=(カレントブランチ名からissue番号を取得)

- PLAN.mdのコミット
　- 対象
  　- docs/issue-nnn/PLAN.md
　- コミットメッセージ
  　- docs: issue-nnnのPLAN.mdの作成、レビュー完了

その後、
workflow:create-daily-scrum
を実行してください
```