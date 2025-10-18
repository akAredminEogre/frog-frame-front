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

This project includes additional guidelines and automated workflows defined in the `.clinerules/` directory:

### Coding Standards
- **`.clinerules/01-coding-standards.md`** - Core coding conventions including:
  - Import path rules (absolute paths from `src`)
  - Object-oriented design rules (ThoughtWorks Anthology 9 principles)
  - Clean Architecture layer dependencies
  - System design principles

### Test Standards
- **`.clinerules/03-test-coding-standards.md`** - Test coding conventions
- **`.clinerules/03-test-coding-standards/`** - Detailed test guidelines:
  - Common test rules (array-based tests, JSDoc requirements)
  - E2E test rules (console error handling)

### Project-Specific Configuration
- **`.clinerules/05-project-specific-rules.md`** - Project-specific constraints:
  - WXT framework requirements
  - Repository information (branch strategy, PR process)
  - Pre-completion checks (`test-and-check` workflow)

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
```

### Development (After Initial Setup)
```bash
make dev            # Start development server (stops containers, restarts, and runs dev server)
make down           # Stop Docker containers
make ps             # List running containers
```

### Inside Container Commands
After `make dev` is running, open a new terminal for these commands:

```bash
# Testing and linting (REQUIRED before completing any task)
make test-and-lint

# Quick check (tests with warnings, softer than test-and-lint)
make test-and-check

# Individual test commands
docker compose exec frontend npm run test           # Unit tests only
docker compose exec frontend npm run test:e2e       # E2E tests only
docker compose exec frontend npm run test:all       # Both unit and E2E tests

# Code quality checks
docker compose exec frontend npm run compile        # TypeScript compilation check
docker compose exec frontend npm run lint           # Run ESLint
docker compose exec frontend npm run lint:fix       # Auto-fix ESLint issues

# Unused code detection and cleanup
docker compose exec frontend npm run unused:complete    # Remove unused code
docker compose exec frontend npm run knip:all           # Check for unused exports/dependencies
```

### Critical Pre-Completion Check
**IMPORTANT**: Before marking any task as complete, you MUST run:
```bash
make test-and-lint
```
This command runs comprehensive checks including tests, unused code detection, and linting. Do NOT proceed if this command fails.

## Architecture Overview

### Clean Architecture Layers

```
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

**CRITICAL**: All imports MUST use absolute paths starting from `src`:

```typescript
// ✅ Correct
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';

// ❌ Wrong
import { RewriteRule } from '../domain/entities/RewriteRule/RewriteRule';
import { RewriteRule } from '@/domain/entities/RewriteRule/RewriteRule';
```

Path aliases configured in `tsconfig.json`:
- `src/*` → `./src/*`
- `tests/*` → `./tests/*`
- `entrypoints/*` → `./src/entrypoints/*`

## Object-Oriented Design Rules (ThoughtWorks Anthology)

These 9 rules are strictly enforced:

1. One level of indentation per method
2. Don't use else clauses
3. Wrap all primitives and strings (exceptions: test mocks, sendMessage parameters, catch error objects)
4. One dot per line (exception: Chrome API calls)
5. Don't abbreviate names
6. Keep all entities small
7. Maximum 2 instance variables per class
8. Use first-class collections
9. No getters/setters/properties

**Method Design**:
- Methods MUST use instance variables (exception: infrastructure layer)
- Don't create unused methods (no speculative coding like `isValid()` or `equals()`)

**Class Design**:
- When adding a class, add unit tests too
- Prefer modifying methods to use instance variables rather than adding new ones

## Testing Requirements

### Test Structure
- **Location**: Tests mirror `src/` directory structure in `tests/`
- **Granularity**: One test file per method minimum (split further if needed)
- **DO NOT group tests by class** - always split by method

### Test File Organization (Infrastructure Layer Example)
```
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
- Run both: `npm run test:all` or comprehensive `npm run test-and-lint`

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
- See `.clinerules/02-workflow-automation/01-issue-launches/workflow:create-branch.md` for branch creation workflow

### Documentation Structure
```
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
