# テスト要件

→ テストコーディング規約は [`docs/coding-standards/tests/`](../docs/coding-standards/tests/) を参照

主要ドキュメント:

- [`common-rule/index.md`](../docs/coding-standards/tests/common-rule/index.md) - 共通テストルール
- [`array-based-test.md`](../docs/coding-standards/tests/array-based-test.md) - 配列ベーステスト
- [`e2e/index.md`](../docs/coding-standards/tests/e2e/index.md) - E2Eテスト規約
- [`unit/infrastructure.md`](../docs/coding-standards/tests/unit/infrastructure.md) - ユニットテスト（インフラ層）

## ローカルテスト方針（AI駆動開発版）

**原則**: ローカルでの全テスト実行は不要。CI/CDに委譲する。

| タイミング | 実行すべきテスト |
|-----------|----------------|
| 実装中 | 変更した機能に関連するユニットテストのみ（`npx vitest run path/to/unit.test.ts`） |
| PR作成前 | Lint のみ（`make lint`） |
| PR作成後 | CI/CDが全テストを自動実行（確認はCIログを参照） |
| E2E確認 | Docker使用は CI/CD で確認。ローカル実行は任意 |

> **理由**: `make testall` / `make testlint` によるフル実行は時間がかかり並行開発のスピードを阻害する。
> CI/CDが全テストをカバーするため、ローカルでは差分テストのみで十分。

## Dockerの使用方針

- **基本**: Dockerコンテナの使用は**実際の挙動確認が必要な場合のみ**（最小限）
- **MAS並行開発**: 各足軽はDockerを使わずに開発する（ユニットテスト＋Lint のみ）
- **Docker起動コマンド**: `make wt-dev BRANCH=branch-name`（必要な場合のみ）

## テストフレームワーク

- **ユニットテスト**: Vitest（happy-dom使用）（`tests/` 配下の `**/*.test.ts`）
- **E2Eテスト**: Playwright（`tests/e2e/` 配下の `**/*.spec.ts`）
- 全テスト実行（CI/CDまたは必要時のみ）: `make testall`（テストのみ）または `make testlint`（テスト＋リント包括）

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
   - **実装前**: 既存モック検索を実行（[`docs/coding-standards/tests/common-rule/mock-file-placement.md`](../docs/coding-standards/tests/common-rule/mock-file-placement.md) 参照）
   - **実装後**: テスト戦略書との整合性確認
4. シグネチャ変更時は必ずテスト戦略書を更新
