# クラス設計

## 制御フロー

```
┌──────────────────────────────────────────────────────────────────────────┐
│                     Background Script                                     │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ background.ts (Composition Root)                                    │  │
│  │     - 各イベントリスナーを登録                                        │  │
│  │     - tabsOnUpdated() を呼び出し                                     │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                     │                                     │
│                                     ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ tabs/onUpdated.ts                                                   │  │
│  │     - chrome.tabs.onUpdated リスナー登録                            │  │
│  │     - status === 'complete' で処理開始                              │  │
│  │     - ChromeCurrentTabService でタブ情報取得                        │  │
│  │     - TabUrl.canInjectContentScript() でURL検証                     │  │
│  │     - ChromeTabsService.sendApplyAllRulesMessage() でメッセージ送信 │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ messaging (applyAllRules)
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     Content Script                                        │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ content.ts (Composition Root)                                       │  │
│  │     - runtimeOnMessageReceived() でメッセージハンドラ登録           │  │
│  │     - observerOnMutate() でMutationObserver登録                     │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                   │                                 │                     │
│                   ▼                                 ▼                     │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────┐ │
│  │ runtime/onMessageReceived.ts │  │ observer/onMutate.ts             │ │
│  │                              │  │                                  │ │
│  │ - applyAllRules ハンドラ登録 │  │ - MutationObserver 登録          │ │
│  │ - applyAllRulesHandler呼出  │  │ - DOM変更時handleMutations呼出  │ │
│  └──────────────┬───────────────┘  └────────────────┬─────────────────┘ │
│                 │                                   │                    │
│                 ▼                                   ▼                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ handlers/content/applyAllRulesHandler.ts                          │   │
│  │                                                                   │   │
│  │ - disconnectObserver() で Observer一時停止                        │   │
│  │ - domMutationUseCaseInstance.applyRulesToRoot(document.body)     │   │
│  │ - reconnectObserver() で Observer再開                             │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                     │                                    │
│                                     ▼                                    │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ ApplyRulesOnDomMutationUseCase (シングルトン)                      │   │
│  │                                                                   │   │
│  │ - applyRulesToRoot(): 初回ページロード時の全体適用                 │   │
│  │ - handleMutations(): Lazy Load等のDOM変更時の部分適用             │   │
│  │ - hasInitialLoadCompleted: 初回ロード完了フラグ                    │   │
│  │ - isApplyingToRoot: 適用中フラグ                                  │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
```

## クラス一覧

### Background Script

| クラス/関数 | 責務 |
|------------|------|
| `tabsOnUpdated()` | `chrome.tabs.onUpdated` リスナー登録。ページロード完了時にContent Scriptへメッセージ送信 |
| `ChromeCurrentTabService` | 指定タブIDのタブ情報を取得 |
| `ChromeTabsService` | タブ操作サービス。`sendApplyAllRulesMessage()` でContent Scriptにルール適用を指示 |
| `TabUrl` | 値オブジェクト。`canInjectContentScript()` でURL検証 |
| `TabId` | 値オブジェクト。タブIDをラップ |

### Content Script

| クラス/関数 | 責務 |
|------------|------|
| `runtimeOnMessageReceived()` | メッセージハンドラ登録。`applyAllRules` メッセージを受信 |
| `observerOnMutate()` | MutationObserver登録。DOM変更を監視 |
| `applyAllRulesHandler()` | ルール適用メッセージハンドラ。Observer制御とUseCase呼び出し |
| `ApplyRulesOnDomMutationUseCase` | ルール適用UseCase。初回ロードとMutation処理の両方を担当 |
| `observerState` | MutationObserverの状態管理（disconnect/reconnect） |

### Application Layer (UseCase)

| クラス | 責務 |
|--------|------|
| `ApplyRulesOnDomMutationUseCase` | DOM変更時のルール適用ロジック。デバウンス、状態管理、重複防止を担当 |
| `IRewriteRuleRepository` | リライトルール取得のポートインターフェース |
| `ICurrentUrlService` | 現在のURL取得のポートインターフェース |
| `IDebounceTimer` | デバウンス処理のポートインターフェース |
| `IObserverControl` | MutationObserver制御のポートインターフェース |

### Domain Layer

| クラス | 責務 |
|--------|------|
| `TabUrl` | タブURL値オブジェクト。URL検証ロジックを保持 |
| `TabId` | タブID値オブジェクト |
| `Elements` | 要素コレクション値オブジェクト。蓄積・抽出ロジック |
| `MutationRecords` | MutationRecordコレクション値オブジェクト。追加要素抽出 |
| `RewriteRules` | リライトルールコレクション。ルール適用ロジック |
| `IDomRootChecker` | DOM接続チェックのポートインターフェース |
| `IElementFactory` | 要素生成のポートインターフェース |

## クラス図

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Background Script                                   │
│                                                                             │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐        │
│  │ tabsOnUpdated()             │    │ ChromeTabsService           │        │
│  │ ─────────────────────────── │    │ ─────────────────────────── │        │
│  │ + addListener()             │───▶│ + sendApplyAllRulesMessage()│        │
│  └─────────────────────────────┘    └─────────────────────────────┘        │
│               │                                                             │
│               ▼                                                             │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐        │
│  │ ChromeCurrentTabService     │    │ TabUrl                      │        │
│  │ ─────────────────────────── │───▶│ ─────────────────────────── │        │
│  │ + getTabById()              │    │ + canInjectContentScript()  │        │
│  └─────────────────────────────┘    └─────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          Content Script                                      │
│                                                                             │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐        │
│  │ applyAllRulesHandler()      │    │ observerOnMutate()          │        │
│  │ ─────────────────────────── │    │ ─────────────────────────── │        │
│  │ + handle()                  │    │ + observe()                 │        │
│  └──────────────┬──────────────┘    └──────────────┬──────────────┘        │
│                 │                                   │                       │
│                 └─────────────┬─────────────────────┘                       │
│                               ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ApplyRulesOnDomMutationUseCase                                       │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ - elements: Elements                                                 │   │
│  │ - repository: IRewriteRuleRepository                                 │   │
│  │ - hasInitialLoadCompleted: boolean                                   │   │
│  │ - isApplyingToRoot: boolean                                          │   │
│  │ ─────────────────────────────────────────────────────────────────── │   │
│  │ + applyRulesToRoot(root: Element): Promise<void>                     │   │
│  │ + handleMutations(mutations: MutationRecord[]): void                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                               │                                             │
│                               ▼                                             │
│  ┌─────────────────────────────┐    ┌─────────────────────────────┐        │
│  │ <<interface>>               │    │ <<interface>>               │        │
│  │ IRewriteRuleRepository      │    │ IObserverControl            │        │
│  │ ─────────────────────────── │    │ ─────────────────────────── │        │
│  │ + getRulesMatchingUrl()     │    │ + disconnect()              │        │
│  │                             │    │ + reconnect()               │        │
│  └─────────────────────────────┘    └─────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## シーケンス図

### ページロード時

```
Background           Content Script          UseCase              Repository
    │                     │                     │                     │
    │ tabs.onUpdated      │                     │                     │
    │ (status=complete)   │                     │                     │
    │────────────────────▶│                     │                     │
    │ sendApplyAllRules   │                     │                     │
    │                     │                     │                     │
    │                     │ disconnectObserver  │                     │
    │                     │────────┐            │                     │
    │                     │        │            │                     │
    │                     │◀───────┘            │                     │
    │                     │                     │                     │
    │                     │ applyRulesToRoot    │                     │
    │                     │────────────────────▶│                     │
    │                     │                     │                     │
    │                     │                     │ getRulesMatchingUrl │
    │                     │                     │────────────────────▶│
    │                     │                     │                     │
    │                     │                     │◀────────────────────│
    │                     │                     │ rules               │
    │                     │                     │                     │
    │                     │                     │ applyRules          │
    │                     │                     │────────┐            │
    │                     │                     │        │            │
    │                     │                     │◀───────┘            │
    │                     │                     │                     │
    │                     │◀────────────────────│                     │
    │                     │ success             │                     │
    │                     │                     │                     │
    │                     │ reconnectObserver   │                     │
    │                     │────────┐            │                     │
    │                     │        │            │                     │
    │                     │◀───────┘            │                     │
    │                     │                     │                     │
```

### DOM変更時（Lazy Load対応）

```
MutationObserver        UseCase              DebounceTimer        Repository
    │                     │                     │                     │
    │ mutations           │                     │                     │
    │────────────────────▶│                     │                     │
    │                     │                     │                     │
    │                     │ if(!hasInitialLoad) │                     │
    │                     │   return (skip)     │                     │
    │                     │                     │                     │
    │                     │ extractAddedElements│                     │
    │                     │────────┐            │                     │
    │                     │        │            │                     │
    │                     │◀───────┘            │                     │
    │                     │                     │                     │
    │                     │ scheduleWithGuard   │                     │
    │                     │────────────────────▶│                     │
    │                     │                     │                     │
    │                     │                     │ (100ms debounce)    │
    │                     │                     │────────┐            │
    │                     │                     │        │            │
    │                     │                     │◀───────┘            │
    │                     │                     │                     │
    │                     │◀────────────────────│                     │
    │                     │ callback            │                     │
    │                     │                     │                     │
    │                     │ getRulesMatchingUrl │                     │
    │                     │─────────────────────────────────────────▶│
    │                     │                     │                     │
    │                     │◀─────────────────────────────────────────│
    │                     │ rules               │                     │
    │                     │                     │                     │
    │                     │ applyToElements     │                     │
    │                     │────────┐            │                     │
    │                     │        │            │                     │
    │                     │◀───────┘            │                     │
    │                     │                     │                     │
```

## 依存関係

### ApplyRulesOnDomMutationUseCase の依存

| 依存 | インターフェース | 実装 |
|------|-----------------|------|
| リポジトリ | `IRewriteRuleRepository` | `ChromeRuntimeRewriteRuleRepository` |
| URL取得 | `ICurrentUrlService` | `WindowCurrentUrlService` |
| デバウンス | `IDebounceTimer` | `WindowDebounceTimer` |
| Observer制御 | `IObserverControl` | `ObserverControl` |
| DOMチェック | `IDomRootChecker` | `DomRootChecker` |
| 要素生成 | `IElementFactory` | `BrowserElementFactory` |

これらの依存は `contentContainer.ts` でDI登録される。

## 設計上の考慮点

### シングルトンパターンの採用理由

`ApplyRulesOnDomMutationUseCase` をシングルトンとして管理する理由：

1. **状態の一貫性**: `hasInitialLoadCompleted` と `isApplyingToRoot` フラグを共有
2. **重複防止**: ページロード時とMutation処理で同一インスタンスを使用することで競合を防止
3. **要素蓄積の統一**: 複数のMutation処理で蓄積する要素を単一のコレクションで管理

### MutationObserver制御の必要性

ルール適用中にMutationObserverを停止する理由：

1. **無限ループ防止**: DOM変更がObserverをトリガーし、再度ルール適用が走ることを防止
2. **パフォーマンス**: 不要なMutation検知とデバウンス処理を削減
3. **一貫性**: ルール適用完了後に新たなDOM変更を検知開始
