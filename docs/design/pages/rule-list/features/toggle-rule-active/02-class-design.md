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
| ToggleRuleActiveController | interface-adapters | ユーザー入力をInputDataに変換 |
| ToggleRuleActivePresenter | interface-adapters | OutputDataをViewに通知 |
| IRewriteRuleRepository | interface-adapters | Gateway Interface。ルール永続化 |
| ToggleSwitch | frameworks-and-drivers | UIコンポーネント。トグルスイッチ |
| RulesApp | frameworks-and-drivers | View。ルール一覧画面 |

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
│                                                                             │
│  ┌─────────────────────────────┐                                           │
│  │ <<interface>>               │                                           │
│  │ IRewriteRuleRepository      │                                           │
│  │ ─────────────────────────── │                                           │
│  │ + getById(id): Promise<Rule>│                                           │
│  │ + update(rule): Promise     │                                           │
│  └─────────────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────────────┘
```
