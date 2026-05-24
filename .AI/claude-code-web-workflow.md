# Claude Code Web 専用ワークフロー

**注意**: このドキュメントはClaude Code Web（ブラウザ版）専用です。ターミナル版のClaude Codeでは `.claude/commands/` 内のスラッシュコマンドを使用してください。

## テスト実行ルール（Claude Code Web用）

[docs/development-flow/testing-policy/index.md](../docs/development-flow/testing-policy/index.md) に従うこと。

> **CCW環境の制約**: Claude Code Webはローカルシェルを直接操作できないため、`make` コマンドは使用不可。テスト実行方針に記載の `npx` コマンドも実行できない場合は、PR説明欄に「ローカルテスト未実行」と明記し、CI/CDでの全テスト通過を必須条件とすること。

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
