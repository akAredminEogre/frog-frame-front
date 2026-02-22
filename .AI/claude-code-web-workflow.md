# Claude Code Web 専用ワークフロー

**注意**: このドキュメントはClaude Code Web（ブラウザ版）専用です。ターミナル版のClaude Codeでは `.claude/commands/` 内のスラッシュコマンドを使用してください。

## テスト実行ルール（Claude Code Web用）

[docs/development-flow/testing-policy/index.md](../docs/development-flow/testing-policy/index.md) に従い、タスク完了前に以下を実行すること:

1. **全ユニットテスト通過**: `npx vitest --run`
2. **Lint全通過**: `npx eslint . --ext .ts,.tsx,.js,.jsx` / `npx stylelint 'src/**/*.css'`

> `make` コマンドが使用できない場合でも、上記の `npx` コマンドはDockerなしで実行可能です。E2Eテストのみ CI/CD に委譲します。

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
