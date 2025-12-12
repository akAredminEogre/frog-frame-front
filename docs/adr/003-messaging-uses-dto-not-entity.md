# ADR-003: メッセージングでは DTO を使用し、ドメインエンティティを送信しない

## ステータス

採用

## コンテキスト

Chrome 拡張機能の messaging（chrome.runtime.sendMessage）では、データは JSON シリアライズされて送信される。これにより以下の制約が生じる：

| 送信データ | シリアライズ後 |
|-----------|--------------|
| プリミティブ（string, number, boolean） | ✅ そのまま保持 |
| Plain Object | ✅ そのまま保持 |
| クラスインスタンス | ⚠️ プロパティのみ保持（メソッド消失） |
| 関数 | ❌ 送信不可 |

クラスインスタンスを送信すると、受信側ではメソッドが消失した plain object となり、メソッド呼び出しがエラーになる。

## 決定

**メッセージングでは DTO（Plain Object）を使用し、ドメインエンティティを直接送信しない。**

受信側で必要に応じてエンティティを再構築する。

## 適用パターン

### 操作に応じた DTO を使用

操作に必要な最小限のデータを DTO として定義する。

ADR-004 により、メッセージングには @webext-core/proxy-service を使用する。
proxy-service のメソッド引数・戻り値として DTO を使用する。

## DTO 型定義

メッセージングで使用する DTO の型を以下のように定義する。
これにより、シリアライズ/デシリアライズ処理の再利用性が向上する。

### RewriteRuleDTO（エンティティ全体）

エンティティの全プロパティを含む DTO。`getById` の応答などで使用。

### 操作別 DTO

操作に必要な最小限のデータのみを含む DTO：

| DTO名 | 用途 | 構造 |
|-------|------|------|
| `UpdateRuleActiveDTO` | 有効/無効トグル | `{ id: number, isActive: boolean }` |

**補足**: 単一のプリミティブ値（例: `id: number`）は DTO にラップせず直接引数として渡す。

### 変換責務

| コンポーネント | 責務 |
|---------------|------|
| `ChromeRuntimeRewriteRuleRepository` | DTO → Entity 再構築（受信時）、Entity → DTO 変換（送信時） |
| `RewriteRuleService` | proxy-service として DTO を受け渡し（ADR-004 参照） |
| `DexieRewriteRuleRepository` | DTO ↔ DB レコード 変換 |

**補足**: ADR-002 により、Rules Page 側の Interactor は `IRewriteRuleRepository`（実装: `ChromeRuntimeRewriteRuleRepository`）を使用する。Background Script 側の `RewriteRuleService` は `DexieRewriteRuleRepository` を呼び出す。`DexieRewriteRuleRepository` は DTO を直接扱い、Entity への変換は行わない。

## 理由

### 採用理由

1. **技術的制約への対応**: JSON シリアライズの制約を明示的に扱う
2. **明確な境界**: messaging 層でのデータ変換責務を明確化
3. **軽量な通信**: 必要なデータのみ送信することで通信量を削減
4. **エラー防止**: 受信側でメソッド呼び出しエラーを防止

### トレードオフ

- 送信側でエンティティから DTO への変換が必要
- 受信側で DTO からエンティティへの再構築が必要

## 関連ドキュメント

- [ADR-002: DB アクセスを messaging 経由に統一](./002-unified-db-access-via-messaging.md)
- [ADR-004: メッセージングに @webext-core/proxy-service を採用](./004-messaging-with-proxy-service.md)
- [Toggle Rule Active 設計](../design/pages/rule-list/features/toggle-rule-active/)
