workflow:record-progress-after-coding

cline-instructionsの手順をチャットスレッドに表示してから実行してください。
その中で別のworkflowに従うと指示されてる場合は、その手順も検索・確認して再帰的にチャットスレッドに表示してください
手順を全体を表示はあなたの確認のために行うものなので、開発者の指示・操作を待たずその表示した手順に従って実行してください

```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-mm(mは任意の数字)のディレクトリナンバーの最大数+1)
作業ありがとうございました。今回の作業を
スクラムkk回目として記録します。
まずディレクトリの作成とドキュメントテンプレートのコピー
を行います
- 下記コマンドを実行
```bash
cd ~/absolute-path/to/frog-frame-front/ && \
mkdir -p docs/issue-nnn/daily-scrum-kk/
cp docs/issue-000/daily-scrum-00/DAILY_SCRUM-.md docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md
```

- 今回の作業内容、チャットスレッドの内容、
`git --no-pager diff --name-only develop`
の出力結果に基づき、
workflow:record-progress に従って、docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.mdを作成してください。

```