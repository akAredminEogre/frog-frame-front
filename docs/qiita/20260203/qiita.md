# Chrome拡張機能開発にClean Architectureを適用した話 〜WXT + TypeScript + Reactで実践〜

## はじめに

Chrome拡張機能の開発において、「Clean Architectureなんて大袈裟では？」と思われる方も多いかもしれません。しかし、機能が増えてくると、background scriptとcontent scriptの間のメッセージング、Chrome APIへの依存、データ永続化など、複雑さは急速に増していきます。

本記事では、実際のChrome拡張機能開発プロジェクトでClean Architectureを適用した経験から得た知見を共有します。

### 技術スタック

- **WXT**: Chrome拡張機能フレームワーク（Viteベース）
- **TypeScript**: 型安全性の確保
- **React**: UI構築
- **tsyringe**: DIコンテナ
- **Vitest + Playwright**: テスト

## Clean Architectureの4層構造

プロジェクトでは、Clean Architectureの正式なレイヤー名を採用しています。

```text
src/
├── enterprise-business-rules/   # 第1層: Entities, Value Objects
├── application-business-rules/  # 第2層: Use Cases, Interactors
├── interface-adapters/          # 第3層: Controllers, Presenters
└── frameworks-and-drivers/      # 第4層: UI, Chrome API, DB
```

### なぜ正式名称を使うのか

「domain」「application」「infrastructure」といった独自の命名も一般的ですが、正式名称を使うことで：

1. **新規参画者が理解しやすい**: Clean Architectureの文献と対応づけやすい
2. **設計の意図が明確**: どのレイヤーがどの責務を持つか迷わない
3. **AI駆動開発との相性**: LLMに設計意図を伝えやすい

## Chrome拡張機能特有の課題と解決策

### 課題1: background / content script間のメッセージング

Chrome拡張機能では、backgroundとcontent scriptが異なるコンテキストで動作します。直接の関数呼び出しはできず、メッセージングが必要です。

**解決策: Gateway Interfaceによる抽象化**

```text
application-business-rules/ports/gateway/
├── IRewriteRuleRepository.ts  # データアクセスのInterface
└── ITabsGateway.ts            # タブ操作のInterface

frameworks-and-drivers/persistence/
└── ChromeRuntimeRewriteRuleRepository.ts  # メッセージング経由で実装
```

Interactor（Use Case）はGateway Interfaceにのみ依存し、メッセージングの詳細を知りません。これにより、テスト時にはモックを注入でき、実装の変更も局所化されます。

### 課題2: Chrome APIへの依存

`chrome.tabs.query()`や`chrome.runtime.sendMessage()`といったChrome APIは、テスト環境では動作しません。

**解決策: Frameworks & Drivers層への隔離**

```text
ドメインロジック: enterprise-business-rules層で実装
Chrome API呼び出し: frameworks-and-drivers層で実装
```

例えば、「このルールがURLにマッチするか」という判定ロジックは第1層のEntityに実装し、「マッチするタブをリロードする」というChrome API呼び出しは第4層のGateway実装に記述します。

```text
【ドメインロジックの配置例】

enterprise-business-rules:
  RewriteRule.matchesUrl(url): boolean  # ドメイン判定

frameworks-and-drivers:
  ChromeTabsGateway.reloadMatchingTabs(rule):
    tabs = chrome.tabs.query()
    for tab in tabs:
      if rule.matchesUrl(tab.url):  # ドメインロジック呼び出し
        chrome.tabs.reload(tab.id)
```

この分離により、ドメインロジックはChrome APIモックなしでテスト可能になります。

## Presenter付きパターンの採用

### 制御の流れ

```text
View → Controller → Interactor → Presenter → View
```

Controllerはユーザー入力を受け取り、InteractorのInput Portを呼び出します。Interactorはビジネスロジックを実行し、結果をPresenterのOutput Portに渡します。Presenterは結果をViewに通知します。

### エラーハンドリングの責務

エラーハンドリングはInteractorの責務としました。Viewでtry-catchを書く必要はありません。

```text
【エラー系の流れ】
View → Controller → Interactor → (try-catch) → Presenter.presentError() → View
```

Viewは`fire-and-forget`で非同期処理を呼び出し、エラーはPresenter経由で通知されます。これにより、Viewはビジネスロジックを持たず、表示に専念できます。

## UI/Container分離とAtomic Design

Frameworks & Drivers層内のReactコンポーネントには、UI/Container分離パターンを適用しています。

### ディレクトリ構成

```text
pages/[PageName]/
├── index.tsx                    # エントリーポイント
├── [PageName].container.tsx     # Container: Controller呼び出し、状態管理
├── [PageName].ui.tsx            # UI: 表示のみ
├── hooks/
│   └── use[PageName]State.ts    # UI状態管理Hook
└── components/                  # ページ固有コンポーネント
```

### Containerの責務

- DIコンテナからControllerを取得
- UI状態（useState）を管理
- Controllerのコールバックを定義
- UI層にpropsで渡す

### UIの責務

- propsで受け取ったデータを表示
- propsで受け取ったコールバックを呼び出す
- ビジネスロジックに関する状態は持たない

この分離により、UI層はStorybookで容易にプレビューでき、ビジュアルリグレッションテストが実施しやすくなります。

## テスト戦略書ドリブン開発

プロジェクトでは、**テストコードを書く前にテスト戦略書を作成する**というルールを設けています。

### なぜテスト戦略書が先なのか

1. **テストケースの網羅性を事前に検討できる**: 実装に引きずられたテストにならない
2. **レビューが容易**: テスト戦略書をレビューすることで、実装前に設計の妥当性を確認できる
3. **ドキュメントとしての価値**: テスト戦略書がそのまま仕様書として機能する

### テスト戦略書の配置

```text
docs/design/src/[layer]/[category]/[ClassName]/[methodName].md
```

ソースコードのディレクトリ構造をミラーリングすることで、テスト戦略書とコードの対応が明確になります。

## 得られた効果

### ドメインロジックの分離

Chrome拡張機能特有の技術的詳細（メッセージング、Chrome API、IndexedDB）からドメインロジックを分離できました。ブラウザ対応（Firefox対応など）の際も、ドメインロジックは変更不要です。

### テスト容易性

各層の責務が明確なため、適切な粒度でテストを書けます。

- **enterprise-business-rules**: 純粋なユニットテスト
- **application-business-rules**: Gateway/Presenterをモック
- **interface-adapters**: Interactorをモック
- **frameworks-and-drivers**: 統合テスト / E2Eテスト

### AI駆動開発との相性

Clean Architectureの明確な層構造とADR（Architecture Decision Records）により、AIアシスタントに設計意図を伝えやすくなりました。「この機能はどの層に実装すべきか」という判断を、ADRを参照しながら行えます。

## まとめ

Chrome拡張機能開発にClean Architectureを適用することで、以下を実現できました。

- ドメインロジックとブラウザ固有実装の分離
- テスト容易性の向上
- 設計判断の明文化（ADR）
- AI駆動開発との親和性

「Chrome拡張機能にClean Architectureは大袈裟」と思われるかもしれませんが、機能が増えてくると、この投資は確実にリターンをもたらします。

「現場での妥協」という言い訳をせずにClean Architectureを実践することで、コードベースの健全性を維持し続けることができます。

## 参考資料

- [実践クリーンアーキテクチャ - nrslib](https://nrslib.com/clean-architecture/)
- Robert C. Martin「Clean Architecture 達人に学ぶソフトウェアの構造と設計」
- [前回の記事: WXTをDocker環境で動かす](https://qiita.com/)（※リンクは仮）
