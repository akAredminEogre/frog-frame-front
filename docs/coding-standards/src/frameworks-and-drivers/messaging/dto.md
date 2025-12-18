# メッセージング DTO コーディング規約

## 概要

`@webext-core/proxy-service` を使用したメッセージング用DTOの規約。

> **参照**: [ADR-002: メッセージングに @webext-core/proxy-service を採用](../../../../adr/002-messaging-with-proxy-service.md)

## action/type フィールドは不要

### 理由

`@webext-core/proxy-service` ではメソッド名がアクションの識別子となるため、DTOに `action` や `type` フィールドは不要。

### 従来パターン（chrome.runtime.sendMessage）

```typescript
// ❌ type/action で振り分けが必要だった
chrome.runtime.sendMessage({ type: 'getById', id: 123 });
chrome.runtime.sendMessage({ type: 'updateActive', id: 123, isActive: true });
```

### proxy-service パターン（採用）

```typescript
// ✅ メソッド名で振り分けられる
messagingService.getById(123);
messagingService.updateActive(123, true);
```

## DTO の設計

### 原則

- DTOは**データのみ**を保持する
- アクション識別子（`action`, `type`）は含めない
- 操作に必要な最小限のフィールドのみ定義する

### 例

```typescript
// ✅ Good: データのみ
export interface GetByIdRequestDTO {
  id: number;
}

export interface UpdateRuleActiveRequestDTO {
  id: number;
  active: boolean;
}

// ❌ Bad: action フィールドは不要
export interface GetByIdRequestDTO {
  action: 'getById';  // 不要
  id: number;
}
```

## 命名規約

| 種別 | 命名パターン | 例 |
|------|-------------|-----|
| リクエストDTO | `{操作名}RequestDTO` | `GetByIdRequestDTO`, `UpdateRuleActiveRequestDTO` |
| エンティティDTO | `{Entity}DTO` | `RewriteRuleDTO` |

> **参照**: [メッセージング層 コーディング規約](../messaging.md)
