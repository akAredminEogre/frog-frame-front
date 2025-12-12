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
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

## クラス一覧

| クラス | 層 | 責務 |
|--------|-----|------|
| RewriteRule | enterprise-business-rules | ルールエンティティ。有効/無効状態を持つ |
| ToggleRuleActiveInputData | application-business-rules | 入力DTO。対象ルールIDを保持 |
| ToggleRuleActiveOutputData | application-business-rules | 出力DTO。更新後のルールを保持 |
| IToggleRuleActiveUseCase | application-business-rules | Input Port。トグル処理のインターフェース |
| IToggleRuleActivePresenter | application-business-rules | Output Port。結果通知のインターフェース |
| ToggleRuleActiveInteractor | application-business-rules | UseCase実装。トグル処理を実行 |
| IRewriteRuleRepository | application-business-rules | Gateway Interface。ルール永続化（Interactorが依存） |
| ITabsGateway | application-business-rules | Gateway Interface。タブ操作（Interactorが依存） |
| ToggleRuleActiveController | interface-adapters | ユーザー入力をInputDataに変換 |
| ToggleRuleActivePresenter | interface-adapters | OutputDataをViewに通知 |
| ChromeRuntimeRewriteRuleRepository | frameworks-and-drivers | IRewriteRuleRepositoryの実装。messaging経由でbackgroundと通信（Rules Page用） |
| DexieRewriteRuleRepository | frameworks-and-drivers | IRewriteRuleRepositoryの実装。IndexedDB直接アクセス（Background Script用） |
| ChromeTabsGateway | frameworks-and-drivers | ITabsGatewayの実装。タブリロード（Rules Page用、chrome.tabs API使用） |
| RewriteRuleDTO | frameworks-and-drivers | メッセージング用DTO。エンティティ全体を表現（ADR-003参照） |
| GetByIdRequestDTO | frameworks-and-drivers | メッセージング用DTO。ルール取得要求 `{ id }` |
| UpdateRuleActiveDTO | frameworks-and-drivers | メッセージング用DTO。トグル更新時の最小データ `{ id, isActive }` |
| ToggleSwitch | frameworks-and-drivers | UIコンポーネント。トグルスイッチ |
| RulesApp | frameworks-and-drivers | View。ルール一覧画面 |

## アーキテクチャ補足

### 責務分離の原則

本設計では以下の責務分離を徹底する：

| コンポーネント | 責務 | 備考 |
|---------------|------|------|
| IRewriteRuleRepository | データ永続化のみ | タブリロード等の副作用を含まない |
| ITabsGateway | タブ操作のみ | 永続化ロジックを含まない |
| Interactor | ワークフロー調整 | Repository更新後にTabsGatewayを呼び出す |

これにより、Repository の update メッセージは純粋なDB操作のみを行い、
タブリロードは Interactor が ITabsGateway を通じて明示的に制御する。

### Chrome拡張機能のコンテキスト分離

> **参照**: [ADR-002: DB アクセスを messaging 経由に統一](../../../../adr/002-unified-db-access-via-messaging.md)
> **参照**: [ADR-003: メッセージングでは DTO を使用](../../../../adr/003-messaging-uses-dto-not-entity.md)

Rules Page は技術的には IndexedDB に直接アクセス可能だが、ADR-002 の決定に従い、
すべてのコンテキストから DB アクセスは messaging 経由で Background Script に集約する。

また、ADR-003 に従い、メッセージングではドメインエンティティではなくプリミティブ/DTO を送信し、
受信側（ChromeRuntimeRewriteRuleRepository）で RewriteRule エンティティを再構築する。

```
┌─────────────────────────────────────────────────────────────────┐
│ Rules Page (別タブ)                                              │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ RulesApp → Controller → Interactor                          ││
│  │                              ↓                              ││
│  │              IRewriteRuleRepository                         ││
│  │                              ↓                              ││
│  │              ChromeRuntimeRewriteRuleRepository             ││
│  │              (sendMessage: DTO送信 / 受信: DTO→Entity再構築) ││
│  │                                                             ││
│  │ Interactor → ITabsGateway → ChromeTabsGateway              ││
│  │              (chrome.tabs.reload)                           ││
│  └──────────────────────────────┬──────────────────────────────┘│
└─────────────────────────────────┼───────────────────────────────┘
                                  │ messaging (DTO/プリミティブのみ)
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Background Script                                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ MessageHandler                                              ││
│  │       ↓                                                     ││
│  │ DexieRewriteRuleRepository (IndexedDB)                      ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## クラス図

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       enterprise-business-rules/                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ RewriteRule                                                         │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ + withActive(): RewriteRule                                         │   │
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
