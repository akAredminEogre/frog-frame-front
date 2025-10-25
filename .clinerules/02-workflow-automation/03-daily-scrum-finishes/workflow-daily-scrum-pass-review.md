frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-daily-scrum-pass-review.md

cline-instructionsの手順をチャットスレッドに表示してから実行してください。
その中で別のworkflowに従うと指示されてる場合は、その手順も検索・確認して再帰的にチャットスレッドに表示してください
手順を全体を表示はあなたの確認のために行うものなので、開発者の指示・操作を待たずその表示した手順に従って実行してください

```cline-instructions
- 下記の内容で採番を行う
  - nnn=(カレントブランチ名からissue番号を取得)
  - kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
  - ii=(docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.mdの進捗の最大の番号)

- 進捗ドキュメントのコミット
  - 対象：docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.md
    - 存在しなければコミットはスキップ
  - コミットメッセージ
    - docs: スクラムkk ii回目の進捗

- DAILY_SCRUMドキュメントの更新
  - 対象：docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md
  - 更新内容：
    - docs/issue-nnn/daily-scrum-kk/PROGRESS-kk-ii.mdの内容を反映
    - `## スクラム内残タスク`
      - 完了したタスクを`[x]`に更新
      - もし完了にできなかったタスクがあれば、そのタスクについて`workflow-start-coding-according-to-daily-scrum.md`の手順に従ってコーディングを始める。(本ワークフローはここで終了)
    - ただし、kkはスクラム回数に置き換える
  - コミットメッセージ
    - docs: スクラムkkのDAILY_SCRUM更新

- 下記の振り返りを行う
  - インプット
    - docs/issue-nnn/daily-scrum-kk/ 以下のドキュメント
  - PLAN.md
    - チェックリストの更新(なければスキップ)
  - ISSUE.md
    - チェックリストの更新(なければスキップ)
  - RETROSPECTIVE.md
    - スクラムkkの振り返りを記載
    - 従うべきフォーマット
      - docs/issue-000/RETROSPECTIVE.mdを参照
- 修正したファイルでも、許可なくコミットしないこと
```