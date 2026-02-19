# Architecture Overview

## Project Structure

```
frog-frame-front/
├── host-frontend-root/
│   └── frontend-src-root/    # フロントエンドソースコード
│       ├── src/              # アプリケーションコード
│       ├── tests/            # テストコード
│       └── wxt.config.ts
├── docs/                     # ドキュメント
├── CLAUDE.md
└── Makefile
```

## Clean Architecture Layers (src/)

```
src/
├── entrypoints/              # WXT entry points
│   ├── background.ts
│   ├── content.ts
│   ├── popup/
│   ├── rules/
│   └── edit/
├── components/               # React components (Atomic Design)
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── pages/
├── application/              # Application layer (Use Cases)
│   ├── usecases/
│   ├── ports/
│   └── types/
├── domain/                   # Domain layer (Business logic)
│   ├── entities/
│   ├── value-objects/
│   ├── constants/
│   └── errors/
├── infrastructure/           # Infrastructure layer
│   ├── browser/              # Chrome API wrappers
│   ├── persistence/          # Storage services
│   ├── windows/              # Window management
│   └── di/                   # Dependency injection container
└── utils/

tests/
├── unit/                     # Vitest unit tests
│   ├── domain/
│   ├── application/
│   └── infrastructure/
└── e2e/                      # Playwright E2E tests
```

## Key Architectural Rules

→ アーキテクチャルール詳細は [`.clinerules/01-coding-standards.md`](.clinerules/01-coding-standards.md) を参照

## Dependency Injection

- **Container**: `src/infrastructure/di/container.ts`
- **Pattern**: Register interfaces and concrete implementations
- All application layer dependencies are injected via constructor using `@inject()` decorator
- Use `reflect-metadata` for decorator metadata
