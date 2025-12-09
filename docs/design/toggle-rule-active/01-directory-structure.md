# ディレクトリ構造設計

## Clean Architecture 4層構造

```
src/
├── entities/                                    ← 第1層: Entities
├── usecases/                                    ← 第2層: Use Cases
├── interface-adapters/                          ← 第3層: Interface Adapters
└── frameworks/                                  ← 第4層: Frameworks & Drivers
```

## 詳細構造

### 第1層: entities/

```
src/entities/
├── RewriteRule/
│   ├── RewriteRule.ts                          ← withActive() 追加
│   └── PatternProcessingStrategyFactory.ts
├── value-objects/
│   └── RewriteRules.ts
└── constants/
    └── RegexConstants.ts
```

### 第2層: usecases/

```
src/usecases/
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

### 第4層: frameworks/

```
src/frameworks/
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
        内側（安定）                    外側（不安定）
        ───────────────────────────────────────────→

┌──────────────┐   ┌──────────────┐   ┌──────────────────┐   ┌──────────────┐
│   entities   │ ← │   usecases   │ ← │interface-adapters│ ← │  frameworks  │
│              │   │              │   │                  │   │              │
│ RewriteRule  │   │ Interactor   │   │ Controller       │   │ UI (React)   │
│ RewriteRules │   │ InputPort    │   │ Presenter        │   │ Persistence  │
│              │   │ OutputPort   │   │ Gateway(IF)      │   │ Browser API  │
│              │   │ DTO          │   │                  │   │ DI Container │
└──────────────┘   └──────────────┘   └──────────────────┘   └──────────────┘

矢印の方向 = 依存の方向（外→内のみ許可）
```

## Clean Architecture 12要素との対応

| # | 要素 | ディレクトリ |
|---|------|-------------|
| 1 | View | `frameworks/ui/` |
| 2 | View Model | （省略: Presenterが直接更新） |
| 3 | Controller | `interface-adapters/controllers/` |
| 4 | Presenter | `interface-adapters/presenters/` |
| 5 | Input Boundary | `usecases/ports/input/` |
| 6 | Output Boundary | `usecases/ports/output/` |
| 7 | Use Case Interactor | `usecases/interactors/` |
| 8 | Data Access Interface | `interface-adapters/gateways/` |
| 9 | Data Access | `frameworks/persistence/` |
| 10 | Database | IndexedDB (Dexie) |
| 11 | Entities | `entities/` |
| 12 | External Interfaces | `frameworks/browser/` |
