frog-frame-front/.clinerules/02-workflow-automation/01-issue-launches/workflow-commit-plan-then-start-daily-issue.md

cline-instructionsの手順をチャットスレッドに表示してから実行してください。
その中で別のworkflowに従うと指示されてる場合は、その手順も検索・確認して再帰的にチャットスレッドに表示してください
手順全体表示はあなたの確認のために行うものなので、開発者の指示・操作を待たずその表示した手順に従って実行してください

```cline-instructions
- 下記の内容で採番を行う
  - nnn=(カレントブランチ名からissue番号を取得)

- PLAN.mdのコミット
　- 対象
  　- docs/issue-nnn/PLAN.md
　- コミットメッセージ
  　- docs: issue-nnnのPLAN.mdの作成、レビュー完了

その後、
workflow-create-daily-scrum
を実行してください
```