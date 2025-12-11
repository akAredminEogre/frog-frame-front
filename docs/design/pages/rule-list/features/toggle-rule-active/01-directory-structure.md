# ディレクトリ構造設計

## 詳細構造

### 第1層: enterprise-business-rules/

```
src/enterprise-business-rules/
├── entities/                                    ← Entity
│   └── RewriteRule/
│       ├── RewriteRule.ts                       ← withActive() 追加
│       └── PatternProcessingStrategyFactory.ts
└── value-objects/                               ← Value Object
    └── RewriteRules.ts
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
    │   └── IRewriteRuleRepository.ts
    └── messaging/                               ← messaging関連
        ├── ITabReloadGateway.ts
        └── IDomOperationGateway.ts
```

### 第4層: frameworks-and-drivers/

```
src/frameworks-and-drivers/
├── ui/                                          ← View (React)
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── ToggleSwitch.tsx
│   │   │   └── ToggleSwitch.module.css
│   │   ├── molecules/
│   │   └── organisms/
│   └── pages/
│       └── rules/
│           └── RulesApp.tsx
├── persistence/                                 ← DB Gateway 実装
│   └── indexeddb/
│       ├── DexieDatabase.ts
│       └── DexieRewriteRuleRepository.ts
├── messaging/                                   ← messaging Gateway 実装
│   ├── ChromeTabReloadGateway.ts
│   └── ChromeDomOperationGateway.ts
├── browser/                                     ← Chrome API ラッパー
│   └── ChromeTabsService.ts
├── di/                                          ← DI Container
│   └── container.ts
└── entrypoints/                                 ← WXT Entry Points (CA外への橋)
    ├── background.ts
    ├── content.ts
    ├── popup/
    ├── rules/
    │   ├── index.html
    │   ├── main.tsx
    │   └── style.css
    └── edit/
```

## 依存関係図

```
        内側（安定）                                        外側（不安定）
        ─────────────────────────────────────────────────────────────────→

┌────────────────────┐   ┌────────────────────┐   ┌──────────────────┐   ┌─────────────────────┐
│ enterprise-business│ ← │application-business│ ← │interface-adapters│ ← │frameworks-and-drivers│
│       -rules       │   │       -rules       │   │                  │   │                     │
│                    │   │                    │   │                  │   │                     │
│ entities/          │   │ Interactor         │   │ Controller       │   │ UI (React)          │
│ value-objects/     │   │ InputPort          │   │ Presenter        │   │ Persistence         │
│ constants/         │   │ OutputPort         │   │ Gateway(IF)      │   │ Messaging           │
│                    │   │ DTO                │   │                  │   │ Browser API         │
│                    │   │                    │   │                  │   │ DI Container        │
└────────────────────┘   └────────────────────┘   └──────────────────┘   └─────────────────────┘

矢印の方向 = 依存の方向（外→内のみ許可）
```

## Clean Architecture 12要素との対応

| # | 要素 | ディレクトリ | 備考 |
|---|------|-------------|------|
| 1 | View | `frameworks-and-drivers/ui/` | React コンポーネント |
| 2 | View Model | （省略: Presenterが直接更新） | |
| 3 | Controller | `interface-adapters/controllers/` | |
| 4 | Presenter | `interface-adapters/presenters/` | |
| 5 | Input Boundary | `application-business-rules/ports/input/` | |
| 6 | Output Boundary | `application-business-rules/ports/output/` | |
| 7 | Use Case Interactor | `application-business-rules/interactors/` | |
| 8 | Data Access Interface | `interface-adapters/gateways/persistence/` | DB関連 |
| 8 | Data Access Interface | `interface-adapters/gateways/messaging/` | messaging関連 |
| 9 | Data Access | `frameworks-and-drivers/persistence/` | DB Gateway 実装 |
| 9 | Data Access | `frameworks-and-drivers/messaging/` | messaging Gateway 実装 |
| 10 | Database | IndexedDB (Dexie) | |
| 11 | Entities | `enterprise-business-rules/entities/` | |
| 12 | External Interfaces | `frameworks-and-drivers/browser/` | Chrome API ラッパー |
| 12 | External Interfaces | `frameworks-and-drivers/entrypoints/background.ts` | メッセージング |
| 12 | External Interfaces | `frameworks-and-drivers/entrypoints/content.ts` | DOM操作 |
