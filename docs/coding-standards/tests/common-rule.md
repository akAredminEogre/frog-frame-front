# テスト共通ルール

テストコード全般に適用される共通ルール。

**詳細は [common-rule/index.md](./common-rule/index.md) を参照。**

## ルール一覧

| § | ルール名 | ファイル |
|---|---------|----------|
| 1 | モックファイルの配置ルール | [mock-file-placement.md](./common-rule/mock-file-placement.md) |
| 2 | テストデータの型注釈ルール | [test-data-type-annotations.md](./common-rule/test-data-type-annotations.md) |
| 3 | モック型キャストの禁止 | [mock-type-cast-prohibition.md](./common-rule/mock-type-cast-prohibition.md) |
| 4 | テストケース配列のフィールド使用検証 | [test-case-field-usage.md](./common-rule/test-case-field-usage.md) |
| 5 | モック初期化・リセットの明示的呼び出し | [mock-init-reset.md](./common-rule/mock-init-reset.md) |

## 関連ドキュメント

インポートパスのルールはソースコード・テストコード共通のため、[CLAUDE.md - Import Path Rules](../../../CLAUDE.md#import-path-rules) を参照。

非同期処理中のState排他制御（try/finally パターン）については、[状態ガード/ロックの実装ルール](../src/frameworks-and-drivers/ui/react-hooks/state-guard.md) を参照。
