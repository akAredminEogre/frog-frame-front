# Testing Requirements

## Test Structure

- **Location**: Tests mirror `src/` directory structure in `tests/`
- **Granularity**: One test file per method minimum (split further if needed)
- **DO NOT group tests by class** - always split by method

## Test File Organization (Infrastructure Layer Example)

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

## Testing Standards

- **Required**: Add/update tests for ANY method you add or modify
- **Before PR**: MUST run tests and ensure they pass
- Infrastructure layer: Only test `di/` and `persistance/` subdirectories (others optional)
- Error case tests are optional but recommended for infrastructure layer

## Test Implementation Principles

- Consolidate redundant test cases with same input patterns
- Use `beforeEach` for setup, `afterEach` for cleanup
- Use `vi.clearAllMocks()` in beforeEach, `vi.resetAllMocks()` in afterEach
- For validation tests: test return value patterns, not detailed validation logic (covered in subclass tests)

## Test Frameworks

- **Unit tests**: Vitest with happy-dom (files: `*.test.ts` in `tests/`)
- **E2E tests**: Playwright (files: `*.spec.ts` in `tests/e2e/`)
- Run both: `make testall` or comprehensive `make testlint`

## Test Strategy Document (Required)

**CRITICAL**: Before writing any test code, create a test strategy document.

- **Location**: `docs/design/src/[layer]/[category]/[ClassName]/[methodName].md`
- **Templates**:
  - 単体: `docs-rules/design/05-test-strategy.md`
  - 結合: `docs-rules/design/06-integration-test-strategy.md`
  - E2E: `docs-rules/design/07-e2e-test-strategy/`

## テストを伴う実装時の TodoWrite 使用

新規メソッド追加時は、TodoWrite で以下の順序でタスクを作成すること:

1. テスト戦略書の作成
2. 実装コードの作成
3. テストコードの実装
