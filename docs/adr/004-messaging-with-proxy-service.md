# ADR-004: メッセージングに @webext-core/proxy-service を採用

## ステータス

採用

## コンテキスト

ADR-002 により、すべてのコンテキストから DB アクセスは messaging 経由で Background Script に集約することが決定された。ADR-003 により、メッセージングでは DTO を使用することが決定された。

しかし、標準の `chrome.runtime.sendMessage` API を使用した場合、以下の課題がある：

1. **MessageHandler の肥大化**: メッセージタイプごとに switch/case が増加
2. **型安全性の欠如**: メッセージの型チェックが手動
3. **ボイラープレート**: Message 型（type + payload）の定義が冗長
4. **コード規約との不整合**: switch 文を避け HashMap を推奨する方針と矛盾

## 決定

**メッセージングに `@webext-core/proxy-service` を採用する。**

このライブラリは WXT が公式に推奨するメッセージングソリューションであり、Background Script で実行するサービスを他のコンテキストから透過的に呼び出せる。

### 方式

- `defineProxyService` でサービスを定義
- Background Script で同期的に登録
- 他のコンテキストから通常のメソッド呼び出しと同じ感覚で使用

### ADR-003 との関係

ADR-003 で定義した DTO 型（RewriteRuleDTO, UpdateRuleActiveDTO 等）は引き続き使用する。proxy-service はメソッド引数・戻り値として DTO を使用する。

## 理由

### 採用理由

1. **WXT 公式推奨**: WXT が推奨するメッセージングライブラリ
2. **型安全**: TypeScript の型推論が自動的に機能
3. **コード規約準拠**: switch 文が不要
4. **シンプル**: 通常のメソッド呼び出しと同じ感覚で使用可能
5. **IndexedDB に最適**: Background Script での DB アクセスに特化した設計

### トレードオフ

- 外部ライブラリへの依存が増加
- ライブラリの学習コスト
- Background Script での同期的な登録が必須

## 関連ドキュメント

- [ADR-002: DB アクセスを messaging 経由に統一](./002-unified-db-access-via-messaging.md)
- [ADR-003: メッセージングでは DTO を使用](./003-messaging-uses-dto-not-entity.md)
- [@webext-core/proxy-service - npm](https://www.npmjs.com/package/@webext-core/proxy-service)
- [WXT Messaging Guide](https://wxt.dev/guide/essentials/messaging)
