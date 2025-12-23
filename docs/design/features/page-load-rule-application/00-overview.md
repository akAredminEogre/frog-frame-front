# ページロード時ルール適用機能 設計概要

## 機能概要

ブラウザでページがロードされたとき、保存されているリライトルールを自動的にDOM要素に適用する機能。
また、ページロード後に遅延読み込みされるコンテンツ（Lazy Load）にも対応し、MutationObserverによる継続的な監視を行う。

## ユーザーストーリー

> ユーザーがWebページを開くと、設定したリライトルールが自動的に適用され、DOM要素が変換される

## トリガー

| アクター | イベント | トリガー |
|---------|---------|---------|
| システム | ページロード完了 | `chrome.tabs.onUpdated` で `status === 'complete'` |
| システム | DOM変更検知 | MutationObserverによるDOM変更検知 |

## 処理フロー

### 1. ページロード時（初回適用）

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Background Script                                                            │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ tabsOnUpdated()                                                         │ │
│  │   ↓ chrome.tabs.onUpdated (status === 'complete')                      │ │
│  │   ↓ canInjectContentScript() でURL検証                                  │ │
│  │   ↓ sendApplyAllRulesMessage() でContent Scriptにメッセージ送信        │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ messaging (applyAllRules)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ Content Script                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ runtimeOnMessageReceived() → applyAllRulesHandler()                    │ │
│  │   ↓ disconnectObserver() でMutationObserver一時停止                    │ │
│  │   ↓ ApplyRulesOnDomMutationUseCase.applyRulesToRoot(document.body)    │ │
│  │   ↓   → Repository経由でマッチングルール取得                           │ │
│  │   ↓   → DOM要素にルール適用                                            │ │
│  │   ↓ reconnectObserver() でMutationObserver再開                         │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2. DOM変更時（Lazy Load対応）

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Content Script                                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ observerOnMutate() - MutationObserver                                  │ │
│  │   ↓ DOM変更検知（childList, subtree監視）                              │ │
│  │   ↓ ApplyRulesOnDomMutationUseCase.handleMutations(mutations)         │ │
│  │   ↓   → 初回ロード完了前はスキップ                                     │ │
│  │   ↓   → 追加された要素を蓄積                                           │ │
│  │   ↓   → デバウンス（100ms）後にルール適用                              │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 機能要件

### ページロード時の自動ルール適用

- タブのページロード完了時（`status === 'complete'`）にルールを自動適用
- 制限されたURL（`chrome://`、`edge://` 等）にはルール適用しない
- マッチングルール（現在のURLに一致するルール）のみを適用

### Lazy Loadコンテンツ対応

- MutationObserverでDOM変更を継続監視
- 初回ページロード完了後のみMutation処理を実行
- デバウンス（100ms）で連続DOM変更をバッチ処理
- 追加された要素のみを処理対象とする

### 重複適用の防止

- ルール適用中はMutationObserverを一時停止
- 初回ロード完了フラグ（`hasInitialLoadCompleted`）で状態管理
- ルート適用中フラグ（`isApplyingToRoot`）で重複防止

## 非機能要件

### パフォーマンス

- デバウンスによる処理の最適化（100ms間隔）
- DOMに接続されている要素のみを処理対象とする
- シングルトンインスタンスによる状態管理の効率化

### エラーハンドリング

- タブ情報取得失敗時は静かに無視（タブが存在しない場合等）
- コンテンツスクリプト未注入時のメッセージエラーは無視

## 関連コンポーネント

| ファイル | 責務 |
|---------|------|
| `entrypoints/background.ts` | Background Scriptエントリポイント。イベントリスナー登録 |
| `entrypoints/content.ts` | Content Scriptエントリポイント。メッセージ受信・Observer登録 |
| `infrastructure/browser/background/tabs/onUpdated.ts` | タブ更新イベント処理 |
| `infrastructure/browser/content/runtime/onMessageReceived.ts` | メッセージ受信ハンドラ登録 |
| `infrastructure/browser/handlers/content/applyAllRulesHandler.ts` | ルール適用メッセージハンドラ |
| `infrastructure/browser/content/observer/onMutate.ts` | MutationObserver登録・管理 |
| `application/usecases/contentOnMessageReceived/ApplyRulesOnDomMutationUseCase.ts` | ルール適用UseCase |

## 状態遷移図

```
                                    Content Script初期化
                                           │
                                           ▼
                    ┌─────────────────────────────────────┐
                    │ hasInitialLoadCompleted = false     │
                    │ MutationObserver: 監視開始          │
                    │                                     │
                    │ ※ Mutation検知してもスキップ        │
                    └──────────────────┬──────────────────┘
                                       │
                           applyAllRules メッセージ受信
                                       │
                                       ▼
                    ┌─────────────────────────────────────┐
                    │ isApplyingToRoot = true             │
                    │ MutationObserver: 一時停止          │
                    │                                     │
                    │ ルール取得 → DOM適用                │
                    └──────────────────┬──────────────────┘
                                       │
                              ルール適用完了
                                       │
                                       ▼
                    ┌─────────────────────────────────────┐
                    │ hasInitialLoadCompleted = true      │
                    │ isApplyingToRoot = false            │
                    │ MutationObserver: 再開              │
                    │                                     │
                    │ ※ 以降Mutation処理が有効になる      │
                    └──────────────────┬──────────────────┘
                                       │
                            DOM変更検知（Lazy Load等）
                                       │
                                       ▼
                    ┌─────────────────────────────────────┐
                    │ 要素蓄積 → デバウンス（100ms）       │
                    │                                     │
                    │ デバウンス完了後:                   │
                    │ - Observer一時停止                  │
                    │ - 蓄積要素にルール適用              │
                    │ - Observer再開                      │
                    └─────────────────────────────────────┘
```

## URL検証

コンテンツスクリプトを注入できないURLへのメッセージ送信を防止:

- `chrome://` - Chrome内部ページ
- `edge://` - Edge内部ページ
- `about:` - ブラウザ内部ページ
- `chrome-extension://` - 拡張機能ページ

詳細は `domain/value-objects/TabUrl.ts` の `canInjectContentScript()` を参照。
