# ISSUE-109 PULL REQUEST

## タイトル
feat: Makeコマンドの追加とハイフンなし命名規則への統一

## 概要と理由

package.jsonのnpmスクリプト名が変更されたことに伴い（`test` → `test:unit`、`test-and-lint` → `test:lint`、`test-and-check` → `test:check`）、以下の対応を実施しました：

1. Makefileのコマンドを更新し、新しいnpmスクリプト名に対応
2. テスト関連のMakeコマンドを新規追加（`unit`, `e2e`, `testall`）
3. 最終的にすべてのテスト関連Makeコマンドをハイフンなし形式に統一（`testcheck`, `testlint`, `testall`）
4. 関連ドキュメントを網羅的に更新

この変更により、Makeコマンドとnpmスクリプトの命名規則が明確に分離され、ユーザーフレンドリーなインターフェースを提供しつつ、内部実装の柔軟性を保つことができます。

## 主な変更点

### 1. Makefileの更新
- 新規コマンドの追加:
  - `make unit` - ユニットテストのみ実行
  - `make e2e` - E2Eテストのみ実行
  - `make testall` - 全テスト実行（ユニット + E2E）
- コマンド名の変更:
  - `test-and-check` → `testcheck`
  - `test-and-lint` → `testlint`
  - `test-all` → `testall`
- `.PHONY`宣言の更新
- `help`コマンドの出力更新

### 2. ドキュメントの更新
- **CLAUDE.md**: Makeコマンドの参照を更新
- **README.md**: 利用可能なコマンド一覧を更新
- **.clinerules/**: ワークフロー関連ドキュメントのコマンド参照を更新
  - `05-project-specific-rules.md`
  - `02-workflow-automation/02-daily-scrum-starts/test-and-check-before-complete.md`
  - `02-workflow-automation/02-daily-scrum-starts/workflow-code-according-to-the-rules.md`
- **.claude/commands/**: Claude Codeコマンドの更新
- **docs/issue-000/PULL_REQUEST.md**: PRテンプレートのコマンド参照を更新

### 3. package.jsonの更新
- `test:all`スクリプト内の`npm run test`を`npm run test:unit`に更新
- `test:check`スクリプト内の`npm run test`を`npm run test:unit`に更新

### 4. 命名規則の統一

最終的な設計:

| レイヤー | 形式 | 例 |
|---------|------|-----|
| **Makeコマンド** | ハイフンなし | `make testall`, `make testcheck`, `make testlint` |
| **npmスクリプト** | コロン区切り | `npm run test:all`, `npm run test:check`, `npm run test:lint` |

Makefileは、ユーザーフレンドリーなハイフンなし形式のコマンドを提供し、内部でnpmスクリプトのコロン形式を呼び出す設計となっています。

## テスト方法
[動作確認の手順]
- `make testlint` で回帰テスト通過を確認
  - Unit tests: 280 passed (76 files)
  - E2E tests: 12 passed
  - knip: no unused code remains
  - Exit code: 0 (成功)
- 各Makeコマンドの動作確認:
  - `make unit` - ユニットテストのみ実行されることを確認
  - `make e2e` - E2Eテストのみ実行されることを確認
  - `make testall` - 全テストが実行されることを確認
  - `make testcheck` - テストと軽微なチェックが実行されることを確認

## 補足
[追加の文脈や注意点]

### 段階的な実装プロセス

この変更は6回のイテレーションを経て完成しました:

1. **01回目**: package.jsonのスクリプト名変更に対応（Makefile内部呼び出しの更新）
2. **02回目**: Makefileのコロン構文問題の解決（Makeターゲット名にコロンが使えないことを確認）
3. **03回目**: 残存参照の調査と設計方針の確認
4. **04回目**: Makeコマンド名の変更（`test-and-check` → `test-check`等）と新規コマンドの追加
5. **05回目**: ハイフンの除去（第1段階: `test-check` → `testcheck`等）
6. **06回目**: ハイフンの除去（第2段階: `test-all` → `testall`）

各ステップでレビューを受けながら進めることで、最終的に一貫性のある設計に到達しました。

### 後方互換性への配慮

- ワークフローファイル名（`.clinerules/`配下）は変更せず、内部で参照するコマンド名のみを更新
- `.claude/commands/test-and-check-before-complete.md`のファイル名は維持（後方互換性のため）

## 本スコープの対象外となったタスク

なし


<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
