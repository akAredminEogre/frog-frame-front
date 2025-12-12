# ADR-003: DB アクセスを messaging 経由に統一し DTO を使用

## ステータス

採用

## コンテキスト

### IndexedDB アクセス制約

Chrome 拡張機能では、複数のコンテキスト（Background Script、Rules Page、Content Script）が存在し、それぞれ IndexedDB へのアクセス可否が異なる：

| コンテキスト | IndexedDB 直接アクセス | messaging 経由 |
|-------------|----------------------|----------------|
| Background Script | ✅ 可能 | - |
| Rules Page (別タブ) | ✅ 可能 | ✅ 可能 |
| Popup | ✅ 可能 | ✅ 可能 |
| Content Script | ❌ 不可 | ✅ 必須 |

Rules Page や Popup は技術的には IndexedDB に直接アクセスできるが、Content Script は messaging 経由でのみ DB にアクセスできる。

### JSON シリアライズ制約

messaging ではデータは JSON シリアライズされて送信される。これにより以下の制約が生じる：

| 送信データ | シリアライズ後 |
|-----------|--------------|
| プリミティブ（string, number, boolean） | ✅ そのまま保持 |
| Plain Object | ✅ そのまま保持 |
| クラスインスタンス | ⚠️ プロパティのみ保持（メソッド消失） |
| 関数 | ❌ 送信不可 |

クラスインスタンスを送信すると、受信側ではメソッドが消失した plain object となり、メソッド呼び出しがエラーになる。

## 決定

### DB アクセスの統一

**すべてのコンテキストから DB アクセスは messaging 経由で Background Script に集約する。**

技術的に直接アクセス可能な場合でも、messaging を使用する。

DTO の使用規約と定義基準については ADR-002 を参照。

## RewriteRule の DTO 定義

DB アクセスに使用する RewriteRule 固有の DTO を定義する。

### RewriteRuleDTO（エンティティ全体）

エンティティの全プロパティを含む DTO。`getById` の応答などで使用。

### 操作別 DTO

| DTO名 | 用途 | 構造 |
|-------|------|------|
| `GetByIdRequestDTO` | ルール取得要求 | `{ id: number }` |
| `UpdateRuleActiveRequestDTO` | 有効/無効トグル | `{ id: number, isActive: boolean }` |

### 変換責務

| コンポーネント | 責務 |
|---------------|------|
| `ChromeRuntimeRewriteRuleRepository` | DTO → Entity 再構築（受信時）、Entity → DTO 変換（送信時） |
| `RewriteRuleMessagingService` | proxy-service として DTO を受け渡し（ADR-002 参照） |
| `DexieRewriteRuleRepository` | DTO ↔ DB レコード 変換 |

## 理由

### 採用理由

**DB アクセス統一**:
1. **一貫性**: すべてのコンテキストで同じパターンを使用
2. **単一責任**: DB アクセスロジックが Background Script に集約
3. **データ整合性**: 単一の DB アクセスポイントにより競合を回避
4. **拡張性**: chrome.tabs API 等の Background 限定 API との連携が容易
5. **テスト容易性**: messaging をモックすることで各コンテキストを独立してテスト可能

**DTO 使用**:
1. **技術的制約への対応**: JSON シリアライズの制約を明示的に扱う
2. **明確な境界**: messaging 層でのデータ変換責務を明確化
3. **軽量な通信**: 必要なデータのみ送信することで通信量を削減
4. **エラー防止**: 受信側でメソッド呼び出しエラーを防止

### トレードオフ

- Rules Page / Popup は直接アクセスより若干のオーバーヘッドが発生
- 送信側でエンティティから DTO への変換が必要
- 受信側で DTO からエンティティへの再構築が必要

## 関連ドキュメント

- [ADR-001: Clean Architecture with Presenter Pattern](./001-clean-architecture-with-presenter-pattern.md)
- [ADR-002: メッセージングに @webext-core/proxy-service を採用](./002-messaging-with-proxy-service.md)
- [Toggle Rule Active 設計](../design/pages/rule-list/features/toggle-rule-active/)
