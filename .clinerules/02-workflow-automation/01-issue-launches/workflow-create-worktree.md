workflow-create-worktree branch-suffix=
```cline-instructions
issue番号の採番：
- `workflow-get-new-branch-number` ワークフローを実行して新しいissue番号(nnn)を取得

- ブランチを作成（developブランチ上で）
  - issue-nnn-<branch-suffix>
- 作成したブランチをgit push originしてください
- developブランチに戻る
  - git checkout develop
- 作成したブランチに対して`make wt-add BRANCH=issue-nnn-<branch-suffix>`コマンドを実行してワークツリーを作成してください
- worktreeディレクトリに移動してISSUE.mdを作成（worktreeのルートから相対パスで指定）
  - (cdコマンドで worktrees/issue-nnn-<branch-suffix> に移動)
  - mkdir -p docs/issue-nnn/daily-scrum-00
  - cp docs/issue-000/ISSUE.md docs/issue-nnn/ISSUE.md
- ISSUE.mdを編集してコミット・プッシュしてください
```
