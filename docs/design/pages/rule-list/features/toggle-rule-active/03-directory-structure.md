# ディレクトリ構造設計

## 詳細構造

### 第1層: enterprise-business-rules/

```
src/enterprise-business-rules/
└── entities/                                    ← Entity
    └── RewriteRule/
        └── RewriteRule.ts                       ← withActive(), matchesUrl() 追加
```

### 第2層: application-business-rules/

```
src/application-business-rules/
├── ports/
│   ├── input/                                   ← Input Port (Interface)
│   │   └── IToggleRuleActiveUseCase.ts
│   ├── output/                                  ← Output Port (Interface)
│   │   └── IToggleRuleActivePresenter.ts
│   └── gateway/                                 ← Gateway Interface（Interactorが依存）
│       ├── IRewriteRuleRepository.ts            ← ルール永続化
│       └── ITabsGateway.ts                      ← タブ操作
├── interactors/                                 ← Use Case Interactor
│   └── ToggleRuleActiveInteractor.ts
└── dto/                                         ← Data Transfer Objects
    ├── input/
    │   └── ToggleRuleActiveInputData.ts
    └── output/
        └── ToggleRuleActiveOutputData.ts
```

### 第3層: interface-adapters/

```
src/interface-adapters/
├── controllers/                                 ← Controller
│   └── ToggleRuleActiveController.ts
├── presenters/                                  ← Presenter
│   └── ToggleRuleActivePresenter.ts
├── ports/                                       ← Port（Mapperが依存、ADR-002参照）
│   └── IRewriteRuleMessagingPort.ts             ← MessagingService の抽象化
└── mappers/                                     ← Mapper（ADR-002、ADR-003参照）
    └── RewriteRuleMapper.ts                     ← Entity ↔ DTO 変換 + IRewriteRuleMessagingPort 経由で通信
```

### 第4層: frameworks-and-drivers/

```
src/frameworks-and-drivers/
├── ui/                                          ← View (React)
│   ├── components/
│   │   └── atoms/
│   │       └── ToggleSwitch.tsx                 ← 新規
│   └── pages/
│       └── rules/
│           └── RulesApp.tsx                     ← 既存、変更対象
├── persistence/                                 ← Repository 実装
│   ├── indexeddb/
│   │   └── DexieRewriteRuleRepository.ts        ← DTO ↔ DBレコード変換（Background Script用）
│   └── ChromeRuntimeRewriteRuleRepository.ts    ← メッセージング経由（Content Script用）
├── messaging/                                   ← メッセージング層
│   ├── RewriteRuleMessagingService.ts           ← IRewriteRuleMessagingPort 実装
│   └── dto/                                     ← メッセージング用DTO（ADR-002、ADR-003参照）
│       ├── RewriteRuleDTO.ts                    ← エンティティDTO
│       └── request-dto/                         ← リクエストDTO
│           ├── GetByIdRequestDTO.ts             ← ルール取得要求 { id }
│           └── UpdateRuleActiveRequestDTO.ts    ← トグル更新 { id, isActive }
├── browser/                                     ← ブラウザ操作 Gateway 実装
│   └── ChromeTabsGateway.ts                     ← rule.matchesUrl()判定後リロード（ADR-001参照）
└── di/                                          ← DI Container
    └── container.ts                             ← 既存、変更対象
```
