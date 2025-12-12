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

## DTO 型定義

メッセージングで使用する DTO の型を以下のように定義する。
これにより、シリアライズ/デシリアライズ処理の再利用性が向上する。

### RewriteRuleDTO（エンティティ全体）

エンティティの全プロパティを含む DTO。`getById` の応答などで使用：

```typescript
type RewriteRuleDTO = {
  id: number;
  name: string;
  pattern: string;
  replacement: string;
  isActive: boolean;
  // ... その他のプロパティ
};
```

### 操作別 DTO

操作に必要な最小限のデータのみを含む DTO：

| DTO名 | 用途 | 構造 |
|-------|------|------|
| `GetByIdRequestDTO` | ルール取得要求 | `{ id: number }` |
| `UpdateRuleActiveDTO` | 有効/無効トグル | `{ id: number, isActive: boolean }` |

```typescript
// 取得要求
type GetByIdRequestDTO = {
  id: number;
};

// トグル更新
type UpdateRuleActiveDTO = {
  id: number;
  isActive: boolean;
};
```

### Message 型定義

**Message と DTO を分離する。**

- **Message**: `type`（ルーティング用）と `payload`（データ）を持つ
- **DTO**: 純粋なデータのみを持つ

この分離により：
- `type` によるルーティングロジックと、データ構造を独立して管理できる
- DTO を他の用途（ログ、キャッシュ等）で再利用できる

```typescript
// Message 型（type + payload）
type GetByIdMessage = {
  type: "getById";
  payload: GetByIdRequestDTO;
};

type UpdateRuleActiveMessage = {
  type: "update";
  payload: UpdateRuleActiveDTO;
};

// Response Message
type GetByIdResponseMessage = {
  type: "getById:response";
  payload: RewriteRuleDTO;
};
```

| Message 型 | type | payload |
|------------|------|---------|
| `GetByIdMessage` | `"getById"` | `GetByIdRequestDTO` |
| `UpdateRuleActiveMessage` | `"update"` | `UpdateRuleActiveDTO` |
| `GetByIdResponseMessage` | `"getById:response"` | `RewriteRuleDTO` |

### 変換責務

| コンポーネント | 責務 |
|---------------|------|
| `ChromeRuntimeRewriteRuleRepository` | Entity → DTO 変換（送信時）、DTO → Entity 再構築（受信時） |
| `MessageHandler` | DTO の受け渡しのみ（変換しない） |
| `DexieRewriteRuleRepository` | Entity ↔ DB レコード 変換 |

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
MessagingRepo -> GetByIdMessage : new(GetByIdRequestDTO)
MessagingRepo -> Handler : GetByIdMessage
Handler --> MessagingRepo : GetByIdResponseMessage
```

Message は `type` と `payload` を持ち、MessageHandler でルーティングされる。

## 関連ドキュメント

- [ADR-002: DB アクセスを messaging 経由に統一](./002-unified-db-access-via-messaging.md)
- [Toggle Rule Active 設計](../design/pages/rule-list/features/toggle-rule-active/)
