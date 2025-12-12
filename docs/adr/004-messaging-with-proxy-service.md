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

```typescript
// 課題: MessageHandler が肥大化する
class MessageHandler {
  handle(message: Message) {
    switch (message.type) {  // switch 文が必要
      case "getById":
        // ...
      case "update":
        // ...
      case "delete":
        // ...
      // case が増え続ける
    }
  }
}
```

## 決定

**メッセージングに `@webext-core/proxy-service` を採用する。**

このライブラリは WXT が公式に推奨するメッセージングソリューションであり、Background Script で実行するサービスを他のコンテキストから透過的に呼び出せる。

## 適用パターン

### サービス定義

```typescript
// services/RewriteRuleService.ts
import { defineProxyService } from '@webext-core/proxy-service';

class RewriteRuleService {
  private repository = new DexieRewriteRuleRepository();

  async getById(id: number): Promise<RewriteRuleDTO> {
    return this.repository.getById(id);
  }

  async updateActive(dto: UpdateRuleActiveDTO): Promise<void> {
    return this.repository.updateActive(dto);
  }
}

export const [registerRewriteRuleService, getRewriteRuleService] =
  defineProxyService('RewriteRuleService', () => new RewriteRuleService());
```

### Background Script での登録

```typescript
// background.ts
import { registerRewriteRuleService } from './services/RewriteRuleService';

// 同期的に登録（必須）
registerRewriteRuleService();
```

### Rules Page からの呼び出し

```typescript
// ChromeRuntimeRewriteRuleRepository.ts
import { getRewriteRuleService } from './services/RewriteRuleService';

class ChromeRuntimeRewriteRuleRepository implements IRewriteRuleRepository {
  async getById(id: number): Promise<RewriteRule> {
    const service = getRewriteRuleService();
    const dto = await service.getById(id);  // Background で実行される
    return RewriteRule.fromDTO(dto);
  }

  async update(rule: RewriteRule): Promise<void> {
    const service = getRewriteRuleService();
    await service.updateActive({
      id: rule.id,
      isActive: rule.isActive,
    });
  }
}
```

## 設計への影響

### 変更点

| 要素 | 変更前 | 変更後 |
|------|--------|--------|
| MessageHandler | switch 文でルーティング | 不要（ライブラリが処理） |
| Message 型 | type + payload の定義が必要 | 不要（メソッド呼び出し形式） |
| 型安全性 | 手動で確保 | 自動（TypeScript 推論） |

### ADR-003 との関係

ADR-003 で定義した DTO 型（RewriteRuleDTO, UpdateRuleActiveDTO 等）は引き続き使用する。proxy-service はメソッド引数・戻り値として DTO を使用する。

```typescript
// DTO は引き続き使用
async getById(id: number): Promise<RewriteRuleDTO>
async updateActive(dto: UpdateRuleActiveDTO): Promise<void>
```

### 不要になる要素

以下の要素は proxy-service 採用により不要になる：

- `MessageHandler` クラス
- `GetByIdMessage`, `UpdateRuleActiveMessage`, `GetByIdResponseMessage` 型
- `GetByIdRequestDTO`（メソッド引数として `id: number` を直接渡す）

### 引き続き必要な要素

- `RewriteRuleDTO`: エンティティ全体を表現する DTO
- `UpdateRuleActiveDTO`: 更新時の最小データ
- `DexieRewriteRuleRepository`: DB アクセス層（サービス内部で使用）

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
