# テスト共通ルール

テストコード全般に適用される共通ルール。

## ルール一覧

| § | ルール名 | 概要 |
|---|---------|------|
| 1 | [モックファイルの配置ルール](./mock-file-placement.md) | モック配置先、既存モック確認手順 |
| 2 | [テストデータの型注釈ルール](./test-data-type-annotations.md) | テストケース配列への型注釈 |
| 3 | [モック型キャストの禁止](./mock-type-cast-prohibition.md) | `as ReturnType<typeof vi.fn>` 禁止、`vi.mocked()` 使用 |
| 4 | [テストケース配列のフィールド使用検証](./test-case-field-usage.md) | 定義したフィールドの使用漏れ防止 |
| 5 | [モック初期化・リセットの明示的呼び出し](./mock-init-reset.md) | beforeEach/afterEach での明示的呼び出し |

## カテゴリ別インデックス

### モック関連

- [§1 モックファイルの配置ルール](./mock-file-placement.md)
- [§3 モック型キャストの禁止](./mock-type-cast-prohibition.md)
- [§5 モック初期化・リセットの明示的呼び出し](./mock-init-reset.md)

### テストデータ関連

- [§2 テストデータの型注釈ルール](./test-data-type-annotations.md)
- [§4 テストケース配列のフィールド使用検証](./test-case-field-usage.md)

## 関連ドキュメント

### 共通ルール（src/tests共通）

インポートパスのルールはソースコード・テストコード共通のため、以下を参照：

- [CLAUDE.md - Import Path Rules](../../../../CLAUDE.md#import-path-rules)

### ソースコード実装ルール

非同期処理中のState排他制御（try/finally パターン）については、以下を参照：

- [状態ガード/ロックの実装ルール](../../src/frameworks-and-drivers/ui/react-hooks/state-guard.md)
