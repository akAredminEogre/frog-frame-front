workflow:record-progress-after-coding

```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-mm(mは任意の数字)のディレクトリナンバーの最大数+1)
作業ありがとうございました。今回の作業を
スクラムkk回目として記録します。
まずディレクトリの作成とドキュメントテンプレートのコピー
を行います
- 下記コマンドを実行
```bash
cd ~/akAredminEogre-project/favorite-keyword-link-frog/ && \
mkdir -p docs/issue-nnn/daily-scrum-kk/
cp docs/issue-000/daily-scrum-00/DAILY_SCRUM-.md docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md
```

- 今回の作業内容、チャットスレッドの内容に基づき、
workflow:record-progress に従って、docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.mdを作成してください。

```