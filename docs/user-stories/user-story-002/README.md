# User Story 002: メッセージングを @webext-core に移行

## ストーリー

> 既存のメッセージング実装を @webext-core エコシステムに統一し、型安全性と保守性を向上させる

## 概要

現在の `chrome.runtime.sendMessage` / `chrome.tabs.sendMessage` を直接使用した実装を、`@webext-core/proxy-service` と `@webext-core/messaging` に移行する。

## 設計ドキュメント

- [ADR-002: メッセージングに @webext-core を採用](../../adr/002-messaging-with-webext-core.md)
- [ADR-003: DB アクセスを messaging 経由に統一し DTO を使用](../../adr/003-unified-db-access-via-messaging.md)

## 現状分析

### 問題点: 車輪の再発明

現在の実装は以下の問題を抱えている：

1. **手動のメッセージルーティング**: `messageRouter` + `handlers` オブジェクトで手動ルーティング
2. **型安全性の欠如**: メッセージ型が `any` で定義
3. **ボイラープレート**: メッセージタイプごとにハンドラーファイルを作成

### 現在のメッセージフロー

```
┌─────────────────────────────────────────────────────────────────┐
│ Flow 1: getAllRules (Content Script → Background)               │
├─────────────────────────────────────────────────────────────────┤
│ ChromeRuntimeRewriteRuleRepository.getAll()                     │
│   → chrome.runtime.sendMessage({ type: 'getAllRules' })         │
│   → messageRouter → getAllRewriteRulesHandler                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Flow 2: applyAllRules (Background → Content Script)             │
├─────────────────────────────────────────────────────────────────┤
│ onUpdated / applyAllRulesHandler                                │
│   → ChromeTabsService.sendApplyAllRulesMessage()                │
│   → chrome.tabs.sendMessage → Content Script                    │
└─────────────────────────────────────────────────────────────────┘
```

### 対象ファイル

| 方向 | ファイル | 用途 |
|------|---------|------|
| Content → BG | `ChromeRuntimeRewriteRuleRepository.ts` | ルール取得 |
| Popup → BG | `ChromeRuntimeService.ts` | ルール適用コマンド |
| BG → Content | `applyAllRulesHandler.ts` | Popupからの適用リクエスト転送 |
| BG → Content | `onUpdated.ts` | タブ読み込み時の自動適用 |

## 移行後の設計

### 技術選定（ADR-002 準拠）

| 通信方向 | ライブラリ | 理由 |
|---------|-----------|------|
| → Background | `@webext-core/proxy-service` | Repository パターンと親和性が高い |
| Background → Content Script | `@webext-core/messaging` | 特定タブへの送信をサポート |

### 移行後のメッセージフロー

```
┌─────────────────────────────────────────────────────────────────┐
│ Flow 1: getAllRules (Content Script → Background)               │
├─────────────────────────────────────────────────────────────────┤
│ ChromeRuntimeRewriteRuleRepository.getAll()                     │
│   → RewriteRuleMapper.getAllRules()                             │
│   → IRewriteRuleMessagingPort.getAll()                          │
│   → RewriteRuleProxyService (proxy-service)                     │
│   → Background: DexieRewriteRuleRepository                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Flow 2: applyAllRules (Background → Content Script)             │
├─────────────────────────────────────────────────────────────────┤
│ onUpdated / applyAllRulesHandler                                │
│   → BackgroundScriptMessageSender.sendApplyAllRules(tabId)      │
│   → Content Script: ContentScriptMessageReceiver.onApplyAllRules()│
└─────────────────────────────────────────────────────────────────┘
```

### Clean Architecture 層構成

```
┌─────────────────────────────────────────────────────────────────┐
│ interface-adapters                                              │
├─────────────────────────────────────────────────────────────────┤
│ IRewriteRuleMessagingPort (interface)                           │
│   - getAll(): Promise<RewriteRuleDTO[]>                         │
│   - getById(dto): Promise<RewriteRuleDTO>                       │
│   - updateActive(dto): Promise<void>                            │
│                                                                 │
│ RewriteRuleMapper                                               │
│   - toEntity(dto): RewriteRule                                  │
│   - toDto(entity): RewriteRuleDTO                               │
│   - getAllRules(): Promise<RewriteRule[]>  ← Port経由で通信     │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ implements
┌─────────────────────────────────────────────────────────────────┐
│ frameworks-and-drivers                                          │
├─────────────────────────────────────────────────────────────────┤
│ RewriteRuleProxyService implements IRewriteRuleMessagingPort    │
│   - proxy-service として定義                                     │
│   - Background で登録、他コンテキストから呼び出し                 │
│                                                                 │
│ BackgroundScriptMessageSender                                   │
│   - Background → Content Script への messaging 送信              │
│                                                                 │
│ ContentScriptMessageReceiver                                    │
│   - Content Script 側の messaging 受信                          │
└─────────────────────────────────────────────────────────────────┘
```

### ディレクトリ構成

```
src/
├── interface-adapters/
│   ├── ports/
│   │   └── IRewriteRuleMessagingPort.ts      # ProxyService の抽象化
│   └── mappers/
│       └── RewriteRuleMapper.ts              # Entity ↔ DTO 変換
│
├── frameworks-and-drivers/
│   ├── messaging/
│   │   ├── RewriteRuleProxyService.ts        # proxy-service 実装
│   │   ├── MessagingProtocol.ts              # messaging プロトコル定義（新規）
│   │   ├── BackgroundScriptMessageSender.ts  # Background 側の messaging 送信（新規）
│   │   ├── ContentScriptMessageReceiver.ts   # Content Script 側の messaging 受信（新規）
│   │   └── dto/
│   │       ├── RewriteRuleDTO.ts
│   │       └── request-dto/
│   │           ├── GetByIdRequestDTO.ts
│   │           └── UpdateRuleActiveRequestDTO.ts
│   ├── persistence/
│   │   └── ChromeRuntimeRewriteRuleRepository.ts  # Mapper 経由に変更
│   └── entrypoints/
│       ├── background.ts                     # proxy-service 登録
│       └── content.ts                        # ContentScriptMessageReceiver 登録
│
└── infrastructure/
    └── browser/
        ├── tabs/
        │   └── ChromeTabsService.ts          # messaging 使用に変更
        └── background/
            └── tabs/
                └── onUpdated.ts              # messaging 経由に変更
```

### 実装例

#### RewriteRuleProxyService.ts（proxy-service）

```typescript
import { defineProxyService } from '@webext-core/proxy-service';
import type { IRewriteRuleMessagingPort } from 'src/interface-adapters/ports/IRewriteRuleMessagingPort';
import type { RewriteRuleDTO } from './dto/RewriteRuleDTO';
import type { GetByIdRequestDTO } from './dto/request-dto/GetByIdRequestDTO';
import type { UpdateRuleActiveRequestDTO } from './dto/request-dto/UpdateRuleActiveRequestDTO';
import { DexieRewriteRuleRepository } from 'src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository';

// ProxyService は DTO をそのまま受け渡す（ADR-002, ADR-003参照）
// Entity ↔ DTO 変換は RewriteRuleMapper の責務
class RewriteRuleProxyServiceImpl implements IRewriteRuleMessagingPort {
  private readonly repository = new DexieRewriteRuleRepository();

  async getAll(): Promise<RewriteRuleDTO[]> {
    return this.repository.getAll();
  }

  async getById(request: GetByIdRequestDTO): Promise<RewriteRuleDTO> {
    return this.repository.getById(request.id);
  }

  async updateActive(request: UpdateRuleActiveRequestDTO): Promise<void> {
    await this.repository.updateActive(request.id, request.isActive);
  }
}

export const [registerRewriteRuleProxyService, getRewriteRuleProxyService] =
  defineProxyService('RewriteRuleProxyService', () => new RewriteRuleProxyServiceImpl());
```

#### MessagingProtocol.ts（プロトコル定義）

```typescript
import { defineExtensionMessaging } from '@webext-core/messaging';

// Background → Content Script 通信のプロトコル定義
export interface MessagingProtocol {
  applyAllRules: () => void;
}

export const messaging = defineExtensionMessaging<MessagingProtocol>();
```

#### BackgroundScriptMessageSender.ts（messaging 送信側）

```typescript
import { messaging } from './MessagingProtocol';

export const BackgroundScriptMessageSender = {
  async sendApplyAllRules(tabId: number): Promise<void> {
    await messaging.sendMessage('applyAllRules', undefined, tabId);
  },
};
```

#### ContentScriptMessageReceiver.ts（messaging 受信側）

```typescript
import { messaging } from './MessagingProtocol';

export const ContentScriptMessageReceiver = {
  onApplyAllRules(handler: () => void): void {
    messaging.onMessage('applyAllRules', handler);
  },
};
```

## 開発戦略

### 方針: フロー単位で段階移行

送信と受信は同時に移行する必要があるため、フロー単位で移行する。

```
❌ 受信だけ先に移行 → 送信側が旧方式のまま → 動作しない
❌ 送信だけ先に移行 → 受信側が旧方式のまま → 動作しない
✅ 1つのフローを送受信セットで移行
```

旧ハンドラーは最後まで残し、PR-3で一括削除する。

### PR-1: proxy-service 基盤 + Flow 1 移行

**目的**: Content Script → Background のデータ取得を proxy-service に移行

**変更対象**:

| ファイル | 変更内容 |
|---------|---------|
| `RewriteRuleProxyService.ts` | スケルトンから実装へ（proxy-service 登録） |
| `background.ts` | proxy-service 登録呼び出し追加 |
| `RewriteRuleMapper.ts` | IRewriteRuleMessagingPort 経由で通信するメソッド追加 |
| `ChromeRuntimeRewriteRuleRepository.ts` | Mapper 経由に変更 |
| `IRewriteRuleMessagingPort.ts` | getAll メソッド追加 |

**確認項目**:
- [ ] Content Script がルールを取得できる
- [ ] E2E テストが通る
- [ ] 旧ハンドラー（getAllRules）は残す（Flow 2 がまだ旧方式のため）

### PR-2: messaging 基盤 + Flow 2 移行

**目的**: Background → Content Script のコマンド送信を messaging に移行

**変更対象**:

| ファイル | 変更内容 |
|---------|---------|
| `messaging/MessagingProtocol.ts` | 新規作成: messaging プロトコル定義 |
| `messaging/BackgroundScriptMessageSender.ts` | 新規作成: Background → Content Script への messaging 送信 |
| `messaging/ContentScriptMessageReceiver.ts` | 新規作成: Content Script 側の messaging 受信 |
| `content.ts` | ContentScriptMessageReceiver の onMessage 登録 |
| `ChromeTabsService.ts` | BackgroundScriptMessageSender 経由に変更 |
| `onUpdated.ts` | BackgroundScriptMessageSender 経由に変更 |
| `applyAllRulesHandler.ts` | BackgroundScriptMessageSender 経由に変更 |

**確認項目**:
- [ ] タブ読み込み時にルールが自動適用される
- [ ] Popup からのルール適用が動作する
- [ ] E2E テストが通る

### PR-3: レガシーコード削除

**目的**: 旧メッセージングハンドラーを削除

**削除対象**:

| ファイル | 削除内容 |
|---------|---------|
| `messageRouter.ts` | 全体削除（不要になる場合） |
| `messageHandlers.ts` | getAllRules, applyAllRules 削除 |
| `getAllRewriteRulesHandler.ts` | 全体削除 |
| `applyAllRulesHandler.ts` | 全体削除（または messaging に置換済み） |
| `onMessageReceived.ts` | 全体削除（Background, Content 両方） |

**確認項目**:
- [ ] 全 E2E テストが通る
- [ ] 未使用コードがないこと（knip チェック）

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照

## 関連ドキュメント

- [ADR-001: Clean Architecture with Presenter Pattern](../../adr/001-clean-architecture-with-presenter-pattern.md)
- [ADR-002: メッセージングに @webext-core を採用](../../adr/002-messaging-with-webext-core.md)
- [ADR-003: DB アクセスを messaging 経由に統一し DTO を使用](../../adr/003-unified-db-access-via-messaging.md)
- [User Story 001: ルールトグル機能](../user-story-001/README.md) - 関連する RewriteRuleProxyService のスケルトン実装
