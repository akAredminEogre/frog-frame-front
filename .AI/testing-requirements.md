# テスト要件

→ テストコーディング規約は [`docs/coding-standards/tests/`](../docs/coding-standards/tests/) を参照

主要ドキュメント:

- [`common-rule/index.md`](../docs/coding-standards/tests/common-rule/index.md) - 共通テストルール
- [`array-based-test.md`](../docs/coding-standards/tests/array-based-test.md) - 配列ベーステスト
- [`e2e/index.md`](../docs/coding-standards/tests/e2e/index.md) - E2Eテスト規約
- [`unit/infrastructure.md`](../docs/coding-standards/tests/unit/infrastructure.md) - ユニットテスト（インフラ層）
- [`testing-policy.md`](../docs/coding-standards/tests/testing-policy.md) - テスト実行方針（ローカル実行・Docker・フレームワーク・テスト戦略書）

> **注意**: E2Eスペックファイルの分割・統合・リネームを行う場合は、[`.AI/tests/e2e/consistency-maintenance-guideline.md`](tests/e2e/consistency-maintenance-guideline.md) を必ず参照すること。

## タスク完了前の確認

**ローカルでの全テスト実行は不要**。CI/CDに委譲する方針。

タスク完了前に実行すること:

```bash
make lint           # Lintチェック（必須）
```

```bash
# 実装した機能のユニットテストのみ（推奨）
npx vitest run path/to/unit.test.ts
```

**注意**: Claude Code Web環境では `make` コマンドが使用できません。詳細は [.AI/claude-code-web-workflow.md](./claude-code-web-workflow.md) を参照してください。

> `make testlint`（全テスト）はCIで自動実行される。ローカルでのフル実行は任意。
