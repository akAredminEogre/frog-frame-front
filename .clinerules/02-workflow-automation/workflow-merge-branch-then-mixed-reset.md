# workflow-merge-branch-then-mixed-reset

cline-instructionsの手順をチャットスレッドに表示してから実行してください。
その中で別のworkflowに従うと指示されてる場合は、その手順も検索・確認して再帰的にチャットスレッドに表示してください
手順を全体を表示はあなたの確認のために行うものなので、開発者の指示・操作を待たずその表示した手順に従って実行してください

```cline-instructions
- 引数の受け取り
  - BRANCH_NAME: マージ対象のブランチ名を引数として受け取る

- 対象ブランチの存在確認とフェッチ
  - git fetch --all
  - git branch -r | grep "${BRANCH_NAME}"
  - ブランチが存在しない場合はエラーメッセージを表示して終了

- ブランチのマージ
  - git merge origin/${BRANCH_NAME} --no-edit
  - 指定されたブランチを現在のブランチにマージ

- マージコミットのmixed reset
  - git reset --mixed HEAD~1
  - 直前のマージコミットを未コミット状態に変更

- 変更の確認
  - git status --porcelain
  - 未コミット状態の変更を確認
```