# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## タスク別チェックリスト（実装前に必ず確認）

### 新規メソッド/クラスを追加する場合

1. [ ] **テスト戦略書を先に作成**（`docs/design/src/[layer]/.../[methodName].md`）
   - テンプレートは「docs/design/ 配下の設計ドキュメントを作成・編集する場合」セクションを参照
   - **既存モック確認チェック**セクションを必ず記載すること
2. [ ] 実装コードを作成
3. [ ] **既存モック検索を実行**（テストコード実装前）
   ```bash
   grep -r "createMock[InterfaceName]" tests/
   ```
   - 既存モックが見つかった場合 → インポートして使用
   - 見つからなかった場合 → 共有ディレクトリに新規作成
   - 参照: `docs/coding-standards/tests/common-rule/`（§2: モックファイルの配置ルール）
4. [ ] テストコードを実装
   - 参照: `docs/coding-standards/tests/common-rule/`（§3〜§8）
   - 参照: `docs/coding-standards/tests/array-based-test.md`
5. [ ] **テスト戦略書との整合性確認**（テストコード実装後）
   - テストコードに戦略書にないケースを追加した場合 → 戦略書に追記
   - 戦略書にあるがテストコードに未実装のケースがある場合 → 理由を明記するか実装

### 既存メソッドを修正する場合

1. [ ] 既存テストが通ることを確認
2. [ ] **シグネチャ変更時はテスト戦略書を必ず更新**
   - インターフェース/コールバックの引数・戻り値を変更した場合 → 関連するすべてのテスト戦略書を更新
   - 影響範囲の特定（複数パターンで検索）:
     ```bash
     grep -r "変更したメソッド名" docs/design/
     grep -r "変更したprop名" docs/design/
     grep -r "変更前の振る舞い（例: ruleIdとmessage）" docs/design/
     ```
3. [ ] テストコードを更新
   - 参照: `docs/coding-standards/tests/common-rule/`（§3〜§8）

### docs/ 配下のドキュメントを作成・編集する場合

→ [.AI/docs/editing-guide.md](.AI/docs/editing-guide.md) を参照

### docs/coding-standards/ 配下のコーディング規約を追加・編集する場合

1. [ ] **カテゴリ固有のルールを確認**: [docs-rules/coding-standards.md](docs-rules/coding-standards.md) を必ず読むこと
   - **実装例（Good/Bad例、コードスニペット）は記述しない**
   - 適用シナリオ（いつ・どこでこの規約を適用するかの判断事例）は記載する
2. [ ] **コードブロック禁止チェック**: ファイル内に ` ``` ` で囲まれたコードブロックがないことを確認
   - `// ❌ 悪い例` / `// ✅ 良い例` 形式のコードも禁止
   - テキスト説明に置き換えるか、テストコードへの参照に変更する
3. [ ] [.AI/docs/editing-guide.md](.AI/docs/editing-guide.md) のチェックリストに従う
4. [ ] 同一PR内で既存の違反箇所も修正すること

### User Story READMEのタスク進捗を更新する場合

→ `docs-rules/user-stories/readme-guide.md`「タスク進捗更新時のネットワーク図同期」を参照

### docs/design/ 配下の設計ドキュメントを作成・編集する場合

→ [.AI/docs/editing-guide.md](.AI/docs/editing-guide.md) を参照

**テンプレート**: `docs-rules/design/` 配下の各ルールファイルに従うこと

- 単体テスト戦略書: `docs-rules/design/05-test-strategy.md`
- 結合テスト戦略書: `docs-rules/design/06-integration-test-strategy.md`
- E2Eテスト戦略書: `docs-rules/design/07-e2e-test-strategy/`

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

This project includes additional guidelines and automated workflows defined in the `.clinerules/` directory:

### Coding Standards
- **`docs/coding-standards/`** - Core coding conventions including:
  - `src/` - Source code conventions (import paths, OO design rules, Clean Architecture)
  - `tests/` - Test code conventions
  - `make/` - Makefile conventions
  - `scripts/` - Script conventions

### Test Standards
- **`docs/coding-standards/tests/`** - Test coding conventions (array-based tests, common rules, E2E rules)

### Workflow Automation
The **`.clinerules/02-workflow-automation/`** directory contains automated workflow definitions:
- **01-issue-launches/** - Issue and branch creation workflows
- **02-daily-scrum-starts/** - Daily scrum start workflows, coding guidelines
- **03-daily-scrum-finishes/** - Progress recording, review workflows
- **04-pull-request/** - PR creation and merge workflows

These workflows define standardized processes for:
- Creating branches and planning issues
- Starting daily scrum iterations
- Recording progress and handling code reviews
- Creating and merging pull requests

**Note**: When working on this project, always refer to these `.clinerules/` files for detailed guidance on coding standards, testing requirements, and workflow processes.

## Common Development Commands

All commands should be run from the repository root unless otherwise specified.

### Initial Setup (First Time Only)
```bash
make init-config    # Apply Git configuration
make init-dev       # Build containers, install dependencies, generate .wxt/tsconfig.json, and start dev server
make init-hooks     # Install Git hooks (pre-commit: ESLint with import sorting)
```

### Development (After Initial Setup)
```bash
make dev            # Start development server (stops containers, restarts, and runs dev server)
make down           # Stop Docker containers
make ps             # List running containers
make npminstall     # Install npm dependencies
make storybook      # Start Storybook development server
```

### Inside Container Commands
After `make dev` is running, open a new terminal for these commands:

```bash
# Testing and linting (REQUIRED before completing any task)
make testlint

# Quick check (tests with warnings, softer than make testlint)
make testcheck

# Individual test commands
make unit         # Unit tests only
make e2e          # E2E tests only
make testall      # Both unit and E2E tests

# Code quality checks
make check        # Run compile, knip, tsr, and lint checks
make sortimports  # Sort imports in all files
make lintmd       # Run markdownlint for Markdown files (runs on host, not in Docker)
make lintmdfix    # Run markdownlint with auto-fix (runs on host, not in Docker)
make checklinks   # Check for broken links in Markdown files (runs on host, not in Docker)
docker compose exec frontend npm run compile        # TypeScript compilation check
docker compose exec frontend npm run lint           # Run ESLint
docker compose exec frontend npm run lint:fix       # Auto-fix ESLint issues
docker compose exec frontend npm run stylelint      # Run stylelint for CSS files
docker compose exec frontend npm run stylelint:fix  # Auto-fix stylelint issues

# Unused code detection and cleanup
docker compose exec frontend npm run unused:complete    # Remove unused code
docker compose exec frontend npm run knip:all           # Check for unused exports/dependencies
```

### Critical Pre-Completion Check
**IMPORTANT**: Before marking any task as complete, you MUST run:
```bash
make testlint
```
This command runs comprehensive checks including tests, unused code detection, and linting. Do NOT proceed if this command fails.

**Note**: Claude Code Web環境では `make` コマンドが使用できません。詳細は「[Claude Code Web専用ワークフロー](#claude-code-web専用ワークフロー)」セクションを参照してください。

#### 通常環境（ターミナル版Claude Code）の場合

1. **未使用コードチェックの実行**
   ```bash
   make testcheck
   ```

2. **チェック結果の確認**
   - エラーや未使用コードが検出された場合は、必ず修正してから再度チェックを実行
   - すべてのチェックが正常に完了した場合のみ、タスク完了可能

3. **修正が必要な場合の手順**
   - 検出された問題を修正
   - 再度同じコマンドを実行してチェック
   - エラーがなくなるまで修正とチェックを繰り返す

**このチェックを実行せずにタスクを完了することは禁止されています。**

### Git Utility Commands
```bash
make git-list-unmerged  # List all branches not merged into develop
```

### Git Worktree (Parallel Development)
For working on multiple branches simultaneously:

**Basic Commands:**
```bash
make wt-list                    # List all worktrees
make wt-add BRANCH=feature-x    # Create worktree for branch (file copy only, no Docker)
make wt-init BRANCH=feature-x   # Initialize worktree for development (Docker, npm install)
make wt-remove BRANCH=feature-x # Remove worktree
make wt-prune                   # Clean up stale references
make wt-current                 # Show currently active worktree
```

**Development Commands:**
```bash
make wt-dev BRANCH=feature-x    # Start dev server for worktree (auto-initializes if needed)
make storybook                  # Start Storybook (works in both main repo and worktree mode)
make wt-down                    # Stop worktree Docker containers
make wt-up                      # Start worktree Docker containers
make wt-disable                 # Disable worktree mode, return to main repository
```

**Navigation Commands (requires shell function setup):**
```bash
wt-cd feature-x                 # Navigate to specific worktree
wt-cd-current                   # Navigate to current worktree
```

**Shell Wrapper Commands with Tab Completion (requires shell function setup):**
```bash
wt-add feature-x                # Create worktree (Tab completes all branches)
wt-remove feature-x             # Remove worktree (Tab completes existing worktrees)
wt-dev feature-x                # Start dev server (Tab completes existing worktrees)
```

These wrapper functions provide shorter alternatives to `make wt-add BRANCH=...` commands with Tab completion support for both Bash and Zsh.

**Shell Function Setup (Required for navigation and wrapper commands):**
Add to your `~/.bashrc` or `~/.zshrc`:
```bash
source /path/to/frog-frame-front/scripts/main.sh
```

**Recommended Worktree Workflow:**
```bash
# 1. Start development (auto-creates worktree if it doesn't exist)
make wt-dev BRANCH=new-feature

# 2. Switch between worktrees (auto-stops other containers)
make wt-dev BRANCH=other-feature

# 3. Return to main repository (when done with worktree development)
make wt-disable

# 4. Clean up worktree when done
make wt-remove BRANCH=new-feature
```

**Key Features:**
- `make wt-dev` automatically initializes the worktree if not initialized (calls `wt-init` internally, which calls `wt-add` if needed) and stops other worktree containers to avoid port conflicts
- `make wt-add` creates the worktree and copies configuration files (.env, matchUrl.ts) but does not run Docker or npm install
- `make wt-init` initializes the development environment (Docker setup, npm install, wxt prepare)
- Each worktree has its own node_modules and package.json (no cross-branch contamination)
- Internal helper commands (starting with `_`) should not be used directly

See `docs/GIT_WORKTREE.md` for detailed usage guide.

## Architecture Overview

### Clean Architecture Layers

```text
src/
├── entrypoints/          # WXT entry points (background.ts, content.ts, popup/, etc.)
├── components/           # React components (Atomic Design)
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── pages/
├── application/          # Application layer (Use Cases)
│   ├── usecases/
│   ├── ports/           # Interfaces for infrastructure dependencies
│   └── types/
├── domain/              # Domain layer (Business logic, NO external dependencies)
│   ├── entities/
│   ├── value-objects/
│   ├── constants/
│   └── errors/
└── infrastructure/      # Infrastructure layer (External dependencies)
    ├── browser/         # Chrome API wrappers (tabs, runtime, popup, window)
    ├── persistance/     # Storage services
    ├── selection/       # Browser selection services
    └── di/             # Dependency injection container

tests/
├── unit/               # Vitest unit tests (mirrors src/ structure)
│   ├── domain/
│   ├── application/
│   └── infrastructure/
└── e2e/               # Playwright E2E tests (*.spec.ts)
```

### Key Architectural Rules

**Domain Layer Isolation**:
- Domain layer MUST NOT depend on any other layer
- No Chrome APIs, window objects, or infrastructure code in domain layer
- Domain contains pure business logic only

**Infrastructure Layer**:
- ONLY infrastructure layer may use Chrome APIs and browser-specific code
- All external dependencies must be wrapped in infrastructure services
- Services implement interfaces (ports) defined in application layer

**Application Layer**:
- Use Cases coordinate between domain and infrastructure
- Dependencies resolved via `container.ts` (tsyringe)
- One component method should call ideally one UseCase method

**Component Layer**:
- Cannot directly call Chrome APIs or window objects
- Must go through UseCases in application layer
- Follow Atomic Design pattern

### Dependency Injection

- **Container**: `src/infrastructure/di/container.ts`
- **Pattern**: Register interfaces and concrete implementations
- All application layer dependencies are injected via constructor using `@inject()` decorator
- Use `reflect-metadata` for decorator metadata

## Import Path Rules

**CRITICAL**: All imports MUST use absolute paths with configured aliases:

- **ソースコード (`src/` 配下)**: `src/*` 起点
- **テストコード (`tests/` 配下)**: `tests/*` 起点

Path aliases configured in `tsconfig.json`:
- `src/*` → `./src/*`
- `tests/*` → `./tests/*`
- `entrypoints/*` → `./src/entrypoints/*`

詳細は `docs/coding-standards/tests/common-rule/`（§1: インポートパスのルール）を参照してください。

## Object-Oriented Design Rules (ThoughtWorks Anthology)

See `docs/coding-standards/src/object-oriented-nine-rules.md` for the 9 rules and their ESLint implementations.

**Method Design**:
- Methods MUST use instance variables (exception: infrastructure layer)
- Don't create unused methods (no speculative coding like `isValid()` or `equals()`)

**Class Design**:
- When adding a class, add unit tests too（**テスト戦略書を先に作成すること**）
- Prefer modifying methods to use instance variables rather than adding new ones

## Testing Requirements

### Test Strategy Document (Required)

**CRITICAL**: Before writing any test code, create a test strategy document following the templates in `docs-rules/design/`.

- **Location**: `docs/design/src/[layer]/[category]/[ClassName]/[methodName].md` (mirrors src/ structure)
- **Templates**: 「docs/design/ 配下の設計ドキュメントを作成・編集する場合」セクションを参照
- **Workflow**: テスト戦略書作成 → テストコード実装

### テストを伴う実装時のTodoWrite使用

新規メソッド追加時は、TodoWriteで以下の順序でタスクを作成すること:

```text
1. テスト戦略書の作成（docs/design/src/[layer]/.../[methodName].md）
2. 実装コードの作成
3. テストコードの実装
```

**重要**: テストコードを書く前に、必ずテスト戦略書の作成タスクを完了させること。

### Test Structure
- **Location**: Tests mirror `src/` directory structure in `tests/`
- **Granularity**: One test file per method minimum (split further if needed)
- **DO NOT group tests by class** - always split by method

### Test File Organization (Infrastructure Layer Example)
```text
tests/unit/infrastructure/[category]/[ServiceName]/
├── [methodName]/
│   ├── normal-cases.test.ts
│   ├── edge-cases.test.ts
│   ├── multiple-calls.test.ts
│   └── Abend/                      # Abnormal cases subdirectory
│       ├── error-cases.test.ts
│       ├── null-undefined-validation.test.ts
│       └── [external-api]-undefined-cases.test.ts
```

### Testing Standards
- **Required**: Add/update tests for ANY method you add or modify
- **Before PR**: MUST run tests and ensure they pass
- Infrastructure layer: Only test `di/` and `persistance/` subdirectories (others optional)
- Error case tests are optional but recommended for infrastructure layer

### Test Implementation Principles
- Consolidate redundant test cases with same input patterns
- Use `beforeEach` for setup, `afterEach` for cleanup
- Use `vi.clearAllMocks()` in beforeEach, `vi.resetAllMocks()` in afterEach
- For validation tests: test return value patterns, not detailed validation logic (covered in subclass tests)

### Test Frameworks
- **Unit tests**: Vitest with happy-dom (files: `*.test.ts` in `tests/`)
- **E2E tests**: Playwright (files: `*.spec.ts` in `tests/e2e/`)
- Run both: `make testall` or comprehensive `make testlint`

## WXT Framework Specifics

### Configuration
- Config file: `host-frontend-root/frontend-src-root/wxt.config.ts`
- **Required**: `srcDir: 'src'` must be set in config
- Dev server: Configurable via `WXT_DEV_HOST` and `WXT_DEV_PORT` env vars (default: localhost:3000)

### Entry Points
All entry points in `src/entrypoints/`:
- `background.ts` - Background service worker
- `content.ts` - Content script
- `popup/` - Popup UI directory
- `rules/` - Rules page directory
- `edit/` - Edit page directory

### Special Files
- `.wxt/tsconfig.json` - Generated by `npx wxt prepare` (DO NOT manually create)
- `matchUrl.ts` - Must be created from `matchUrl.ts.example` during setup

## Git Workflow

### Branch Strategy
- **Base branch**: `develop`
- **Branch naming**: Issue-based branches (e.g., `issue-086-docs-how-to-set-up`)
- See `.clinerules/02-workflow-automation/01-issue-launches/workflow-create-branch.md` for branch creation workflow
- See `.clinerules/02-workflow-automation/01-issue-launches/workflow-create-worktree.md` for branch creation with worktree setup workflow

### Documentation Structure
```text
docs/
├── issue-XXX/              # In-progress issue documentation
├── completed/issue-XXX/    # Completed issue documentation
└── issue-000/             # Template for new issues
```

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

- **実行しないもの**: `make unit`、`make e2e`、`make testall`、`make testlint`、`make check` 等のmakeコマンド
  - これらのコマンドはDocker内部で実行されるため、Claude Code Web環境では使用できません

テスト（ユニットテスト、E2Eテスト、lint等）はPRマージ時のCIで検証されます。

### セッション開始時（Claude Code Web用）

**重要**: Claude Code Webで新しいセッションを開始する場合は、**ブランチが既に指定されていても**、以下のスラッシュコマンドでIssue管理のセットアップを行ってください：

```text
/workflow-ccw-session-start
```

このワークフローは以下を行います：
- **pre-commitフックのセットアップ**（ESLint + import sorting）
- Issue番号の採番
- `docs/issue-nnn/` ディレクトリ作成
- ブランチ作成（既にブランチが指定されている場合はスキップ）
- PR作成リンクの表示

**注意**: pre-commitフックは`./scripts/ci/precommit-hook/main.sh`で手動でも設定可能です。

- **ブランチ命名規則**: `claude/issue-nnn-<branch-suffix>-<random5chars>`
  - Claude Code Webの制約により、ブランチ名は `claude/` で始める必要があります
- `gh` コマンドが使用できないため、このワークフローでは代替手段を使用します

### PR作成（Claude Code Web用）
ghコマンドが使用できないため、以下のURLフォーマットでPRを作成します：
```text
https://github.com/akAredminEogre/frog-frame-front/compare/develop...<ブランチ名>?expand=1
```

### PRマージ（Claude Code Web用）

PRをマージする際は以下のスラッシュコマンドを使用します：

```text
/workflow-ccw-merge-pull-request
```

このワークフローは以下を行います：
- **自動実行**: ドキュメントテンプレート削除、残ファイルコミット、ディレクトリ移動、変更のプッシュ
- **手動操作が必要**: PRのマージ（ブラウザからGitHub UIで実行）

ghコマンドが使用できないため、PRのマージはブラウザから手動で行う必要があります。

## Troubleshooting

### `.wxt/tsconfig.json` Not Found
This file is auto-generated. Run:
```bash
docker compose exec frontend npx wxt prepare
```

### Docker Layer Cache Optimization
The Dockerfile copies `package.json` and `package-lock.json` first, runs `npm install`, then copies source code. The `postinstall` script is designed to skip during build and run after full source code is available.

### Permission Issues
The Docker setup includes a `fix-permissions.sh` script that runs on container start to handle file permission issues between host and container.
