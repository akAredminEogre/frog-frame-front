favorite-keyword-link-frog/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow:daily-scrum-pass-review-scrum.md

```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
ii=(docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.mdの進捗の最大の番号)
ありがとうございました。今回の作業は終了にします。
下記の内容でコミットしてください。
- 対象：docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.md
  - 存在しなければコミットはスキップ
- コミットメッセージ
  - docs: スクラムkk ii回目の進捗

次に、
docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-jj.md(jjは任意の定数、複数あり)
をインプットとして、
docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md を更新してください
- 従うべきフォーマット
  - favorite-keyword-link-frog/docs/issue-000/daily-scrum-00/DAILY_SCRUM-.md
  - ただし、kkはスクラム回数に置き換えてください

続いて、下記の振り返りも行ってください
をみながら振り返りを行い、PLAN.md/RETROSPECTIVE.mdを更新してください
- PLAN.md
  - チェックリストの更新(なければスキップ)
- RETROSPECTIVE.md
  - スクラムkkの振り返りを記載
  - 従うべきフォーマット
    - docs/issue-000/RETROSPECTIVE.mdを参照
```