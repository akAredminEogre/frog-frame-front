workflow-create-worktree branch-suffix=
```cline-instructions
issue番号の採番：
```
git checkout develop && git pull && \
git fetch --prune && git --no-pager branch -a | grep 'issue-*' | sort -r | head -n 1
```
nnn=(上記で表示されたブランチ名からissue番号+1を取得)

- ブランチを作成（developブランチ上で）
  - issue-nnn-<branch-suffix>
- 作成したブランチをgit push originしてください
- developブランチに戻る
  - git checkout develop
- 作成したブランチに対して`make wt-add BRANCH=issue-nnn-<branch-suffix>`コマンドを実行してワークツリーを作成してください
- 作成したブランチに対して`make wt-dev BRANCH=issue-nnn-<branch-suffix>`コマンドを実行してワークツリーの開発環境を起動してください
- worktreeディレクトリに移動してISSUE.mdを作成（メインリポジトリのルートからの相対パスで指定）
  - (cdコマンドで ../frog-frame-front-worktrees/issue-nnn-<branch-suffix> に移動)
  - mkdir -p docs/issue-nnn/daily-scrum-00
  - cp docs/issue-000/ISSUE.md docs/issue-nnn/ISSUE.md
- ISSUE.mdを編集してコミット・プッシュしてください
```