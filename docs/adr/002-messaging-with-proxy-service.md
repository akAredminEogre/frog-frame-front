# ADR-002: メッセージングに @webext-core/proxy-service を採用

## ステータス

採用

## コンテキスト

Chrome 拡張機能では、複数のコンテキスト（Background Script、Rules Page、Popup、Content Script）が存在し、コンテキスト間の通信にはメッセージングが必要となる。

標準の `chrome.runtime.sendMessage` API を使用した場合、以下の課題がある：

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

### サービス定義の基準

サービスの粒度は **ドメインエンティティ（集約ルート）単位** とする。

| 基準 | 説明 |
|------|------|
| 1サービス = 1エンティティ | 各サービスは1つのドメインエンティティに対応する |
| Gateway Interface との対応 | ADR-001 の Gateway Interface と 1:1 で対応させる |

この基準により以下を防止する：

- **肥大化の防止**: 全操作を1サービスに集約しない（エンティティごとに分離）
- **乱立の防止**: 操作ごとにサービスを分割しない（エンティティ単位でまとめる）

**ADR-001 との整合性**: Clean Architecture の Gateway Interface 層と同じ粒度でサービスを定義することで、アーキテクチャの一貫性を保つ。

**命名規約**: [メッセージング層 コーディング規約](../coding-standards/src/frameworks-and-drivers/messaging.md) 参照

### DTO の使用

**メッセージングでは DTO（Plain Object）を使用し、ドメインエンティティを直接送信しない。**

messaging ではデータは JSON シリアライズされて送信されるため、クラスインスタンスを送信すると受信側ではメソッドが消失した plain object となる。この技術的制約に対応するため、DTO を使用する。

### Entity-DTO 変換

**Entity と DTO の相互変換は専用の Mapper クラスで行う。**

| コンポーネント | 責務 |
|---------------|------|
| Repository | データアクセスの調整、Mapper への変換委譲 |
| Mapper | Entity ↔ DTO 相互変換 |
| MessagingService | DTO の受け渡し |

この分離により以下を実現する：
- **単一責任**: Repository は変換ロジックを持たない
- **テスタビリティ**: 変換ロジックを独立してテスト可能
- **Clean Architecture 準拠**: Entity が DTO を知らない設計

### DTO 定義の基準

DTO の粒度は以下の基準に従う：

| 種別 | 基準 | 説明 |
|------|------|------|
| エンティティ DTO | 1 DTO = 1 エンティティ | エンティティの全プロパティを含む。取得系操作の戻り値に使用 |
| 操作別 DTO | 1 DTO = 1 操作 | 操作に必要な最小限のデータのみ含む。更新系操作の引数に使用 |

**ADR-001 との整合性**: Gateway Interface のメソッドシグネチャと対応させる。

この基準により以下を防止する：

- **肥大化の防止**: 操作別 DTO に不要なデータを含めない
- **乱立の防止**: フィールドごとに DTO を分割しない（操作単位でまとめる）

**命名規約**: [メッセージング層 コーディング規約](../coding-standards/src/frameworks-and-drivers/messaging.md) 参照

## 理由

### 採用理由

1. **WXT 公式推奨**: WXT が推奨するメッセージングライブラリ
2. **型安全**: TypeScript の型推論が自動的に機能
3. **コード規約準拠**: switch 文が不要
4. **シンプル**: 通常のメソッド呼び出しと同じ感覚で使用可能
5. **一貫性**: すべてのコンテキストで同じパターンを使用

### トレードオフ

- 外部ライブラリへの依存が増加
- ライブラリの学習コスト
- Background Script での同期的な登録が必須

## 関連ドキュメント

- [ADR-001: Clean Architecture with Presenter Pattern](./001-clean-architecture-with-presenter-pattern.md)
- [ADR-003: DB アクセスを messaging 経由に統一し DTO を使用](./003-unified-db-access-via-messaging.md)
- [@webext-core/proxy-service - npm](https://www.npmjs.com/package/@webext-core/proxy-service)
- [WXT Messaging Guide](https://wxt.dev/guide/essentials/messaging)
