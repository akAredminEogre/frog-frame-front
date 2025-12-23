# ディレクトリ構造

01-class-design.md、02-sequence.puml から導かれる理論的ディレクトリ構成。

## enterprise-business-rules (第1層)

```
src/
├── domain/
│   ├── entities/
│   │   └── RewriteRule/
│   │       └── RewriteRule.ts
│   │
│   ├── value-objects/
│   │   ├── TabUrl.ts
│   │   ├── Elements/
│   │   │   └── Elements.ts
│   │   └── MutationRecords/
│   │       └── MutationRecords.ts
│   │
│   └── ports/
│       ├── IDomRootChecker.ts
│       └── IElementFactory.ts
│
└── domain/
    └── collections/
        └── RewriteRules/
            └── RewriteRules.ts
```

## application-business-rules (第2層)

```
src/
└── application/
    ├── usecases/
    │   └── contentOnMessageReceived/
    │       └── ApplyRulesOnDomMutationUseCase.ts
    │
    └── ports/
        ├── IRewriteRuleRepository.ts
        ├── ICurrentUrlService.ts
        ├── IDebounceTimer.ts
        └── IObserverControl.ts
```

## interface-adapters (第3層)

該当ファイルなし（システムイベントトリガーのため Controller/Presenter パターンを使用しない）

## frameworks-and-drivers (第4層)

```
src/
├── entrypoints/
│   ├── background.ts
│   └── content.ts
│
├── frameworks-and-drivers/
│   ├── di/
│   │   └── contentContainer.ts
│   │
│   ├── messaging/
│   │   └── messaging.ts
│   │
│   └── persistence/
│       └── ChromeRuntimeRewriteRuleRepository.ts
│
└── infrastructure/
    └── browser/
        ├── background/
        │   └── tabs/
        │       └── onUpdated.ts
        │
        ├── content/
        │   ├── observer/
        │   │   ├── onMutate.ts
        │   │   └── observerState.ts
        │   │
        │   └── services/
        │       ├── WindowCurrentUrlService.ts
        │       ├── WindowDebounceTimer.ts
        │       ├── DomRootChecker.ts
        │       └── BrowserElementFactory.ts
        │
        ├── handlers/
        │   └── content/
        │       └── applyAllRulesHandler.ts
        │
        └── tabs/
            ├── ChromeCurrentTabService.ts
            └── ChromeTabsService.ts
```
