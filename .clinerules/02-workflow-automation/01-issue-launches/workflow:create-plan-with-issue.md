frog-frame-front/.clinerules/02-workflow-automation/01-issue-launches/workflow:create-plan-with-issue.md

cline-instructionsの手順をチャットスレッドに表示してから実行してください。
その中で別のworkflowに従うと指示されてる場合は、その手順も検索・確認して再帰的にチャットスレッドに表示してください
手順を全体を表示してから、その表示した手順に従って実行してください


```cline-instructions
- 下記の内容で採番を行う
  - nnn=(カレントブランチ名からissue番号を取得)

- ISSUE.mdのコミット
　- 対象
  　- docs/issue-nnn/ISSUE.md
　- コミットメッセージ
  　- docs: issue-nnnの開始時のドキュメント

- PLAN.mdの作成
  - 保存先
    - frog-frame-front/docs/issue-nnn/PLAN.md
  - 従うべきフォーマット
    - frog-frame-front/docs/issue-000/PLAN.md
```