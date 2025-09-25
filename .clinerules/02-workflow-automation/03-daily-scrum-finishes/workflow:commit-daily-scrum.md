workflow:commit-daily-scrum

```cline-instructions
- 下記の内容で採番を行う
  - nnn=(カレントブランチ名からissue番号を取得)
  - kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)

- デイリースクラムドキュメントのコミット
  - 対象
    - docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-jj.md(jjは任意の定数、複数あり)
      - 存在しなければスキップ
    - docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md
    - docs/issue-nnn/PLAN.md
      - 存在しなければスキップ
    - docs/issue-nnn/RETROSPECTIVE.md
      - 存在しなければスキップ
  - コミットメッセージ
    - docs: スクラムkk回目の終了、振り返り
```