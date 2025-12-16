workflow-create-branch branch-suffix=
```cline-instructions
issue番号の採番：
- `workflow-get-new-branch-number` ワークフローを実行して新しいissue番号(nnn)を取得

(cdコマンドでリポジトリルートに移動)
- mkdir docs/issue-nnn/daily-scrum-00
- cp docs/issue-000/ISSUE.md docs/issue-nnn/ISSUE.md

- ブランチを作成
  - issue-nnn-<branch-suffix>
- 作成したブランチをgit push originしてください
```
