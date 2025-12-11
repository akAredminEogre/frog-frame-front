# ディレクトリ構造設計

## 詳細構造

### 第1層: enterprise-business-rules/

```
src/enterprise-business-rules/
└── entities/                                    ← Entity
    └── RewriteRule/
        └── RewriteRule.ts                       ← withActive() 追加
```

### 第2層: application-business-rules/

```
src/application-business-rules/
├── ports/
│   ├── input/                                   ← Input Port (Interface)
│   │   └── rule/
│   │       └── IToggleRuleActiveUseCase.ts
│   └── output/                                  ← Output Port (Interface)
│       └── rule/
│           └── IToggleRuleActivePresenter.ts
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
├── presenters/                                  ← Presenter
│   └── rule/
│       └── ToggleRuleActivePresenter.ts
└── gateways/                                    ← Gateway (Interface)
    ├── persistence/                             ← DB関連
    │   └── IRewriteRuleRepository.ts            ← 既存、移行対象
    └── browser/                                 ← ブラウザ操作関連
        └── ITabsGateway.ts                      ← タブリロード用
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
│       └── DexieRewriteRuleRepository.ts        ← 既存（background用）
├── messaging/                                   ← Messaging Gateway 実装
│   └── ChromeRuntimeRewriteRuleRepository.ts    ← 既存（rules page用）
├── browser/                                     ← ブラウザ操作 Gateway 実装
│   └── ChromeTabsGateway.ts                     ← タブリロード実装
└── di/                                          ← DI Container
    └── container.ts                             ← 既存、変更対象
```

## 導線と各層の役割

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
│      │ InputData                                                │
│      ▼                                                          │
│ [第2層] ToggleRuleActiveInteractor                               │
│      │ └── IRewriteRuleRepository (ChromeRuntimeRewriteRule...)  │
│      │                                                          │
└──────┼──────────────────────────────────────────────────────────┘
       │ chrome.runtime.sendMessage
       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Background Script                                                │
│      │                                                          │
│      ▼                                                          │
│ MessageHandler                                                   │
│      ├── DexieRewriteRuleRepository.update()                    │
│      ├── RewriteRule.withActive()                               │
│      └── ChromeTabsGateway.reloadMatchingTabs()                 │
│      │                                                          │
└──────┼──────────────────────────────────────────────────────────┘
       │ response
       ▼
┌─────────────────────────────────────────────────────────────────┐
│ Rules Page (続き)                                                │
│      │                                                          │
│      ▼                                                          │
│ [第3層] ToggleRuleActivePresenter → OutputData                   │
│      │                                                          │
│      ▼                                                          │
│ [第4層] RulesApp.tsx (状態更新)                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 変更対象サマリ

| 種別 | ファイル | 変更内容 |
|------|---------|---------|
| 移行 | RewriteRule.ts | enterprise-business-rules/へ移動 |
| 移行 | IRewriteRuleRepository.ts | interface-adapters/gateways/へ移動 |
| 新規 | Toggle関連(UseCase, Controller, Presenter, DTO) | 新規作成 |
| 新規 | ITabsGateway.ts | タブ操作インターフェース新規作成 |
| 新規 | ChromeTabsGateway.ts | タブリロード実装 |
| 新規 | ToggleSwitch.tsx | UIコンポーネント新規作成 |
| 変更 | RulesApp.tsx | トグルハンドラー追加 |
| 変更 | container.ts | DI登録追加 |
| 既存 | ChromeRuntimeRewriteRuleRepository.ts | messaging経由でbackgroundと通信（変更不要） |
| 既存 | DexieRewriteRuleRepository.ts | IndexedDB直接アクセス・background用（変更不要） |
