# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**frog-frame-front** is a Chrome extension project built with the WXT framework that manipulates DOM elements. The project follows Clean Architecture principles with Domain-Driven Design (DDD) patterns.

- **Main Tech Stack**: TypeScript, React, WXT (Chrome extension framework)
- **Architecture**: Clean Architecture + DDD
- **DI Container**: tsyringe with reflect-metadata
- **Testing**: Vitest (unit tests), Playwright (E2E tests)
- **Development**: Docker-based development environment

## Project-Specific Rules and Workflows

### Coding Standards

- **`docs/coding-standards/`** - Core coding conventions
- **`.clinerules/02-workflow-automation/`** - Automated workflow definitions

**Note**: When working on this project, always refer to these `.clinerules/` files for detailed guidance.

## Common Development Commands

→ セットアップ手順・利用可能なコマンド一覧は [README.md](README.md) を参照

### Claude Code固有の追加セットアップ

```bash
make init-hooks     # Install Git hooks (pre-commit: ESLint with import sorting, stylelint, markdownlint)
```

### Critical Pre-Completion Check（必須）

**IMPORTANT**: Before marking any task as complete, you MUST run:

```bash
make testlint       # REQUIRED before completing any task (comprehensive checks)
```

**Note**: Claude Code Web環境では `make` コマンドが使用できません。詳細は「[Claude Code Web専用ワークフロー](#claude-code-web専用ワークフロー)」セクションを参照してください。

**このチェックを実行せずにタスクを完了することは禁止されています。**

## Architecture Overview

→ 詳細は [.AI/architecture.md](.AI/architecture.md) を参照

ADRは [docs/adr/001-clean-architecture-with-presenter-pattern.md](docs/adr/001-clean-architecture-with-presenter-pattern.md) も参照。

## Import Path Rules

**CRITICAL**: All imports MUST use absolute paths with configured aliases.

→ 詳細は [.AI/import-paths.md](.AI/import-paths.md) を参照

## Object-Oriented Design Rules (ThoughtWorks Anthology)

→ 詳細は [.AI/oo-design-rules.md](.AI/oo-design-rules.md) を参照

## Testing Requirements

→ 詳細は [.AI/testing-requirements.md](.AI/testing-requirements.md) を参照

## WXT Framework Specifics

→ 詳細は [.AI/wxt-framework.md](.AI/wxt-framework.md) を参照

## Git Workflow

→ 詳細は [.AI/git-workflow.md](.AI/git-workflow.md) を参照

## Claude Code Web専用ワークフロー

→ 詳細は [.AI/claude-code-web-workflow.md](.AI/claude-code-web-workflow.md) を参照

## Troubleshooting

→ 詳細は [.AI/troubleshooting.md](.AI/troubleshooting.md) を参照
