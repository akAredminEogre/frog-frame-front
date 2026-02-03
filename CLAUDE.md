# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## タスク別チェックリスト（実装前に必ず確認）

### 新規メソッド/クラスを追加する場合

1. [ ] **テスト戦略書を先に作成**（`docs/design/src/[layer]/.../[methodName].md`）
   - テンプレートは「docs/design/ 配下の設計ドキュメントを作成・編集する場合」セクションを参照
   - **既存モック確認チェック**セクションを必ず記載すること
2. [ ] 実装コードを作成
3. [ ] **既存モック検索を実行**（テストコード実装前）
   - 参照: `docs/coding-standards/tests/common-rule/mock-file-placement.md`
4. [ ] テストコードを実装
   - 参照: `docs/coding-standards/tests/common-rule/index.md`
   - 参照: `docs/coding-standards/tests/array-based-test.md`
5. [ ] **テスト戦略書との整合性確認**（テストコード実装後）

### 既存メソッドを修正する場合

1. [ ] 既存テストが通ることを確認
2. [ ] **シグネチャ変更時はテスト戦略書を必ず更新**
3. [ ] テストコードを更新
   - 参照: `docs/coding-standards/tests/common-rule/index.md`

### docs/ 配下のドキュメントを作成・編集する場合

→ [.AI/docs/editing-guide.md](.AI/docs/editing-guide.md) を参照

### docs/coding-standards/ 配下のコーディング規約を追加・編集する場合

1. [ ] **カテゴリ固有のルールを確認**: [docs-rules/coding-standards.md](docs-rules/coding-standards.md) を必ず読むこと
2. [ ] [.AI/docs/editing-guide.md](.AI/docs/editing-guide.md) のチェックリストに従う

### User Story READMEのタスク進捗を更新する場合

→ `docs-rules/user-stories/readme-guide.md`「タスク進捗更新時のネットワーク図同期」を参照

### docs/design/ 配下の設計ドキュメントを作成・編集する場合

→ [.AI/docs/editing-guide.md](.AI/docs/editing-guide.md) を参照

**テンプレート**: `docs-rules/design/` 配下の各ルールファイルに従うこと

### E2E specファイルを分割・統合・リネームする場合

→ [.AI/tests/e2e/consistency-maintenance-guideline.md](.AI/tests/e2e/consistency-maintenance-guideline.md) を参照

### ADRを作成・編集する場合

→ [.AI/docs/editing-guide.md](.AI/docs/editing-guide.md) を参照

---

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

All commands should be run from the repository root unless otherwise specified.

### Initial Setup (First Time Only)

```bash
make init-config    # Apply Git configuration
make init-dev       # Build containers, install dependencies, generate .wxt/tsconfig.json, and start dev server
make init-hooks     # Install Git hooks (pre-commit: ESLint with import sorting, stylelint, markdownlint)
```

### Development (After Initial Setup)

```bash
make dev            # Start development server
make down           # Stop Docker containers
make storybook      # Start Storybook development server
```

### Testing and Linting

```bash
make testlint       # REQUIRED before completing any task (comprehensive checks)
make testcheck      # Quick check (tests with warnings)
make unit           # Unit tests only
make e2e            # E2E tests only
make check          # Run compile, knip, tsr, and lint checks
make lintmd         # Run markdownlint
make checklinks     # Check for broken links
```

### Critical Pre-Completion Check

**IMPORTANT**: Before marking any task as complete, you MUST run:

```bash
make testlint
```

**Note**: Claude Code Web環境では `make` コマンドが使用できません。詳細は「[Claude Code Web専用ワークフロー](#claude-code-web専用ワークフロー)」セクションを参照してください。

**このチェックを実行せずにタスクを完了することは禁止されています。**

### Git Worktree (Parallel Development)

→ 詳細は [docs/GIT_WORKTREE.md](docs/GIT_WORKTREE.md) を参照

基本コマンド:

```bash
make wt-dev BRANCH=feature-x    # 開発サーバー起動（自動初期化含む）
make wt-disable                 # メインリポジトリに戻る
make wt-remove BRANCH=feature-x # worktree削除
```

## Architecture Overview

### Clean Architecture Layers

```text
src/
├── entrypoints/          # WXT entry points (background.ts, content.ts, popup/, etc.)
├── components/           # React components (Atomic Design)
├── application/          # Application layer (Use Cases, ports)
├── domain/              # Domain layer (Business logic, NO external dependencies)
└── infrastructure/      # Infrastructure layer (External dependencies, DI container)

tests/
├── unit/               # Vitest unit tests (mirrors src/ structure)
└── e2e/               # Playwright E2E tests (*.spec.ts)
```

### Key Architectural Rules

- **Domain Layer**: MUST NOT depend on any other layer. Pure business logic only.
- **Infrastructure Layer**: ONLY layer that may use Chrome APIs and browser-specific code.
- **Application Layer**: Use Cases coordinate between domain and infrastructure.
- **Component Layer**: Cannot directly call Chrome APIs. Must go through UseCases.

### Dependency Injection

- **Container**: `src/infrastructure/di/container.ts`
- All dependencies are injected via constructor using `@inject()` decorator

## Import Path Rules

**CRITICAL**: All imports MUST use absolute paths with configured aliases.

→ 詳細は `docs/coding-standards/tests/common-rule/import-paths.md` を参照

## Object-Oriented Design Rules (ThoughtWorks Anthology)

→ 詳細は `docs/coding-standards/src/object-oriented-nine-rules.md` を参照

## Testing Requirements

### Test Strategy Document (Required)

**CRITICAL**: Before writing any test code, create a test strategy document.

- **Location**: `docs/design/src/[layer]/[category]/[ClassName]/[methodName].md`
- **Templates**: `docs-rules/design/05-test-strategy.md`（単体）、`docs-rules/design/06-integration-test-strategy.md`（結合）、`docs-rules/design/07-e2e-test-strategy/`（E2E）

### テストを伴う実装時のTodoWrite使用

新規メソッド追加時は、TodoWriteで以下の順序でタスクを作成すること:

1. テスト戦略書の作成
2. 実装コードの作成
3. テストコードの実装

### Testing Standards

→ 詳細は以下を参照:

- 共通ルール: `docs/coding-standards/tests/common-rule/index.md`
- 配列ベーステスト: `docs/coding-standards/tests/array-based-test.md`
- E2Eルール: `docs/coding-standards/tests/e2e/index.md`
- infrastructure層ルール: `docs/coding-standards/tests/unit/infrastructure.md`

## WXT Framework Specifics

### Configuration

- Config file: `host-frontend-root/frontend-src-root/wxt.config.ts`
- **Required**: `srcDir: 'src'` must be set in config

### Entry Points

All entry points in `src/entrypoints/`:

- `background.ts` - Background service worker
- `content.ts` - Content script
- `popup/`, `rules/`, `edit/` - UI directories

### Special Files

- `.wxt/tsconfig.json` - Generated by `npx wxt prepare` (DO NOT manually create)
- `matchUrl.ts` - Must be created from `matchUrl.ts.example` during setup

## Git Workflow

### Branch Strategy

- **Base branch**: `develop`
- **Branch naming**: Issue-based branches (e.g., `issue-086-docs-how-to-set-up`)
- See `.clinerules/02-workflow-automation/01-issue-launches/` for branch creation workflows

### Files to Exclude from Commits

- `WITH_CLINE.md` - Work-in-progress instructions
- `issues.md` - Task management file

### Pull Requests

- Create PRs using `gh` CLI
- Base PRs against `develop` branch
- Repository: `akAredminEogre/frog-frame-front`

## Claude Code Web専用ワークフロー

**注意**: このセクションはClaude Code Web（ブラウザ版）専用です。ターミナル版のClaude Codeでは `.claude/commands/` 内のスラッシュコマンドを使用してください。

### テスト実行ルール（Claude Code Web用）

**重要**: Claude Code Web環境では、**テストは手動で実行せず、CIに任せてください**。

### セッション開始時（Claude Code Web用）

```text
/workflow-ccw-session-start
```

このワークフローは pre-commitフックのセットアップ、Issue番号の採番、ブランチ作成、PR作成リンクの表示を行います。

- **ブランチ命名規則**: `claude/issue-nnn-<branch-suffix>-<random5chars>`

### PRマージ（Claude Code Web用）

```text
/workflow-ccw-merge-pull-request
```

## Troubleshooting

### `.wxt/tsconfig.json` Not Found

This file is auto-generated. Run:

```bash
docker compose exec frontend npx wxt prepare
```

### Permission Issues

The Docker setup includes a `fix-permissions.sh` script that runs on container start to handle file permission issues between host and container.
