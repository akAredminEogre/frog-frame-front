workflow-ccw-session-start branch-suffix=
````cline-instructions
## Claude Code Web セッション開始ワークフロー

このワークフローは、Claude Code Webで新しいセッションを開始する際に実行します。
**ブランチが既に指定されている場合でも、Issue管理のセットアップのために実行してください。**

### 前提条件
- Git がインストールされていること
- Node.js / npm がインストールされていること
- リポジトリのルートディレクトリで実行すること

### pre-commitフックのセットアップ（自動実行）

**通常は手動操作不要です。** SessionStart hookにより、セッション開始時に自動的にpre-commitフックがセットアップされます。

- 既にセットアップ済みの場合は即座にスキップ（起動時間への影響なし）
- 未セットアップの場合のみフルセットアップを実行
- node_modulesがない場合は自動的にnpm installも実行

**手動実行（トラブルシューティング用）**:
自動セットアップが失敗した場合のみ、以下のスクリプトを手動で実行してください：
```bash
./scripts/ci/precommit-hook/main.sh
```

**フックの内容**:
- ESLint + simple-import-sort（コード品質チェック + import文の自動整列）
  - 対象: `.ts`, `.tsx`, `.js`, `.jsx` ファイル
- stylelint（CSSコード品質チェック）
  - 対象: `.css` ファイル
- markdownlint（Markdownフォーマットチェック）
  - 対象: `.md` ファイル

**トラブルシューティング**:
- エラー時はバックアップファイルから復元可能（hookパスの末尾に`.backup`が付与される）
  - 通常: `.git/hooks/pre-commit.backup`
  - worktree/custom hooksPath: `git rev-parse --git-path hooks/pre-commit`で確認
- パターンマッチエラーの場合は lefthook バージョンの互換性を確認

### Issue番号の採番
- `workflow-get-new-branch-number` ワークフローを実行して新しいissue番号(nnn)を取得

### ディレクトリ作成
(cdコマンドでリポジトリルートに移動)
- mkdir docs/issue-nnn/daily-scrum-00
- cp docs/issue-000/ISSUE.md docs/issue-nnn/ISSUE.md

### ブランチ作成（claude/配下）
**注意**: セッション開始時にブランチが既に指定されている場合は、このステップをスキップしてください。

- ブランチ名: `claude/issue-nnn-<branch-suffix>-<ランダム5文字>`
  - ランダム5文字: 英数字のランダムな文字列（例: A1b2C）
- 作成したブランチをgit push originしてください

### PR作成リンクの表示
ghコマンドが使用できないため、以下のPR作成リンクを表示してください：

```
## Pull Request作成リンク

以下のリンクからPRを作成できます：

https://github.com/akAredminEogre/frog-frame-front/compare/develop...<ブランチ名>?expand=1

（<ブランチ名>の部分を実際のブランチ名に置き換えてください）
```

### 注意事項
- このワークフローはClaude Code Web専用です
- ターミナル版Claude Codeでは `/workflow-create-branch` を使用してください
- ブランチ名は必ず `claude/` で始めてください（Claude Code Webの制約）
````
