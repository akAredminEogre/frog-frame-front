# workflow-merge-develop-after-commit

cline-instructionsの手順をチャットスレッドに表示してから実行してください。
その中で別のworkflowに従うと指示されてる場合は、その手順も検索・確認して再帰的にチャットスレッドに表示してください
手順全体表示はあなたの確認のために行うものなので、開発者の指示・操作を待たずその表示した手順に従って実行してください

```cline-instructions
- 下記の内容で採番を行う
  - nnn=(カレントブランチ名からissue番号を取得)

- 最新のdevelopをフェッチ
  - git fetch origin develop

- developのマージを試行
  - git merge origin/develop --no-commit --no-ff
  - このコマンドはマージをコミットせずに試行する

- マージ結果の判定
  - すでに最新の場合（Already up to date）:
    - 「developはすでに最新です。マージの必要はありません。」と報告
    - 手順終了

  - 競合なくマージできた場合:
    - マージをコミットする
      - git commit -m "merge: developの最新変更を取り込み"
    - 「developのマージが完了しました」と報告
    - 手順終了

  - 競合が発生した場合:
    - 競合ファイルの一覧を取得
      - git diff --name-only --diff-filter=U
      - 競合ファイルを変数CONFLICT_FILESに格納
    - マージを中止
      - git merge --abort
    - PLAN.mdにタスクを追加
      - docs/issue-nnn/PLAN.md を読み込む
      - 「# DAILY-SCRUM単位のタスク」セクションの最後に以下を追加:
        ```
        - [ ] developとのマージ競合を解消する
          - 競合ファイル:
            - (CONFLICT_FILESの各ファイルをリスト形式で記載)
        ```
    - 「developとのマージで競合が発生しました。PLAN.mdにタスクを追加しました。」と報告
    - 手順終了
```
