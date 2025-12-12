# ディレクトリ構造設計

## 詳細構造

### 第1層: enterprise-business-rules/

```
src/enterprise-business-rules/
└── entities/                                    ← Entity
    └── RewriteRule/
        └── RewriteRule.ts                       ← withActive(), matchesUrl(), fromDTO() 追加
```

### 第2層: application-business-rules/

```
src/application-business-rules/
├── ports/
│   ├── input/                                   ← Input Port (Interface)
│   │   └── rule/
│   │       └── IToggleRuleActiveUseCase.ts
│   ├── output/                                  ← Output Port (Interface)
│   │   └── rule/
│   │       └── IToggleRuleActivePresenter.ts
│   └── gateway/                                 ← Gateway Interface（Interactorが依存）
│       ├── IRewriteRuleRepository.ts            ← ルール永続化
│       └── ITabsGateway.ts                      ← タブ操作
├── interactors/                                 ← Use Case Interactor
│   └── rule/
│       └── ToggleRuleActiveInteractor.ts
└── dto/                                         ← Data Transfer Objects
    ├── input/
    │   └── rule/
    │       └── ToggleRuleActiveInputData.ts
    └── output/
        └── rule/
            └── ToggleRuleActiveOutputData.ts
```

### 第3層: interface-adapters/

```
src/interface-adapters/
├── controllers/                                 ← Controller
│   └── rule/
│       └── ToggleRuleActiveController.ts
└── presenters/                                  ← Presenter
    └── rule/
        └── ToggleRuleActivePresenter.ts
```

### 第4層: frameworks-and-drivers/

```
src/frameworks-and-drivers/
├── ui/                                          ← View (React)
│   ├── components/
│   │   └── atoms/
│   │       ├── ToggleSwitch.tsx                 ← 新規
│   │       └── ToggleSwitch.module.css          ← 新規
│   └── pages/
│       └── rules/
│           └── RulesApp.tsx                     ← 既存、変更対象
├── persistence/                                 ← DB データアクセス
│   └── indexeddb/
│       └── DexieRewriteRuleRepository.ts        ← DTO ↔ DBレコード変換（Background Script用）
├── messaging/                                   ← Messaging Gateway 実装
│   ├── ChromeRuntimeRewriteRuleRepository.ts    ← 既存（Rules Page用）
│   └── dto/                                     ← メッセージング用DTO（ADR-002、ADR-003参照）
│       ├── RewriteRuleDTO.ts                    ← エンティティ全体を表現
│       ├── GetByIdRequestDTO.ts                 ← ルール取得要求 { id }
│       └── UpdateRuleActiveRequestDTO.ts               ← トグル更新 { id, isActive }
├── proxy-service/                               ← proxy-service定義（ADR-002参照）
│   └── RewriteRuleMessagingService.ts           ← Background Scriptで実行されるサービス
├── browser/                                     ← ブラウザ操作 Gateway 実装
│   └── ChromeTabsGateway.ts                     ← rule.matchesUrl()判定後リロード（ADR-001参照）
└── di/                                          ← DI Container
    └── container.ts                             ← 既存、変更対象
```

## 導線と各層の役割

> **参照**: [ADR-001: Clean Architecture - ドメインロジックの配置原則](../../../../adr/001-clean-architecture-with-presenter-pattern.md)
> **参照**: [ADR-002: メッセージングに @webext-core/proxy-service を採用](../../../../adr/002-messaging-with-proxy-service.md)
> **参照**: [ADR-003: DB アクセスを messaging 経由に統一し DTO を使用](../../../../adr/003-unified-db-access-via-messaging.md)

```
┌─────────────────────────────────────────────────────────────────┐
│ Rules Page                                                       │
│                                                                  │
│ [ユーザー] トグルクリック                                          │
│      │                                                          │
│      ▼                                                          │
│ [第4層] ToggleSwitch.tsx → RulesApp.tsx                          │
│      │                                                          │
│      ▼                                                          │
│ [第3層] ToggleRuleActiveController                               │
│      │ ToggleRuleActiveInputData                                │
│      ▼                                                          │
│ [第2層] ToggleRuleActiveInteractor                               │
│      │ └── IRewriteRuleRepository.getById()                     │
│      │                                                          │
│      ▼                                                          │
│ [第4層] ChromeRuntimeRewriteRuleRepository                       │
│      │ └── GetByIdRequestDTO作成、RewriteRuleMessagingService.getById()呼出 │
│      │                                                          │
│      ├─────── proxy-service (透過的メッセージング) ──────────────│
│      │                                                          │
│      │        ┌───────────────────────────────────────┐         │
│      │        │ Background Script                     │         │
│      │        │ [第4層] RewriteRuleMessagingService   │         │
│      │        │      │                                │         │
│      │        │      ▼                                │         │
│      │        │ DexieRewriteRuleRepository            │         │
│      │        │      │                                │         │
│      │        │      ▼                                │         │
│      │        │ RewriteRuleDTO                        │         │
│      │        └───────────────────────────────────────┘         │
│      │                                                          │
│      ◀─────── RewriteRuleDTO ────────────────────────────────────│
│      │                                                          │
│      │ └── RewriteRule.fromDTO() でエンティティ再構築             │
│      │                                                          │
│      ▼                                                          │
│ [第2層] ToggleRuleActiveInteractor                               │
│      │ └── RewriteRule.withActive() で状態反転                   │
│      │ └── IRewriteRuleRepository.update()                      │
│      │     （proxy-service経由でBackground Scriptに送信）         │
│      │                                                          │
│      │ └── ITabsGateway.reloadMatchingTabs()                    │
│      │     ↓                                                    │
│      │ [第4層] ChromeTabsGateway                                 │
│      │     └── rule.matchesUrl()判定 → chrome.tabs.reload()     │
│      │         （ADR-001: ドメインロジックは第1層で実行）          │
│      │                                                          │
│      │ └── IToggleRuleActivePresenter.present()                 │
│      ▼                                                          │
│ [第3層] ToggleRuleActivePresenter → ToggleRuleActiveOutputData   │
│      │                                                          │
│      ▼                                                          │
│ [第4層] RulesApp.tsx (状態更新)                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 変更対象サマリ

| 種別 | ファイル | 変更内容 |
|------|---------|---------|
| 移行 | RewriteRule.ts | enterprise-business-rules/へ移動、matchesUrl(), fromDTO()追加（ADR-001参照） |
| 移行 | IRewriteRuleRepository.ts | application-business-rules/ports/gateway/へ移動 |
| 新規 | IToggleRuleActiveUseCase.ts | Input Port 新規作成 |
| 新規 | IToggleRuleActivePresenter.ts | Output Port 新規作成 |
| 新規 | ToggleRuleActiveInteractor.ts | UseCase実装 新規作成 |
| 新規 | ToggleRuleActiveInputData.ts | 入力DTO 新規作成 |
| 新規 | ToggleRuleActiveOutputData.ts | 出力DTO 新規作成 |
| 新規 | ToggleRuleActiveController.ts | Controller 新規作成 |
| 新規 | ToggleRuleActivePresenter.ts | Presenter 新規作成 |
| 新規 | ITabsGateway.ts | タブ操作Gateway Interface 新規作成 |
| 新規 | ChromeTabsGateway.ts | タブリロード実装 新規作成（rule.matchesUrl()判定後リロード、ADR-001参照） |
| 新規 | messaging/dto/*.ts | メッセージングDTO 新規作成（ADR-002、ADR-003） |
| 新規 | RewriteRuleMessagingService.ts | proxy-service定義 新規作成（ADR-002） |
| 新規 | ToggleSwitch.tsx | UIコンポーネント 新規作成 |
| 変更 | RulesApp.tsx | トグルハンドラー追加 |
| 変更 | container.ts | DI登録追加 |
| 既存 | ChromeRuntimeRewriteRuleRepository.ts | proxy-service経由でbackgroundと通信（ADR-002参照） |
| 既存 | DexieRewriteRuleRepository.ts | DTO ↔ DBレコード変換（Background Script用、ADR-003参照） |
