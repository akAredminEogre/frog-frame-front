# CLAUDE.md

このファイルは、リポジトリ内のコードを扱う際のClaude Code (claude.ai/code) へのガイダンスを提供します。

## プロジェクト概要

**frog-frame-front** は、DOMエレメントを操作するWXTフレームワーク製のChrome拡張機能プロジェクトです。Clean ArchitectureおよびDomain-Driven Design（DDD）パターンに基づいて設計されています。

- **主要技術スタック**: TypeScript、React、WXT（Chrome拡張機能フレームワーク）
- **アーキテクチャ**: Clean Architecture + DDD
- **DIコンテナ**: tsyringe（reflect-metadata使用）
- **テスト**: Vitest（ユニットテスト）、Playwright（E2Eテスト）
- **開発環境**: Dockerベースの開発環境

## プロジェクト固有のルールとワークフロー

### コーディング規約

- **`docs/coding-standards/`** - コアコーディング規約
- **`.clinerules/02-workflow-automation/`** - 自動化ワークフロー定義

**注意**: このプロジェクトで作業する際は、詳細なガイダンスのために `.clinerules/` ファイルを必ず参照してください。

## 共通開発コマンド

→ セットアップ手順・利用可能なコマンド一覧は [README.md](README.md) を参照

### Claude Code固有の追加セットアップ

```bash
make init-hooks     # Gitフックのインストール（pre-commit: ESLintによるimportソート、stylelint、markdownlint）
```

### タスク完了前の必須確認

**重要**: タスクを完了とする前に、必ず以下を実行すること:

```bash
make testlint       # タスク完了前に必須（包括的チェック）
```

**注意**: Claude Code Web環境では `make` コマンドが使用できません。詳細は「[Claude Code Web専用ワークフロー](#claude-code-web専用ワークフロー)」セクションを参照してください。

**このチェックを実行せずにタスクを完了することは禁止されています。**

## アーキテクチャ概要

→ 詳細は [.AI/architecture.md](.AI/architecture.md) を参照

ADRは [docs/adr/001-clean-architecture-with-presenter-pattern.md](docs/adr/001-clean-architecture-with-presenter-pattern.md) も参照。

## インポートパスルール

**重要**: 全インポートは設定済みエイリアスを使った絶対パスを使用すること。

→ 詳細は [.AI/import-paths.md](.AI/import-paths.md) を参照

## オブジェクト指向設計ルール（ThoughtWorksアンソロジー）

→ 詳細は [.AI/oo-design-rules.md](.AI/oo-design-rules.md) を参照

## テスト要件

→ 詳細は [.AI/testing-requirements.md](.AI/testing-requirements.md) を参照

## WXTフレームワーク詳細

→ 詳細は [.AI/wxt-framework.md](.AI/wxt-framework.md) を参照

## Gitワークフロー

→ 詳細は [.AI/git-workflow.md](.AI/git-workflow.md) を参照

## Claude Code Web専用ワークフロー

→ 詳細は [.AI/claude-code-web-workflow.md](.AI/claude-code-web-workflow.md) を参照

## トラブルシューティング

→ 詳細は [.AI/troubleshooting.md](.AI/troubleshooting.md) を参照
