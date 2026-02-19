# Architecture Overview

## Clean Architecture Layers

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

## Key Architectural Rules

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

## Dependency Injection

- **Container**: `src/infrastructure/di/container.ts`
- **Pattern**: Register interfaces and concrete implementations
- All application layer dependencies are injected via constructor using `@inject()` decorator
- Use `reflect-metadata` for decorator metadata
