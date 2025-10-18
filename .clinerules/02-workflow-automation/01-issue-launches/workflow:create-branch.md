workflow:create-branch branch-suffix=
```cline-instructions
issue番号の採番：
```
git checkout develop && git pull && \
git fetch --prune && git --no-pager branch -a | grep 'issue-*' | sort -r | head -n 1
```
nnn=(上記で表示されたブランチ名からissue番号+1を取得)
(cdコマンドでリポジトリルートに移動)
- mkdir docs/issue-nnn/daily-scrum-00
- cp docs/issue-000/ISSUE.md docs/issue-nnn/ISSUE.md

- ブランチを作成
  - issue-nnn-<branch-suffix>
- 作成したブランチをgit push originしてください
```