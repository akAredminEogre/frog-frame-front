# 受け入れ条件

## ユーザーストーリー要件

- [ ] AC-1: `confirmImport()` 実行時、削除・作成が1つのトランザクション内でバッチ処理される
- [ ] AC-2: 1000件のルールインポートが逐次処理より有意に高速に完了する
- [ ] AC-3: 削除または作成中にエラーが発生した場合、トランザクション全体がロールバックされる（部分適用なし）
- [ ] AC-4: インポート後のルール一覧が JSON ファイルの内容と完全に一致する

## 技術要件

- [ ] AC-5: `IRewriteRuleRepository` に `bulkDelete(ids: string[]): Promise<void>` が追加されている
- [ ] AC-6: `IRewriteRuleRepository` に `bulkCreate(rules: RewriteRule[]): Promise<void>` が追加されている
- [ ] AC-7: `DexieRewriteRuleRepository` が Dexie の `db.transaction()` を用いて原子性を保証している
- [ ] AC-8: `ImportRulesJsonInteractor.confirmImport()` が逐次ループを廃止し `bulkDelete` + `bulkCreate` を呼び出している
- [ ] AC-9: 既存の全ユニットテストおよび E2E テストが通過する
- [ ] AC-10: Clean Architecture の層構造が維持されている（Repository インターフェース経由のみ）
