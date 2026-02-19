# Testing Requirements

→ テストコーディング規約は [`.clinerules/03-test-coding-standards.md`](.clinerules/03-test-coding-standards.md) を参照

## Test Frameworks

- **Unit tests**: Vitest with happy-dom (`*.test.ts` in `tests/`)
- **E2E tests**: Playwright (`*.spec.ts` in `tests/e2e/`)
- Run both: `make testall` or comprehensive `make testlint`

## Test Strategy Document

**CRITICAL**: Before writing any test code, create a test strategy document.

- **Location**: `docs/design/src/[layer]/[category]/[ClassName]/[methodName].md`
- **Templates**:
  - 単体: `docs-rules/design/05-test-strategy.md`
  - 結合: `docs-rules/design/06-integration-test-strategy.md`
  - E2E: `docs-rules/design/07-e2e-test-strategy/`

## 実装時のタスク順序

新規メソッド追加時は以下の順序で作業すること:

1. テスト戦略書の作成
2. 実装コードの作成
3. テストコードの実装
