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
│ onUpdated / onBackgroundMessage('applyAllRules')                │
│   → ChromeTabsService.sendApplyAllRulesMessage(tab)             │
│   → sendToContentScript('applyAllRules', tabId)                 │
│   → Content Script: onContentScriptMessage('applyAllRules')     │
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
│ RewriteRuleMessagingService implements IRewriteRuleMessagingPort│
│   - proxy-service 経由で DTO を送受信                            │
│                                                                 │
│ RewriteRuleProxyService                                         │
│   - proxy-service として定義（実装注入パターン、ADR-002参照）     │
│   - Background で登録、他コンテキストから呼び出し                 │
│                                                                 │
│ messaging.ts                                                    │
│   - sendToContentScript: Background → Content Script 送信       │
│   - onContentScriptMessage: Content Script 側の受信              │
└─────────────────────────────────────────────────────────────────┘
```

### ディレクトリ構成

```
src/
├── interface-adapters/
│   ├── ports/
│   │   └── IRewriteRuleMessagingPort.ts      # MessagingService の抽象化
│   └── mappers/
│       └── RewriteRuleMapper.ts              # Entity ↔ DTO 変換 + Port経由で通信
│
├── frameworks-and-drivers/
│   ├── messaging/
│   │   ├── RewriteRuleProxyService.ts        # proxy-service 定義（実装注入パターン）
│   │   ├── RewriteRuleProxyServiceImpl.ts    # proxy-service 実装（container依存を分離）
│   │   ├── RewriteRuleMessagingService.ts    # IRewriteRuleMessagingPort 実装
│   │   ├── messaging.ts                      # messaging プロトコル定義・送受信
│   │   └── dto/
│   │       ├── RewriteRuleDTO.ts
│   │       └── request-dto/
│   │           ├── GetByIdRequestDTO.ts
│   │           └── UpdateRuleActiveRequestDTO.ts
│   ├── persistence/
│   │   └── ChromeRuntimeRewriteRuleRepository.ts  # Mapper 経由に変更
│   └── di/
│       ├── container.ts                      # Background 用 DI コンテナ
│       └── contentContainer.ts               # Content Script 用 DI コンテナ
│
├── entrypoints/
│   ├── background.ts                         # proxy-service 登録（実装注入）
│   └── content.ts                            # messaging 受信登録
│
└── infrastructure/
    └── browser/
        ├── tabs/
        │   └── ChromeTabsService.ts          # messaging 使用
        └── background/
            └── runtime/
                └── onMessageReceived.ts      # messaging ハンドラー登録
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

### PR-1: proxy-service 基盤 + Flow 1 移行 ✅ 完了

**目的**: Content Script → Background のデータ取得を proxy-service に移行

**変更対象**:

| ファイル | 変更内容 |
|---------|---------|
| `RewriteRuleProxyService.ts` | 実装注入パターンで proxy-service 定義 |
| `RewriteRuleMessagingService.ts` | IRewriteRuleMessagingPort 実装（proxy-service 経由） |
| `background.ts` | 実装注入 + proxy-service 登録 |
| `RewriteRuleMapper.ts` | IRewriteRuleMessagingPort 経由で通信する getAllRules() 追加 |
| `ChromeRuntimeRewriteRuleRepository.ts` | Mapper 経由に変更 |
| `IRewriteRuleMessagingPort.ts` | getAll メソッド追加 |
| `contentContainer.ts` | MessagingService → Mapper → Repository の依存関係チェーン設定 |

**確認項目**:
- [x] Content Script がルールを取得できる
- [x] E2E テストが通る
- [x] 旧ハンドラー（getAllRules）は削除済み（proxy-service に完全移行）

### PR-2: messaging 基盤 + Flow 2 移行 ✅ 完了

**目的**: Background → Content Script のコマンド送信を messaging に移行

**変更対象**:

| ファイル | 変更内容 |
|---------|---------|
| `messaging/messaging.ts` | messaging プロトコル定義・送受信関数 |
| `content.ts` | onContentScriptMessage 登録 |
| `ChromeTabsService.ts` | sendToContentScript 経由に変更 |
| `onMessageReceived.ts` | onBackgroundMessage でハンドラー登録 |

**確認項目**:
- [x] タブ読み込み時にルールが自動適用される
- [x] Popup からのルール適用が動作する
- [x] E2E テストが通る

### PR-3: レガシーコード削除 ✅ 完了

**目的**: 旧メッセージングコードを削除し、すべての通信を @webext-core 経由に移行

**削除状況**:

| ファイル | 状態 |
|---------|------|
| `messageRouter.ts` | ✅ 削除済み |
| `getAllRewriteRulesHandler.ts` | ✅ 削除済み（proxy-service に移行） |
| `chrome.runtime.sendMessage` 直接使用 | ✅ 削除済み |
| `chrome.tabs.sendMessage` 直接使用 | ✅ 削除済み（`ChromeTabsService.sendMessage` を `sendGetElementSelectionMessage` に置換） |

**現在のハンドラー構成**（@webext-core/messaging 経由で動作）:

| ファイル | 用途 |
|---------|------|
| `handlers/background/applyAllRulesHandler.ts` | Popup → Background → Content Script 転送 |
| `handlers/content/applyAllRulesHandler.ts` | ルール適用処理 |
| `handlers/content/getElementSelectionHandler.ts` | 要素選択取得 |
| `onMessageReceived.ts` | @webext-core/messaging ハンドラー登録 |

**確認項目**:
- [x] 全 E2E テストが通る
- [x] `chrome.runtime.sendMessage` / `chrome.tabs.sendMessage` の直接使用がない

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照

## 関連ドキュメント

- [ADR-001: Clean Architecture with Presenter Pattern](../../adr/001-clean-architecture-with-presenter-pattern.md)
- [ADR-002: メッセージングに @webext-core を採用](../../adr/002-messaging-with-webext-core.md)
- [ADR-003: DB アクセスを messaging 経由に統一し DTO を使用](../../adr/003-unified-db-access-via-messaging.md)
- [User Story 001: ルールトグル機能](../user-story-001/README.md) - 関連する RewriteRuleProxyService のスケルトン実装
