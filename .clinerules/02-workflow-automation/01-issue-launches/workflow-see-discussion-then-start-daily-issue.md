frog-frame-front/.clinerules/02-workflow-automation/01-issue-launches/workflow-see-discussion-then-start-daily-issue.md

cline-instructionsの手順をチャットスレッドに表示してから実行してください。
その中で別のworkflowに従うと指示されてる場合は、その手順も検索・確認して再帰的にチャットスレッドに表示してください
手順を全体を表示はあなたの確認のために行うものなので、開発者の指示・操作を待たずその表示した手順に従って実行してください

```cline-instructions
- 下記の内容で採番を行う
  - nnn=(カレントブランチ名からissue番号を取得)

- 相談事項セクションの確認
  - docs/issue-nnn/PLAN.md
  - の、 `# ISSUEを通した相談事` セクションを確認する
  - その内容に応じて、docs/issue-nnn/PLAN.md のタスクや修正予定に変更が必要であれば変更する。

- 追加相談事項有無の確認
  - 追加の相談事項がある場合は、docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md の `## 相談事項` セクションに追加する
  - `## 相談事項` のセクションに記入があった場合は、その旨をチャットにも記入し、本ワークフローを終了する
  - 追加の相談事項がない場合は、次に進む

- PLAN.mdのコミット
　- 対象
  　- docs/issue-nnn/PLAN.md
　- コミットメッセージ
  　- docs: issue-nnnのPLAN.mdの作成、レビュー完了

その後、
workflow-create-daily-scrum
を実行してください
```
