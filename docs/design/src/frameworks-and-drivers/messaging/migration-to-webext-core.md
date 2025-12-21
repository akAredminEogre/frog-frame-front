# メッセージング移行設計: @webext-core への統一

## 概要

現在の `chrome.runtime.sendMessage` / `chrome.tabs.sendMessage` を直接使用した実装を、`@webext-core` エコシステムに移行する。

## 現状の問題

### 車輪の再発明

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
│ Flow 2: applyAllRules (Popup → Background → Content Script)     │
├─────────────────────────────────────────────────────────────────┤
│ ChromeRuntimeService.sendApplyRewriteRuleMessage()              │
│   → chrome.runtime.sendMessage({ type: 'applyAllRules', ... })  │
│   → messageRouter → applyAllRulesHandler                        │
│   → ChromeTabsService.sendApplyAllRulesMessage()                │
│   → chrome.tabs.sendMessage → Content Script                    │
└─────────────────────────────────────────────────────────────────┘
```

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
│   → RewriteRuleMessagingService (proxy-service)                 │
│   → Background: DexieRewriteRuleRepository                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Flow 2: applyAllRules (Background → Content Script)             │
├─────────────────────────────────────────────────────────────────┤
│ onUpdated / applyAllRulesHandler                                │
│   → messaging.sendMessage('applyAllRules', {}, tabId)           │
│   → Content Script: messaging.onMessage('applyAllRules', ...)   │
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
│   - proxy-service として定義                                     │
│   - Background で登録、他コンテキストから呼び出し                 │
│                                                                 │
│ ContentScriptMessaging                                          │
│   - messaging プロトコル定義                                     │
│   - Background → Content Script 通信用                          │
└─────────────────────────────────────────────────────────────────┘
```

## 開発順序

### PR-1: proxy-service 基盤 + Flow 1 移行

**目的**: Content Script → Background のデータ取得を proxy-service に移行

**変更対象**:

| ファイル | 変更内容 |
|---------|---------|
| `RewriteRuleMessagingService.ts` | スケルトンから実装へ（proxy-service 登録） |
| `background.ts` | proxy-service 登録呼び出し追加 |
| `RewriteRuleMapper.ts` | IRewriteRuleMessagingPort 経由で通信するメソッド追加 |
| `ChromeRuntimeRewriteRuleRepository.ts` | Mapper 経由に変更 |
| `IRewriteRuleMessagingPort.ts` | getAll メソッド追加 |

**確認項目**:
- Content Script がルールを取得できる
- E2E テストが通る
- 旧ハンドラー（getAllRules）は残す（Flow 2 がまだ旧方式のため）

### PR-2: messaging 基盤 + Flow 2 移行

**目的**: Background → Content Script のコマンド送信を messaging に移行

**変更対象**:

| ファイル | 変更内容 |
|---------|---------|
| `messaging/protocol.ts` | 新規作成: messaging プロトコル定義 |
| `content.ts` | messaging.onMessage 登録 |
| `ChromeTabsService.ts` | sendApplyAllRulesMessage を messaging 使用に変更 |
| `onUpdated.ts` | messaging 経由に変更 |
| `applyAllRulesHandler.ts` | messaging 経由に変更 |

**確認項目**:
- タブ読み込み時にルールが自動適用される
- Popup からのルール適用が動作する
- E2E テストが通る

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
- 全 E2E テストが通る
- 未使用コードがないこと（knip チェック）

## 注意事項

### 送信と受信は同時に移行

```
❌ 受信だけ先に移行 → 送信側が旧方式のまま → 動作しない
❌ 送信だけ先に移行 → 受信側が旧方式のまま → 動作しない
✅ 1つのフローを送受信セットで移行
```

### 旧ハンドラーは最後まで残す

PR-1, PR-2 の間は両方のハンドラーが共存する。PR-3 で一括削除。

## 関連ドキュメント

- [ADR-002: メッセージングに @webext-core を採用](../../../../adr/002-messaging-with-proxy-service.md)
- [ADR-003: DB アクセスを messaging 経由に統一し DTO を使用](../../../../adr/003-unified-db-access-via-messaging.md)
