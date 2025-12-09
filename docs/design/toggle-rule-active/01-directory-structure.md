# ディレクトリ構造設計

## Clean Architecture 4層構造

```
src/
├── enterprise-business-rules/                   ← 第1層: Enterprise Business Rules
├── application-business-rules/                  ← 第2層: Application Business Rules
├── interface-adapters/                          ← 第3層: Interface Adapters
└── frameworks-and-drivers/                      ← 第4層: Frameworks & Drivers
```

## 詳細構造

### 第1層: enterprise-business-rules/

```
src/enterprise-business-rules/
├── RewriteRule/
│   ├── RewriteRule.ts                          ← withActive() 追加
│   └── PatternProcessingStrategyFactory.ts
├── value-objects/
│   └── RewriteRules.ts
└── constants/
    └── RegexConstants.ts
```

### 第2層: application-business-rules/

```
src/application-business-rules/
├── ports/
│   ├── input/
│   │   └── rule/
│   │       └── IToggleRuleActiveUseCase.ts     ← Input Port
│   └── output/
│       └── rule/
│           └── IToggleRuleActivePresenter.ts   ← Output Port
├── interactors/
│   └── rule/
│       └── ToggleRuleActiveInteractor.ts       ← Interactor
└── dto/
    ├── input/
    │   └── rule/
    │       └── ToggleRuleActiveInputData.ts    ← Input DTO
    └── output/
        └── rule/
            └── ToggleRuleActiveOutputData.ts   ← Output DTO
```

### 第3層: interface-adapters/

```
src/interface-adapters/
├── controllers/
│   └── rule/
│       └── ToggleRuleActiveController.ts       ← Controller
├── presenters/
│   └── rule/
│       └── ToggleRuleActivePresenter.ts        ← Presenter
└── gateways/
    └── IRewriteRuleRepository.ts               ← Gateway Interface
```

### 第4層: frameworks-and-drivers/

```
src/frameworks-and-drivers/
├── ui/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── ToggleSwitch.tsx                ← トグルスイッチ
│   │   │   └── ToggleSwitch.module.css
│   │   ├── molecules/
│   │   │   ├── RulePreviewToggle.tsx           ← プレビュー切替
│   │   │   └── RulePreviewToggle.module.css
│   │   └── organisms/
│   └── pages/
│       └── rules/
│           └── RulesApp.tsx                    ← ルール一覧ページ
├── persistence/
│   └── indexeddb/
│       ├── DexieDatabase.ts
│       └── DexieRewriteRuleRepository.ts
├── browser/
│   └── ChromeTabsService.ts
├── di/
│   └── container.ts
└── entrypoints/
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
│ RewriteRule        │   │ Interactor         │   │ Controller       │   │ UI (React)          │
│ RewriteRules       │   │ InputPort          │   │ Presenter        │   │ Persistence         │
│                    │   │ OutputPort         │   │ Gateway(IF)      │   │ Browser API         │
│                    │   │ DTO                │   │                  │   │ DI Container        │
└────────────────────┘   └────────────────────┘   └──────────────────┘   └─────────────────────┘

矢印の方向 = 依存の方向（外→内のみ許可）
```

## Clean Architecture 12要素との対応

| # | 要素 | ディレクトリ |
|---|------|-------------|
| 1 | View | `frameworks-and-drivers/ui/` |
| 2 | View Model | （省略: Presenterが直接更新） |
| 3 | Controller | `interface-adapters/controllers/` |
| 4 | Presenter | `interface-adapters/presenters/` |
| 5 | Input Boundary | `application-business-rules/ports/input/` |
| 6 | Output Boundary | `application-business-rules/ports/output/` |
| 7 | Use Case Interactor | `application-business-rules/interactors/` |
| 8 | Data Access Interface | `interface-adapters/gateways/` |
| 9 | Data Access | `frameworks-and-drivers/persistence/` |
| 10 | Database | IndexedDB (Dexie) |
| 11 | Entities | `enterprise-business-rules/` |
| 12 | External Interfaces | `frameworks-and-drivers/browser/` |
