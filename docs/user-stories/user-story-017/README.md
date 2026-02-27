# User Story 017: ImportRulesJson I/O バッチ最適化（Dexie bulk 操作）

## ストーリー

> ルールJSONインポート時の削除・作成処理を Dexie のバッチ操作（bulkDelete / bulkCreate）に切り替えることで、大量ルール（最大1000件）のインポートを高速化し、部分適用リスクを排除したい

## 概要

`ImportRulesJsonInteractor.confirmImport()` は現在、削除・作成を1件ずつ逐次 `await` している。
最大1000件のルールが対象となる場合、最大2000回の逐次 I/O が発生し、パフォーマンス上の懸念と、処理途中でエラーが発生した際の「部分削除・部分作成」リスクがある。

本ユーザーストーリーでは、`IRewriteRuleRepository` インターフェースに一括操作メソッドを追加し、Dexie の `db.transaction()` / `bulkDelete()` / `bulkCreate()` を活用したバッチ処理へ切り替える。

## 背景

PR#394 レビュー（GitHub Copilot コメント id:2856697497）で指摘済み。
本 PR（feat/rule-json-import）では変更範囲が広いことを理由に見送り、将来最適化候補として本ユーザーストーリーを作成した。

**該当ファイル**:
- `host-frontend-root/frontend-src-root/src/application-business-rules/interactors/ImportRulesJsonInteractor.ts`
- `host-frontend-root/frontend-src-root/src/application-business-rules/ports/gateway/IRewriteRuleRepository.ts`
- `host-frontend-root/frontend-src-root/src/frameworks-and-drivers/persistence/DexieRewriteRuleRepository.ts`

## 現状

### 現在の実装（逐次 I/O）

```typescript
// confirmImport() 内
for (const rule of currentArray) {
  await this.repository.delete(rule.id);  // 1000件 × 1回 = 1000回
}
for (const rule of rulesToImport) {
  await this.repository.create(rule);     // 1000件 × 1回 = 1000回
}
// 合計: 最大 2000回の逐次 I/O
```

### 課題

| 課題 | 詳細 |
|------|------|
| パフォーマンス | 最大2000回の逐次 I/O（IndexedDB ラウンドトリップ） |
| 部分適用リスク | 削除完了後・作成中にエラーが発生すると、一部のルールが失われる |
| インターフェース未対応 | `IRewriteRuleRepository` に `bulkDelete` / `bulkCreate` がない |

## 開発戦略

### Phase 1: インターフェース拡張

- [ ] `IRewriteRuleRepository` に `bulkDelete(ids: string[]): Promise<void>` を追加
- [ ] `IRewriteRuleRepository` に `bulkCreate(rules: RewriteRule[]): Promise<void>` を追加

### Phase 2: DexieRewriteRuleRepository 実装

- [ ] `DexieRewriteRuleRepository.bulkDelete()` を Dexie `db.transaction()` + `bulkDelete()` で実装
- [ ] `DexieRewriteRuleRepository.bulkCreate()` を Dexie `db.transaction()` + `bulkAdd()` で実装
- [ ] トランザクション内で削除・作成を一括実行（原子性保証）

### Phase 3: ImportRulesJsonInteractor 更新

- [ ] `confirmImport()` を `bulkDelete` + `bulkCreate` に置き換え
- [ ] エラー時のロールバック挙動を確認

### Phase 4: テスト整備

- [ ] `DexieRewriteRuleRepository.bulkDelete` / `bulkCreate` のユニットテスト
- [ ] `ImportRulesJsonInteractor.confirmImport()` のユニットテスト（バッチ操作版）
- [ ] E2E テスト: 1000件規模のインポートが正常完了すること（パフォーマンステスト）

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
