# テスト要件

→ テストコーディング規約は [`.clinerules/03-test-coding-standards.md`](../.clinerules/03-test-coding-standards.md) を参照

## テストフレームワーク

- **ユニットテスト**: Vitest（happy-dom使用）（`tests/` 配下の `*.test.ts`）
- **E2Eテスト**: Playwright（`tests/e2e/` 配下の `*.spec.ts`）
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
