# クラス設計

## 制御フロー

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     frameworks-and-drivers/ (第4層)                      │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │ ui/pages/rules/RulesApp.tsx (View)                                 │ │
│  │     - ユーザー操作を受け取る                                         │ │
│  │     - Controllerを呼び出す                                          │ │
│  │     - Presenterからの更新を反映                                      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     interface-adapters/ (第3層)                          │
│  ┌──────────────────────────┐    ┌──────────────────────────┐          │
│  │ controllers/rule/        │    │ presenters/rule/         │          │
│  │ ToggleRuleActiveController│    │ ToggleRuleActivePresenter│          │
│  │                          │    │                          │          │
│  │ - ruleIdを受け取る        │    │ - OutputDataを受け取る    │          │
│  │ - InputDataに変換         │    │ - Viewの状態を更新        │          │
│  │ - UseCaseを呼び出す       │    │                          │          │
│  └────────────┬─────────────┘    └──────────▲───────────────┘          │
└───────────────┼──────────────────────────────┼──────────────────────────┘
                │ InputData                    │ OutputData
                ▼                              │
┌──────────────────────────────────────────────────────────────────────────┐
│                   application-business-rules/ (第2層)                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ interactors/rule/ToggleRuleActiveInteractor                      │   │
│  │                                                                  │   │
│  │ - InputDataからruleIdを取得                                       │   │
│  │ - Repositoryからルール取得                                         │   │
│  │ - 有効/無効を反転                                                  │   │
│  │ - Repositoryで更新                                                │   │
│  │ - 該当タブをリロード                                               │   │
│  │ - OutputDataを作成してPresenterに渡す                              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    enterprise-business-rules/ (第1層)                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ entities/RewriteRule/RewriteRule.ts                               │   │
│  │                                                                  │   │
│  │ - withActive(): 有効/無効を変更した新しいインスタンスを返す          │   │
│  │ - matchesUrl(): URLがルールのパターンに一致するか判定              │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

## クラス一覧

### enterprise-business-rules (第1層)

| クラス | 責務 |
|--------|------|
| RewriteRule | ルールエンティティ。有効/無効状態を持つ。`matchesUrl()`でURLマッチング判定（ADR-001参照） |

### application-business-rules (第2層)

| クラス | 責務 |
|--------|------|
| ToggleRuleActiveInputData | 入力DTO。対象ルールIDを保持 |
| ToggleRuleActiveOutputData | 出力DTO。更新後のルールを保持 |
| IToggleRuleActiveUseCase | Input Port。トグル処理のインターフェース |
| IToggleRuleActivePresenter | Output Port。結果通知のインターフェース |
| ToggleRuleActiveInteractor | UseCase実装。トグル処理を実行 |
| IRewriteRuleRepository | Gateway Interface。ルール永続化（Interactorが依存） |
| ITabsGateway | Gateway Interface。タブ操作（Interactorが依存） |

### interface-adapters (第3層)

| クラス | 責務 |
|--------|------|
| ToggleRuleActiveController | ユーザー入力をInputDataに変換 |
| ToggleRuleActivePresenter | OutputDataをViewに通知 |
| RewriteRuleMapper | Entity ↔ DTO 変換 + IRewriteRuleMessagingPort 経由で通信（ADR-002、ADR-003参照） |
| IRewriteRuleMessagingPort | MessagingService の抽象化（Port） |

### frameworks-and-drivers (第4層)

| クラス | 責務 |
|--------|------|
| ChromeRuntimeRewriteRuleRepository | IRewriteRuleRepositoryの実装。Mapperへの委譲のみ（DTOを意識しない）（Rules Page用、ADR-002参照） |
| RewriteRuleProxyService | IRewriteRuleMessagingPort を実装。defineProxyService で定義、Background Scriptで実行（ADR-002参照） |
| DexieRewriteRuleRepository | IndexedDBデータアクセス。DTO ↔ DBレコード変換（Background Script用、ADR-003参照） |
| ChromeTabsGateway | ITabsGatewayの実装。`rule.matchesUrl()`でマッチング判定後、chrome.tabs APIでリロード（ADR-001参照） |
| RewriteRuleDTO | メッセージング用DTO。エンティティ全体を表現（ADR-002、ADR-003参照） |
| GetByIdRequestDTO | メッセージング用DTO。ルール取得要求 `{ id }`（ADR-002、ADR-003参照） |
| UpdateRuleActiveRequestDTO | メッセージング用DTO。トグル更新時の最小データ `{ id, isActive }`（ADR-002、ADR-003参照） |
| ToggleSwitch | UIコンポーネント。トグルスイッチ |
| RulesApp | View。ルール一覧画面 |

## アーキテクチャ補足

### 責務分離の原則

本設計では以下の責務分離を徹底する：

| コンポーネント | 責務 | 備考 |
|---------------|------|------|
| IRewriteRuleRepository | データ永続化のみ | タブリロード等の副作用を含まない |
| ITabsGateway | タブ操作のみ | 永続化ロジックを含まない |
| Interactor | ワークフロー調整 | Repository更新後にTabsGatewayを呼び出す |

これにより、messaging 経由の update は純粋なDB操作のみを行い、
タブリロードは Interactor が ITabsGateway を通じて明示的に制御する。

### Chrome拡張機能のコンテキスト分離

> **参照**: [ADR-002: メッセージングに @webext-core を採用](../../../../adr/002-messaging-with-webext-core.md)
> **参照**: [ADR-003: DB アクセスを messaging 経由に統一し DTO を使用](../../../../adr/003-unified-db-access-via-messaging.md)

Rules Page は技術的には IndexedDB に直接アクセス可能だが、ADR-003 の決定に従い、
すべてのコンテキストからの DB アクセスは messaging 経由で Background Script に集約する。

また、ADR-002 に従い、メッセージングではドメインエンティティではなくDTOを送信する。
Entity ↔ DTO の変換と MessagingService への通信は RewriteRuleMapper クラスが担当する。
ChromeRuntimeRewriteRuleRepository は Mapper への委譲のみを行い、DTO を意識しない（ADR-002、ADR-003参照）。

依存性逆転のため、Mapper は IRewriteRuleMessagingPort インターフェースに依存し、
RewriteRuleProxyService がこれを実装する（ADR-002参照）。

ADR-002 に従い、メッセージングには @webext-core/proxy-service を使用する。

```
┌─────────────────────────────────────────────────────────────────┐
│ Rules Page (別タブ)                                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ RulesApp → Controller → Interactor                          ││
│  │                              ↓                              ││
│  │              IRewriteRuleRepository                         ││
│  │                              ↓                              ││
│  │              ChromeRuntimeRewriteRuleRepository             ││
│  │              (Mapperへの委譲のみ、DTOを意識しない)           ││
│  │                              ↓                              ││
│  │              RewriteRuleMapper                              ││
│  │              (Entity ↔ DTO変換 + IRewriteRuleMessagingPort) ││
│  │                              ↓                              ││
│  │              IRewriteRuleMessagingPort ←─────────────────┐  ││
│  │                                                          │  ││
│  │ Interactor → ITabsGateway → ChromeTabsGateway           │  ││
│  │              (rule.matchesUrl()判定 → chrome.tabs.reload)│  ││
│  └──────────────────────────────┬───────────────────────────┘──┘│
└─────────────────────────────────┼───────────────────────────────┘
                                  │ proxy-service (DTO)
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Background Script                                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ RewriteRuleProxyService (implements IRewriteRuleMessagingPort)    ││
│  │       ↓                                                     ││
│  │ DexieRewriteRuleRepository (IndexedDB)                      ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### ドメインロジックの配置原則

> **参照**: [ADR-001: Clean Architecture Presenter付きパターン採用 - 6. ドメインロジックの配置原則](../../../../adr/001-clean-architecture-with-presenter-pattern.md)

ADR-001 に従い、ドメインエンティティの値を用いた判定・計算は `enterprise-business-rules` 層で実装する。

| ロジック | 配置先 | 実装 |
|---------|--------|------|
| URLパターンマッチング判定 | `enterprise-business-rules` | `RewriteRule.matchesUrl()` |
| 有効/無効状態の反転 | `enterprise-business-rules` | `RewriteRule.withActive()` |
| タブ一覧取得・リロード | `frameworks-and-drivers` | `ChromeTabsGateway`（chrome.tabs API） |

`ChromeTabsGateway.reloadMatchingTabs()` は、タブ一覧を取得後 `rule.matchesUrl()` を呼び出してマッチング判定を行う。

## クラス図

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       enterprise-business-rules/                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ RewriteRule                                                         │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ + withActive(): RewriteRule                                         │   │
│  │ + matchesUrl(url: string): boolean                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                       application-business-rules/                           │
│                                                                             │
│  ┌─────────────────────┐    ┌──────────────────────┐                       │
│  │ <<interface>>       │    │ <<interface>>        │                       │
│  │ IToggleRuleActive   │    │ IToggleRuleActive    │                       │
│  │ UseCase             │    │ Presenter            │                       │
│  │ ─────────────────── │    │ ────────────────────  │                       │
│  │ + execute(input)    │    │ + present(output)    │                       │
│  └──────────▲──────────┘    └──────────▲───────────┘                       │
│             │                          │                                   │
│             │ implements               │ uses                              │
│             │                          │                                   │
│  ┌──────────┴──────────────────────────┴───────────┐                       │
│  │ ToggleRuleActiveInteractor                      │                       │
│  │ ─────────────────────────────────────────────── │                       │
│  │ - repository: IRewriteRuleRepository            │                       │
│  │ - tabsGateway: ITabsGateway                     │                       │
│  │ - presenter: IToggleRuleActivePresenter         │                       │
│  │ ─────────────────────────────────────────────── │                       │
│  │ + execute(inputData): Promise<void>             │                       │
│  └─────────────────────────────────────────────────┘                       │
│                                                                             │
│  ┌─────────────────────┐    ┌──────────────────────┐                       │
│  │ ToggleRuleActive    │    │ ToggleRuleActive     │                       │
│  │ InputData           │    │ OutputData           │                       │
│  │ ─────────────────── │    │ ────────────────────  │                       │
│  │ + ruleId: number    │    │ + toggledRule: Rule  │                       │
│  └─────────────────────┘    └──────────────────────┘                       │
│                                                                             │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐        │
│  │ <<interface>>               │    │ <<interface>>               │        │
│  │ IRewriteRuleRepository      │    │ ITabsGateway                │        │
│  │ ─────────────────────────── │    │ ─────────────────────────── │        │
│  │ + getById(id): Promise<Rule>│    │ + reloadMatchingTabs(rule)  │        │
│  │ + update(rule): Promise     │    │                             │        │
│  └─────────────────────────────┘    └─────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          interface-adapters/                                │
│                                                                             │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐        │
│  │ ToggleRuleActiveController  │    │ ToggleRuleActivePresenter   │        │
│  │ ─────────────────────────── │    │ ─────────────────────────── │        │
│  │ - useCase: IToggleRule...   │    │ - updateRuleInView: Func    │        │
│  │ ─────────────────────────── │    │ ─────────────────────────── │        │
│  │ + toggleActive(ruleId)      │    │ + present(outputData)       │        │
│  └─────────────────────────────┘    └─────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## クラス図（PlantUML）

[04-class-diagram.puml](./04-class-diagram.puml) を参照
