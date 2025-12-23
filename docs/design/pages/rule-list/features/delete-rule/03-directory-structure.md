# ディレクトリ構造設計

## 詳細構造

### 第1層: enterprise-business-rules/

```
src/enterprise-business-rules/
└── entities/                                    ← Entity
    └── RewriteRule/
        └── RewriteRule.ts                       ← matchesUrl() 使用
```

### 第2層: application-business-rules/

```
src/application-business-rules/
├── ports/
│   ├── input/                                   ← Input Port (Interface)
│   │   └── IDeleteRuleUseCase.ts
│   ├── output/                                  ← Output Port (Interface)
│   │   └── IDeleteRulePresenter.ts
│   └── gateway/                                 ← Gateway Interface（Interactorが依存）
│       ├── IRewriteRuleRepository.ts            ← delete() 追加
│       └── ITabsGateway.ts
├── interactors/                                 ← Use Case Interactor
│   └── DeleteRuleInteractor.ts
└── dto/                                         ← Data Transfer Objects
    ├── input/
    │   └── DeleteRuleInputData.ts
    └── output/
        └── DeleteRuleOutputData.ts
```

### 第3層: interface-adapters/

```
src/interface-adapters/
├── controllers/                                 ← Controller
│   └── DeleteRuleController.ts
├── presenters/                                  ← Presenter
│   └── DeleteRulePresenter.ts
├── ports/                                       ← Port（Mapperが依存、ADR-002参照）
│   └── IRewriteRuleMessagingPort.ts             ← delete() 追加
└── mappers/                                     ← Mapper（ADR-002、ADR-003参照）
    └── RewriteRuleMapper.ts                     ← delete() 追加
```

### 第4層: frameworks-and-drivers/

```
src/frameworks-and-drivers/
├── ui/                                          ← View (React)
│   ├── components/
│   │   ├── atoms/
│   │   │   └── DeleteButton/
│   │   │       └── DeleteButton.tsx
│   │   └── molecules/
│   │       ├── ConfirmDialog/
│   │       │   └── ConfirmDialog.tsx
│   │       ├── ToastNotification/
│   │       │   └── ToastNotification.tsx
│   │       └── RuleTableRow/
│   │           └── RuleTableRow.tsx             ← DeleteButton 追加
│   └── pages/
│       └── rules/
│           └── RulesApp.tsx
├── persistence/                                 ← Repository 実装
│   ├── indexeddb/
│   │   └── DexieRewriteRuleRepository.ts        ← delete() 追加
│   └── ChromeRuntimeRewriteRuleRepository.ts    ← delete() 追加
├── messaging/                                   ← メッセージング層
│   ├── RewriteRuleProxyService.ts               ← delete() 追加
│   ├── RewriteRuleMessagingService.ts           ← delete() 追加
│   └── dto/                                     ← メッセージング用DTO（ADR-002、ADR-003参照）
│       └── request-dto/
│           └── DeleteRuleRequestDTO.ts          ← { id }
├── browser/                                     ← ブラウザ操作 Gateway 実装
│   └── ChromeTabsGateway.ts
└── di/                                          ← DI Container
    └── container.ts
```
