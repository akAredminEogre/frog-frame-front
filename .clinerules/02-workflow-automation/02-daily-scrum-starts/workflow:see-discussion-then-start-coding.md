frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-discussion-then-start-coding.md

cline-instructionsの手順をチャットスレッドに表示してから実行してください。
その中で別のworkflowに従うと指示されてる場合は、その手順も検索・確認して再帰的にチャットスレッドに表示してください
手順を全体を表示してから、その表示した手順に従って実行してください

```cline-instructions
- 下記の内容で採番を行う
  - nnn=(カレントブランチ名からissue番号を取得)
  - kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)

- 相談事項セクションの確認
  - docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md
  - の、 `## 相談事項` セクションを確認する
  - その内容に応じて、docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md のタスクや修正予定に変更が必要であれば変更する。

- 追加相談事項有無の確認
  - 追加の相談事項がある場合は、docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md の `## 相談事項` セクションに追加する
  - `## 相談事項` のセクションに記入があった場合は、その旨をチャットにも記入し、本ワークフローを終了する
  - 追加の相談事項がない場合は、次に進む

- デイリースクラム作業の開始
  - 上記作業終了後、
  - workflow:start-coding-according-to-daily-scrum
  - の手順を実行してください
```
