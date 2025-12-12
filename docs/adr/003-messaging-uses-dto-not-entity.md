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

```typescript
// 送信側
const rule = new RewriteRule(id, name, pattern, true);
chrome.runtime.sendMessage({ type: "update", rule });

// 受信側
// rule は { id, name, pattern, isActive } の plain object
// rule.withActive() → TypeError: not a function
```

## 決定

**メッセージングではプリミティブまたは DTO（Plain Object）を使用し、ドメインエンティティを直接送信しない。**

受信側で必要に応じてエンティティを再構築する。

## 適用パターン

### パターン1: プリミティブのみ送信（推奨）

必要最小限のデータのみ送信：

```
送信: { type: "update", id: 123, isActive: true }
受信: Background が id で既存データを取得し、isActive を更新
```

### パターン2: DTO として送信

エンティティのプロパティを plain object として送信：

```
送信: { type: "update", ruleData: { id, name, pattern, isActive } }
受信: Background が ruleData からエンティティを再構築
```

## 理由

### 採用理由

1. **技術的制約への対応**: JSON シリアライズの制約を明示的に扱う
2. **明確な境界**: messaging 層でのデータ変換責務を明確化
3. **軽量な通信**: 必要なデータのみ送信することで通信量を削減
4. **エラー防止**: 受信側でメソッド呼び出しエラーを防止

### トレードオフ

- 送信側でエンティティから DTO への変換が必要
- 受信側で DTO からエンティティへの再構築が必要

## 影響

### Repository 実装

`ChromeRuntimeRewriteRuleRepository` は以下の責務を持つ：

1. エンティティをシリアライズ可能な形式に変換
2. messaging で送信
3. 受信したデータをエンティティに再構築

### シーケンス図での表現

```
MessagingRepo -> Handler : message(type=update, id, isActive)
```

※ `rule` オブジェクトではなく、プリミティブまたは DTO を送信

## 関連ドキュメント

- [ADR-002: DB アクセスを messaging 経由に統一](./002-unified-db-access-via-messaging.md)
- [Toggle Rule Active 設計](../design/pages/rule-list/features/toggle-rule-active/)
