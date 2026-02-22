# Claude Code Web 専用ワークフロー

**注意**: このドキュメントはClaude Code Web（ブラウザ版）専用です。ターミナル版のClaude Codeでは `.claude/commands/` 内のスラッシュコマンドを使用してください。

## テスト実行ルール（Claude Code Web用）

**重要**: Claude Code Web環境では、**テストは手動で実行せず、CIに任せてください**。

テスト方針の詳細（ローカル実行・Docker・フレームワーク・テスト戦略書）については [docs/development-flow/testing-policy/index.md](../docs/development-flow/testing-policy/index.md) を参照してください。

## セッション開始時（Claude Code Web用）

```text
/workflow-ccw-session-start
```

このワークフローは pre-commitフックのセットアップ、Issue番号の採番、ブランチ作成、PR作成リンクの表示を行います。

- **ブランチ命名規則**: `claude/issue-nnn-<branch-suffix>-<random5chars>`

## PRマージ（Claude Code Web用）

```text
/workflow-ccw-merge-pull-request
```
