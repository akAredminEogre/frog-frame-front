workflow-ccw-create-branch branch-suffix=
```cline-instructions
## Claude Code Web用ブランチ作成ワークフロー

### issue番号の採番
- `workflow-get-new-branch-number` ワークフローを実行して新しいissue番号(nnn)を取得

### ディレクトリ作成
(cdコマンドでリポジトリルートに移動)
- mkdir docs/issue-nnn/daily-scrum-00
- cp docs/issue-000/ISSUE.md docs/issue-nnn/ISSUE.md

### ブランチ作成（claude/配下）
- ブランチ名: `claude/issue-nnn-<branch-suffix>-<ランダム5文字>`
  - ランダム5文字: 英数字のランダムな文字列（例: A1b2C）
- 作成したブランチをgit push -u originしてください

### PR作成リンクの表示
ghコマンドが使用できないため、以下のPR作成リンクを表示してください：

```
## Pull Request作成リンク

以下のリンクからPRを作成できます：

https://github.com/akAredminEogre/frog-frame-front/compare/develop...<ブランチ名>?expand=1

（<ブランチ名>は実際に作成したブランチ名に置き換えてください）
```

### 注意事項
- このワークフローはClaude Code Web専用です
- ターミナル版Claude Codeでは `/workflow-create-branch` を使用してください
- ブランチ名は必ず `claude/` で始めてください（Claude Code Webの制約）
```
