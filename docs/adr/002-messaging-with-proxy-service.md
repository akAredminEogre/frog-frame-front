# ADR-002: メッセージングに @webext-core/proxy-service を採用

## ステータス

採用

## コンテキスト

Chrome 拡張機能では、複数のコンテキスト（Background Script、Rules Page、Content Script）が存在する。
Content Script は IndexedDB に直接アクセスできないため、messaging 経由で Background Script に DB アクセスを集約する必要がある。

しかし、標準の `chrome.runtime.sendMessage` API を使用した場合、以下の課題がある：

1. **MessageHandler の肥大化**: メッセージタイプごとに switch/case が増加
2. **型安全性の欠如**: メッセージの型チェックが手動
3. **ボイラープレート**: Message 型（type + payload）の定義が冗長
4. **コード規約との不整合**: switch 文を避け HashMap を推奨する方針と矛盾

## 決定

**メッセージングに `@webext-core/proxy-service` を採用し、すべてのコンテキストから DB アクセスは Background Script に集約する。**

このライブラリは WXT が公式に推奨するメッセージングソリューションであり、Background Script で実行するサービスを他のコンテキストから透過的に呼び出せる。

```
Rules Page  ─┐
Popup       ─┼─→ proxy-service ─→ Background (RewriteRuleService) ─→ DexieRewriteRuleRepository
Content.ts  ─┘
```

### 方式

- `defineProxyService` でサービスを定義
- Background Script で同期的に登録
- 他のコンテキストから通常のメソッド呼び出しと同じ感覚で使用

## 理由

### 採用理由

1. **WXT 公式推奨**: WXT が推奨するメッセージングライブラリ
2. **型安全**: TypeScript の型推論が自動的に機能
3. **コード規約準拠**: switch 文が不要
4. **シンプル**: 通常のメソッド呼び出しと同じ感覚で使用可能
5. **一貫性**: すべてのコンテキストで同じパターンを使用
6. **データ整合性**: 単一の DB アクセスポイントにより競合を回避

### トレードオフ

- 外部ライブラリへの依存が増加
- ライブラリの学習コスト
- Background Script での同期的な登録が必須
- Rules Page / Popup は直接アクセスより若干のオーバーヘッドが発生

## 関連ドキュメント

- [ADR-001: Clean Architecture with Presenter Pattern](./001-clean-architecture-with-presenter-pattern.md)
- [ADR-003: DB アクセスを messaging 経由に統一し DTO を使用](./003-unified-db-access-via-messaging.md)
- [@webext-core/proxy-service - npm](https://www.npmjs.com/package/@webext-core/proxy-service)
- [WXT Messaging Guide](https://wxt.dev/guide/essentials/messaging)
