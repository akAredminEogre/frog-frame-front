# テスト共通ルール

テストコード全般に適用される共通ルール。

**詳細は [common-rule/index.md](./common-rule/index.md) を参照。**

## ルール一覧

| § | ルール名 | ファイル |
| --- | --------- | ---------- |
| 1 | インポートパスのルール | [import-paths.md](./common-rule/import-paths.md) |
| 2 | モックファイルの配置ルール | [mock-file-placement.md](./common-rule/mock-file-placement.md) |
| 3 | テストデータの型注釈ルール | [test-data-type-annotations.md](./common-rule/test-data-type-annotations.md) |
| 4 | モック型キャストの禁止 | [mock-type-cast-prohibition.md](./common-rule/mock-type-cast-prohibition.md) |
| 5 | テストケース配列のフィールド使用検証 | [test-case-field-usage.md](./common-rule/test-case-field-usage.md) |
| 6 | モック初期化・リセットの明示的呼び出し | [mock-init-reset.md](./common-rule/mock-init-reset.md) |

## 関連ドキュメント

非同期処理中のState排他制御（try/finally パターン）については、ソースコード実装ルールを参照：

- [状態ガード/ロックの実装ルール](../src/frameworks-and-drivers/ui/react-hooks/state-guard.md)
