# テスト要件

→ テストコーディング規約は [`docs/coding-standards/tests/`](../docs/coding-standards/tests/) を参照

主要ドキュメント:

- [`common-rule/index.md`](../docs/coding-standards/tests/common-rule/index.md) - 共通テストルール
- [`array-based-test.md`](../docs/coding-standards/tests/array-based-test.md) - 配列ベーステスト
- [`e2e/index.md`](../docs/coding-standards/tests/e2e/index.md) - E2Eテスト規約
- [`unit/infrastructure.md`](../docs/coding-standards/tests/unit/infrastructure.md) - ユニットテスト（インフラ層）

## テストフレームワーク

- **ユニットテスト**: Vitest（happy-dom使用）（`tests/` 配下の `**/*.test.ts`）
- **E2Eテスト**: Playwright（`tests/e2e/` 配下の `**/*.spec.ts`）
- 全テスト実行: `make testall`（テストのみ）または `make testlint`（テスト＋リント包括）

> **注意**: E2Eスペックファイルの分割・統合・リネームを行う場合は、[`.AI/tests/e2e/consistency-maintenance-guideline.md`](tests/e2e/consistency-maintenance-guideline.md) を必ず参照すること。

## テスト戦略書

**重要**: テストコードを書く前に、テスト戦略書を作成すること。

- **保存先**: `docs/design/src/[layer]/[category]/[ClassName]/[methodName].md`
- **テンプレート**:
  - 単体: `docs-rules/design/05-test-strategy.md`
  - 結合: `docs-rules/design/06-integration-test-strategy.md`
  - E2E: `docs-rules/design/07-e2e-test-strategy/`

## 実装時のタスク順序

新規メソッド追加時は以下の順序で作業すること:

1. テスト戦略書の作成
2. 実装コードの作成
3. テストコードの実装
