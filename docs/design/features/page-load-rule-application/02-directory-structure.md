# ディレクトリ構造

## 関連ファイル一覧

```
host-frontend-root/frontend-src-root/src/
├── entrypoints/
│   ├── background.ts                           # Background Script エントリポイント
│   └── content.ts                              # Content Script エントリポイント
│
├── application/
│   ├── ports/
│   │   ├── ICurrentUrlService.ts               # 現在のURL取得ポート
│   │   ├── IDebounceTimer.ts                   # デバウンスタイマーポート
│   │   ├── IObserverControl.ts                 # MutationObserver制御ポート
│   │   └── IRewriteRuleRepository.ts           # リライトルールリポジトリポート
│   │
│   └── usecases/
│       └── contentOnMessageReceived/
│           └── ApplyRulesOnDomMutationUseCase.ts   # ルール適用UseCase
│
├── domain/
│   ├── ports/
│   │   ├── IDomRootChecker.ts                  # DOM接続チェックポート
│   │   └── IElementFactory.ts                  # 要素生成ポート
│   │
│   └── value-objects/
│       ├── TabUrl.ts                           # タブURL値オブジェクト
│       ├── TabId.ts                            # タブID値オブジェクト
│       ├── Elements/
│       │   └── Elements.ts                     # 要素コレクション
│       └── MutationRecords/
│           └── MutationRecords.ts              # MutationRecordコレクション
│
├── frameworks-and-drivers/
│   ├── di/
│   │   └── contentContainer.ts                 # Content Script用DIコンテナ
│   │
│   └── messaging/
│       └── messaging.ts                        # @webext-core/messaging 設定
│
└── infrastructure/
    └── browser/
        ├── background/
        │   ├── runtime/
        │   │   └── onMessageReceived.ts        # Background メッセージ受信
        │   └── tabs/
        │       └── onUpdated.ts                # タブ更新イベントハンドラ
        │
        ├── content/
        │   ├── instance/
        │   │   └── domMutationUseCaseInstance.ts   # UseCase シングルトン
        │   ├── observer/
        │   │   ├── onMutate.ts                 # MutationObserver登録
        │   │   └── observerState.ts            # Observer状態管理
        │   └── runtime/
        │       └── onMessageReceived.ts        # Content メッセージ受信
        │
        ├── handlers/
        │   └── content/
        │       └── applyAllRulesHandler.ts     # ルール適用メッセージハンドラ
        │
        └── tabs/
            ├── ChromeCurrentTabService.ts      # タブ情報取得サービス
            └── ChromeTabsService.ts            # タブ操作サービス
```

## レイヤー別責務

### Entrypoints（エントリポイント）

WXTフレームワークのエントリポイント。Composition Rootとして各サービスを初期化・登録。

| ファイル | 責務 |
|---------|------|
| `background.ts` | Background Script初期化。イベントリスナー登録 |
| `content.ts` | Content Script初期化。メッセージ/Observer登録 |

### Application（アプリケーション層）

ユースケースとポートインターフェースを定義。外部依存を抽象化。

| ファイル | 責務 |
|---------|------|
| `ApplyRulesOnDomMutationUseCase.ts` | ルール適用のビジネスロジック |
| `IRewriteRuleRepository.ts` | ルール取得の抽象化 |
| `ICurrentUrlService.ts` | 現在URL取得の抽象化 |
| `IDebounceTimer.ts` | デバウンス処理の抽象化 |
| `IObserverControl.ts` | Observer制御の抽象化 |

### Domain（ドメイン層）

純粋なビジネスルールと値オブジェクト。外部依存なし。

| ファイル | 責務 |
|---------|------|
| `TabUrl.ts` | タブURL。`canInjectContentScript()` でURL検証 |
| `TabId.ts` | タブID値オブジェクト |
| `Elements.ts` | 要素コレクション。蓄積・抽出ロジック |
| `MutationRecords.ts` | MutationRecordコレクション |
| `IDomRootChecker.ts` | DOM接続チェックポート |
| `IElementFactory.ts` | 要素生成ポート |

### Infrastructure（インフラストラクチャ層）

Chrome API、DOM API、ブラウザ固有の実装。

| ファイル | 責務 |
|---------|------|
| `tabs/onUpdated.ts` | `chrome.tabs.onUpdated` イベント処理 |
| `observer/onMutate.ts` | MutationObserver登録・管理 |
| `observer/observerState.ts` | Observer状態管理（disconnect/reconnect） |
| `handlers/content/applyAllRulesHandler.ts` | ルール適用メッセージハンドラ |
| `ChromeCurrentTabService.ts` | タブ情報取得（chrome.tabs API） |
| `ChromeTabsService.ts` | タブ操作（chrome.tabs API） |

### Frameworks and Drivers（フレームワーク層）

DIコンテナ、外部ライブラリ設定。

| ファイル | 責務 |
|---------|------|
| `contentContainer.ts` | Content Script用Awilix DIコンテナ設定 |
| `messaging.ts` | @webext-core/messaging 設定 |

## テスト構造

```
host-frontend-root/frontend-src-root/tests/
├── unit/
│   ├── application/
│   │   └── usecases/
│   │       └── contentOnMessageReceived/
│   │           └── ApplyRulesOnDomMutationUseCase/
│   │               └── handleMutations/
│   │                   └── normal-cases.test.ts
│   │
│   ├── domain/
│   │   └── value-objects/
│   │       └── TabUrl/
│   │           └── canInjectContentScript/
│   │               ├── normal-cases.test.ts
│   │               ├── restricted-schemes.test.ts
│   │               └── restricted-urls.test.ts
│   │
│   └── infrastructure/
│       └── browser/
│           └── content/
│               └── observer/
│                   └── onMutate/
│                       └── normal-cases.test.ts
│
└── e2e/
    └── replace-inside-dom-with-regex.spec.ts   # DOM置換E2Eテスト
```
