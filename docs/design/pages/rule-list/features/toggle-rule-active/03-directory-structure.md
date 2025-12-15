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
├── presenters/                                  ← Presenter
│   └── rule/
│       └── ToggleRuleActivePresenter.ts
├── ports/                                       ← Port（Mapperが依存、依存性逆転のため）
│   └── messaging/
│       └── IRewriteRuleMessagingPort.ts         ← MessagingService の抽象化（ADR-002参照）
│                                                  ※ Mapper（第3層）が依存するため第3層に配置
└── mappers/                                     ← Mapper（ADR-002、ADR-003参照）
    └── rule/
        └── RewriteRuleMapper.ts                 ← Entity ↔ DTO 変換 + IRewriteRuleMessagingPort 経由で通信
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
│   ├── ChromeRuntimeRewriteRuleRepository.ts    ← Mapperへの委譲のみ（DTOを意識しない、Rules Page用）
│   └── dto/                                     ← メッセージング用DTO（ADR-002、ADR-003参照）
│       ├── RewriteRuleDTO.ts                    ← エンティティ全体を表現
│       ├── GetByIdRequestDTO.ts                 ← ルール取得要求 { id }
│       └── UpdateRuleActiveRequestDTO.ts        ← トグル更新 { id, isActive }
├── proxy-service/                               ← proxy-service定義（ADR-002参照）
│   └── RewriteRuleMessagingService.ts           ← IRewriteRuleMessagingPort を実装、Background Scriptで実行
├── browser/                                     ← ブラウザ操作 Gateway 実装
│   └── ChromeTabsGateway.ts                     ← rule.matchesUrl()判定後リロード（ADR-001参照）
└── di/                                          ← DI Container
    └── container.ts                             ← 既存、変更対象
```

