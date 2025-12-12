# ディレクトリ構造設計

## 詳細構造

### 第1層: enterprise-business-rules/

```
src/enterprise-business-rules/
└── entities/                                    ← Entity
    └── RewriteRule/
        └── RewriteRule.ts                       ← withActive(), fromDTO() 追加
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
├── persistence/                                 ← DB Gateway 実装
│   └── indexeddb/
│       └── DexieRewriteRuleRepository.ts        ← 既存（Background Script用）
├── messaging/                                   ← Messaging Gateway 実装
│   ├── ChromeRuntimeRewriteRuleRepository.ts    ← 既存（Rules Page用）
│   ├── MessageHandler.ts                        ← Background Script側、メッセージ受信
│   └── dto/                                     ← メッセージング用DTO/Message（ADR-003参照）
│       ├── RewriteRuleDTO.ts                    ← エンティティ全体を表現
│       ├── GetByIdRequestDTO.ts                 ← ルール取得要求 { id }
│       ├── UpdateRuleActiveDTO.ts               ← トグル更新 { id, isActive }
│       ├── GetByIdMessage.ts                    ← { type: "getById", payload }
│       ├── UpdateRuleActiveMessage.ts           ← { type: "update", payload }
│       └── GetByIdResponseMessage.ts            ← { type: "getById:response", payload }
├── browser/                                     ← ブラウザ操作 Gateway 実装
│   └── ChromeTabsGateway.ts                     ← タブリロード実装（Rules Page用）
└── di/                                          ← DI Container
    └── container.ts                             ← 既存、変更対象
```

## 導線と各層の役割

> **参照**: [ADR-002: DB アクセスを messaging 経由に統一](../../../../adr/002-unified-db-access-via-messaging.md)
> **参照**: [ADR-003: メッセージングでは DTO を使用](../../../../adr/003-messaging-uses-dto-not-entity.md)

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
│      │ └── GetByIdMessage を作成して送信                          │
│      │                                                          │
└──────┼──────────────────────────────────────────────────────────┘
       │ chrome.runtime.sendMessage (ADR-003: DTO のみ)
       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Background Script                                                │
│      │                                                          │
│      ▼                                                          │
│ [第4層] MessageHandler                                           │
│      │ └── DexieRewriteRuleRepository.getById()                 │
│      │ └── GetByIdResponseMessage を作成して返却                  │
│      │                                                          │
└──────┼──────────────────────────────────────────────────────────┘
       │ response (RewriteRuleDTO)
       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Rules Page (続き)                                                │
│      │                                                          │
│      ▼                                                          │
│ [第4層] ChromeRuntimeRewriteRuleRepository                       │
│      │ └── RewriteRule.fromDTO() でエンティティ再構築             │
│      │                                                          │
│      ▼                                                          │
│ [第2層] ToggleRuleActiveInteractor                               │
│      │ └── RewriteRule.withActive() で状態反転                   │
│      │ └── IRewriteRuleRepository.update()                      │
│      │     （messaging経由でBackground Scriptに送信）             │
│      │                                                          │
│      │ └── ITabsGateway.reloadMatchingTabs()                    │
│      │     ↓                                                    │
│      │ [第4層] ChromeTabsGateway (chrome.tabs.reload)            │
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
| 移行 | RewriteRule.ts | enterprise-business-rules/へ移動、fromDTO()追加 |
| 移行 | IRewriteRuleRepository.ts | application-business-rules/ports/gateway/へ移動 |
| 新規 | IToggleRuleActiveUseCase.ts | Input Port 新規作成 |
| 新規 | IToggleRuleActivePresenter.ts | Output Port 新規作成 |
| 新規 | ToggleRuleActiveInteractor.ts | UseCase実装 新規作成 |
| 新規 | ToggleRuleActiveInputData.ts | 入力DTO 新規作成 |
| 新規 | ToggleRuleActiveOutputData.ts | 出力DTO 新規作成 |
| 新規 | ToggleRuleActiveController.ts | Controller 新規作成 |
| 新規 | ToggleRuleActivePresenter.ts | Presenter 新規作成 |
| 新規 | ITabsGateway.ts | タブ操作Gateway Interface 新規作成 |
| 新規 | ChromeTabsGateway.ts | タブリロード実装 新規作成 |
| 新規 | messaging/dto/*.ts | メッセージングDTO/Message 新規作成（ADR-003） |
| 新規 | ToggleSwitch.tsx | UIコンポーネント 新規作成 |
| 変更 | RulesApp.tsx | トグルハンドラー追加 |
| 変更 | container.ts | DI登録追加 |
| 既存 | ChromeRuntimeRewriteRuleRepository.ts | messaging経由でbackgroundと通信 |
| 既存 | DexieRewriteRuleRepository.ts | IndexedDB直接アクセス（Background Script用） |
| 既存 | MessageHandler.ts | メッセージ受信・ルーティング |
