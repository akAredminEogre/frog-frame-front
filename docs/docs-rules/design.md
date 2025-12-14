# design ドキュメントルール

## 設計方針

**理論的設計を先行させる**

設計ドキュメントは Clean Architecture の原則に基づく「理論的なあるべき姿」を記述する。
既存実装との齟齬は設計段階では考慮せず、ユーザーストーリーの現状分析で差分を管理する。

```
設計ドキュメント（理論）  →  ユーザーストーリー（現状分析）  →  実装
     ↓                              ↓
 あるべき姿を定義            理論と現実の差分を分類・計画
```

## ディレクトリ構造

```
docs/design/
├── pages/                              # 画面/トリガー単位の設計
│   └── {画面名 or トリガー名}/         # 例: rule-list, edit, tab-reload
│       ├── ui.md                       # 必須: UI設計（画面の場合）
│       └── features/                   # 機能単位の設計
│           └── {機能名}/               # 例: toggle-rule-active
│               ├── 00-overview.md      # 必須: 概要
│               ├── 01-class-design.md  # 必須: クラス設計（理論）
│               ├── 02-sequence.puml    # 必須: シーケンス図
│               └── 03-directory-structure.md  # 必須: ディレクトリ構成（理論）
└── clean-architecture/                 # アーキテクチャ共通設計（参考用）
    └── domain/
        └── entities.md
```

## 命名規則

### ディレクトリ名

- `pages/` 配下のディレクトリ名（`features/` の親）: **画面名**または**トリガー名**
  - 画面名: `rule-list`, `edit`, `popup` など
  - トリガー名: `tab-reload`, `url-change` など（画面に紐づかない機能の場合）
- 機能名: kebab-case（小文字、ハイフン区切り）
- 例: `toggle-rule-active`, `batch-delete`

### ファイル名

- 番号プレフィックス: 2桁（`00-`, `01-`, `02-`, `03-`）
- 名前: kebab-case
- 拡張子: `.md` または `.puml`（シーケンス図）

## 必須ファイル

### ui.md（画面単位）

画面全体のUI設計を記載（トリガー単位の場合は不要）:

| セクション | 必須 | 説明 |
|-----------|------|------|
| レイアウト | ○ | 画面構成の概要 |
| コンポーネント一覧 | ○ | 使用するコンポーネント表 |
| 状態遷移 | △ | 画面の状態遷移（必要な場合） |

### 00-overview.md（機能単位）

機能概要を記載:

| セクション | 必須 | 説明 |
|-----------|------|------|
| 機能概要 | ○ | 機能の説明（1-2行） |
| ユーザーストーリー | ○ | 引用形式でストーリーを記載 |
| トリガー | ○ | アクター、画面、トリガー条件の表 |
| 機能要件 | ○ | 要件の箇条書き |
| 影響ドキュメント | ○ | 影響を受けるドキュメント一覧 |
| 関連ドキュメント | ○ | 関連ドキュメントへのリンク |

#### トリガー

各トリガーパターンの記述例:

**ユーザー操作トリガー（画面単位）**

```markdown
| アクター | 画面 | トリガー |
|---------|------|---------|
| ユーザー | ルール一覧（rules） | トグルスイッチをクリック |

※ システムイベント（タブリロード等）による自動トリガーはなし
```

**システムイベントトリガー（トリガー単位）**

```markdown
| アクター | イベント | トリガー |
|---------|---------|---------|
| システム | タブ更新 | chrome.tabs.onUpdated |
| システム | URL変更 | chrome.webNavigation.onCompleted |

※ ユーザー操作による直接トリガーはなし
```

**複合トリガー**

```markdown
| アクター | 画面/イベント | トリガー |
|---------|--------------|---------|
| ユーザー | ルール編集（edit） | 保存ボタンをクリック |
| システム | 保存完了後 | 該当タブの自動リロード |
```

#### 機能要件

機能要件の記述ルール:

- **ドメイン用語で記述する**（実装詳細を避ける）
- 「何をするか」を記述し、「どう実装するか」は記述しない

```markdown
## 良い例（ドメイン用語）

- ルールの有効/無効を切り替える

## 悪い例（実装詳細）

- isActiveフラグを反転する
```

### 01-class-design.md（機能単位）

Clean Architecture 4層に従った**理論的設計**を記載:

| セクション | 必須 | 説明 |
|-----------|------|------|
| 制御フロー | ○ | 処理の流れを示す図 |
| クラス一覧 | ○ | クラスと責務の表 |
| クラス図 | ○ | クラス間の関係を示す図 |
| 影響ドキュメント | ○ | 影響を受けるドキュメント一覧 |

**重要**: 既存実装に引っ張られず、Clean Architecture原則に基づいて設計する
- 既存クラスの現在位置は考慮しない
- 「あるべき層」にクラスを配置する

#### インターフェースの層配置ルール

**依存性ルール**: 内側の層は外側の層に依存してはならない

インターフェースは「それを使用する層」に配置する（実装する層ではない）:

| インターフェース種別 | 配置層 | 理由 |
|---------------------|--------|------|
| Input Port（例: IToggleRuleActiveUseCase） | application-business-rules (第2層) | Controller (第3層) が依存 |
| Output Port（例: IToggleRuleActivePresenter） | application-business-rules (第2層) | Interactor (第2層) が依存 |
| Gateway Interface（例: IRewriteRuleRepository, ITabsGateway） | application-business-rules (第2層) | Interactor (第2層) が依存 |

**誤りやすいパターン**:
- ❌ Gateway Interface を interface-adapters (第3層) に配置 → Interactor が外側の層に依存してしまう
- ✅ Gateway Interface を application-business-rules (第2層) に配置 → 依存性ルールを遵守

#### 設計と実装の分離

- **コード例は記載しない**（実装は実際のソースコードが正）
- 設計書は「構造」と「責務」を示す
- 実装の詳細はソースコードを参照

| 記載する | 記載しない |
|----------|-----------|
| クラス名と責務 | 完全なコード例 |
| メソッドの目的 | メソッドの実装 |
| クラス間の関係 | import文 |

#### 影響ドキュメント
`01-class-design.md` が変更された際には、以下のドキュメントも更新が必要：
`02-sequence.puml`

### 02-sequence.puml（機能単位）

01-class-design.md を実現するシーケンス図をPlantUML形式で記載:

| 要素 | 必須 | 説明 |
|------|------|------|
| 参加者（participant） | ○ | 各層のクラス/コンポーネント |
| メッセージ | ○ | クラス間の呼び出し（メソッド名含む） |
| 戻り値 | ○ | 処理結果の返却 |
| 注釈 | △ | 必要に応じて補足説明 |

**重要**: 01-class-design.md と整合性を保つこと
- **01-class-design.md のクラス一覧に記載した全てのクラス/型を participant として含めること**
  - Interface（IToggleRuleActiveUseCase 等）
  - 具象クラス（ToggleRuleActiveInteractor 等）
  - DTO（ToggleRuleActiveInputData, ToggleRuleActiveOutputData, RewriteRuleDTO 等）
  - Entity（RewriteRule）
- クラス設計で定義したメソッドがシーケンス図に反映されていること
- 層の境界を明確に示すこと
- **インスタンス生成やメソッド呼び出しは、note（注釈）ではなくシーケンス図の記法で表現すること**
  - ✅ `MessagingRepo -> Entity : fromDTO(dto)` （メソッド呼び出しとして表現）
  - ❌ `note over MessagingRepo : DTOからEntity再構築` （処理内容を注釈で説明）
  - 注釈は「なぜそうするか」の補足説明に限定し、「何をするか」はシーケンス図で表現する
- **interface-adapters/gateways/messaging 以下のクラスも忘れずに設計に含めること**
  - Chrome拡張機能では popup/rules ↔ background 間の通信が必要
- **Iで始まる抽象インターフェースもシーケンス図に含めること**
  - Input Port（例: IToggleRuleActiveUseCase）
  - Output Port（例: IToggleRuleActivePresenter）
  - Gateway Interface（例: IRewriteRuleRepository, ITabsGateway）
  - 依存性逆転の原則を明示するため、具象クラスではなくインターフェースへの依存を示す
  - **01-class-design.md のクラス一覧に記載した全ての Interface を漏れなく含めること**
- **複数の実行コンテキスト（Rules Page, Background Script等）がある場合、各コンテキスト内のクラスも Clean Architecture 層で分類すること**
  - 例: Background Script 内でも frameworks-and-drivers 層と interface-adapters 層を区別する

### 03-directory-structure.md（機能単位）

01-class-design.md、02-sequence.puml から導かれる**理論的ディレクトリ構成**を記載:

| セクション | 必須 | 説明 |
|-----------|------|------|
| 第1層〜第4層 | ○ | 各層のディレクトリツリー |
| 導線図 | ○ | 処理の流れと各層の役割 |
| 変更対象サマリ | ○ | 新規/移行/変更ファイルの一覧 |

**重要**: 理論的配置を記載する
- Clean Architecture原則に基づく「あるべき配置」を記載
- 既存実装との齟齬は考慮しない（ユーザーストーリーで管理）
- 00-overview.md の導線に直接関係するファイルのみ記載

## 図の記法

- ASCII Art を使用
- UMLライクな表記を推奨
- 矢印の意味を凡例で示す

例:
```
矢印の方向 = 依存の方向（外→内のみ許可）
```

### 04-class-diagram.puml

機能単位のクラス図をPlantUML形式で記載

plantuml.comで画像としてレンダリングしたときに、下記が達成されていること

- まず下記のクラスを、データアクセスpackageとして1つにまとめる
  - DB用メッセージングサービスクラス
  - DB用メッセージングサービスクラス用DTO
  - DB用リポジトリクラス
- 図を横に2分割したときに、
  - 上半分
    - `upper half` packageとしてまとめる
    - `upper half` をさらに縦に4分割にするpackageにまとめる。左から順に
      - 1列目：`upper first column` package
        - 上から、Controller、 Presenter、ViewModel(あれば)
      - 2列目：`upper second column` package
        - 上から、InputData、UseCaseの抽象クラス、Presenterの抽象クラス、OutputData
      - 3列目：`upper third column` package
        - 上から、Interactor、Repositoryの抽象クラス、Repositoryの具象クラス
      - 4列目：`upper fourth column` package
        - 上から、Repository以外のGatewayの具象クラス、Repository以外のGatewayの抽象クラス、Entity
  - 下半分
    - `lower half` packageとしてまとめる
    - `lower half` をさらに縦に2分割にするpackageにまとめる。左から順に
      - 1列目：`lower first column` package
        - 上から、View(UIコンポーネント)
      - 2列目：`lower second column` package
        - データアクセスpackage(概念的にRepositoryの具象クラス)
        - データアクセスpackageをさらに縦に2分割にするpackageにまとめる。左から順に
          - 1列目：`data access first column` package
            - 上から、DTOのMapperクラス、DB用メッセージング抽象クラス、DB用メッセージング具象クラス、DB用リポジトリクラス
          - 2列目：`data access second column` package
            - 上から、DB用メッセージングサービスクラス用DTO

## 関連ドキュメント

- ユーザーストーリー: `docs/user-stories/`
- ADR: `docs/adr/`
- 基本ルール: [docs-rules.md](../docs-rules.md)
- ユーザーストーリールール: [user-stories.md](./user-stories.md)
