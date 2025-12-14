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

Mapper は変換だけでなく、MessagingService への呼び出しも担当する。これにより Repository は DTO を意識せずに済む。

#### 依存性逆転の適用

Clean Architecture の依存ルールを守るため、Mapper（interface-adapters 層）が MessagingService（frameworks-and-drivers 層）を直接参照することを避ける。

```
[interface-adapters]
  IRewriteRuleMessagingPort (interface)
  RewriteRuleMapper → uses → IRewriteRuleMessagingPort

[frameworks-and-drivers]
  RewriteRuleMessagingService implements IRewriteRuleMessagingPort
```

| コンポーネント | 層 | 責務 |
|---------------|-----|------|
| Repository | frameworks-and-drivers | Mapper への委譲のみ（DTO を意識しない） |
| Mapper | interface-adapters | Entity ↔ DTO 変換 + IRewriteRuleMessagingPort 経由で通信 |
| IRewriteRuleMessagingPort | interface-adapters | MessagingService の抽象化（Port） |
| MessagingService | frameworks-and-drivers | IRewriteRuleMessagingPort を実装、DTO の実際の送受信 |

この分離により以下を実現する：
- **依存性逆転**: interface-adapters → frameworks-and-drivers の直接依存を回避
- **Repository の単純化**: Repository は Entity のみを扱い、DTO 変換を知らない
- **テスタビリティ**: Mapper のテストで IRewriteRuleMessagingPort をモック可能
- **Clean Architecture 準拠**: 依存は内向き（outer → inner）に保たれる

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

## 影響ドキュメント

このADRが変更された場合、以下のドキュメントも更新が必要：

- [ADR-003: DB アクセスを messaging 経由に統一し DTO を使用](./003-unified-db-access-via-messaging.md) - DTO 定義、変換責務
- 各機能の設計ドキュメントのうち、`01-class-design.md`、`02-sequence.puml`

## 関連ドキュメント

- [ADR-001: Clean Architecture with Presenter Pattern](./001-clean-architecture-with-presenter-pattern.md)
- [ADR-003: DB アクセスを messaging 経由に統一し DTO を使用](./003-unified-db-access-via-messaging.md)
- [@webext-core/proxy-service - npm](https://www.npmjs.com/package/@webext-core/proxy-service)
- [WXT Messaging Guide](https://wxt.dev/guide/essentials/messaging)
