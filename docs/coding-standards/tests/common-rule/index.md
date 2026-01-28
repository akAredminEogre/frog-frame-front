# テスト共通ルール

テストコード全般に適用される共通ルール。

## ルール一覧

| §  | ルール名 | 概要 |
|----|---------|------|
| 1 | [インポートパスのルール](./import-paths.md) | パスエイリアス使用、相対パス禁止 |
| 2 | [モックファイルの配置ルール](./mock-file-placement.md) | モック配置先、既存モック確認手順 |
| 3 | [テストデータの型注釈ルール](./test-data-type-annotations.md) | テストケース配列への型注釈 |
| 4 | [モック型キャストの禁止](./mock-type-cast-prohibition.md) | `as ReturnType<typeof vi.fn>` 禁止、`vi.mocked()` 使用 |
| 5 | [非同期処理中のState排他制御](./async-state-try-finally.md) | try/finally パターン |
| 6 | [テストケース配列のフィールド使用検証](./test-case-field-usage.md) | 定義したフィールドの使用漏れ防止 |
| 7 | [モック初期化・リセットの明示的呼び出し](./mock-init-reset.md) | beforeEach/afterEach での明示的呼び出し |

## カテゴリ別インデックス

### モック関連

- [§2 モックファイルの配置ルール](./mock-file-placement.md)
- [§4 モック型キャストの禁止](./mock-type-cast-prohibition.md)
- [§7 モック初期化・リセットの明示的呼び出し](./mock-init-reset.md)

### テストデータ関連

- [§3 テストデータの型注釈ルール](./test-data-type-annotations.md)
- [§6 テストケース配列のフィールド使用検証](./test-case-field-usage.md)

### インポート関連

- [§1 インポートパスのルール](./import-paths.md)

### 非同期処理関連

- [§5 非同期処理中のState排他制御](./async-state-try-finally.md)
