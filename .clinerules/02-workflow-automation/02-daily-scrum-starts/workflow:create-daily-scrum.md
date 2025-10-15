favorite-keyword-link-frog/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:create-daily-scrum.md

```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-mm(mは任意の数字)のディレクトリナンバーの最大数+1)
スクラムkk回目の作業を計画を立ててもらいます。
- 下記コマンドを実行
```bash
cd ~/absolute-path/to/favorite-keyword-link-frog/ && \
mkdir -p docs/issue-nnn/daily-scrum-kk/
```

- docs/issue-nnnのドキュメントを読み込み、スクラムkk回目の作業を計画を立てデイリースクラムを実施。
- その内容に基づき、favorite-keyword-link-frog/docs/issue-000/daily-scrum-00/DAILY_SCRUM-.mdのフォーマットに従って、docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.mdを作成してください。
- `## 相談事項` のセクションに記入があった場合は、その旨をチャットにも記入してください