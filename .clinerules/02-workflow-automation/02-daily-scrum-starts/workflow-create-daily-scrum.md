frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-create-daily-scrum.md

```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-mm(mは任意の数字)のディレクトリナンバーの最大数+1)
スクラムkk回目の作業を計画を立ててもらいます。
- 下記コマンドを実行
```bash
cd ~/absolute-path/to/frog-frame-front/ && \
mkdir -p docs/issue-nnn/daily-scrum-kk/
```

- docs/issue-nnnのドキュメントを読み込み、スクラムkk回目の作業を計画を立てデイリースクラムを実施。
- その内容に基づき、frog-frame-front/docs/issue-000/daily-scrum-00/DAILY_SCRUM-.mdのフォーマットに従って、docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.mdを作成してください。


- DAILY_SCRUM-kk.md作成後の手順
  - ## 相談事項セクションに記入がない場合
    - workflow-start-coding-according-to-daily-scrum
    - を続けて自動的に始める
  - ## 相談事項セクションに記入がある場合
  　- チャットスレッドに記入がある旨表示し、本ワークフローを終了する
```