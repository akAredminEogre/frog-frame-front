# ADR-001: Clean Architecture フルnrslibパターン採用

## ステータス

承認済み

## コンテキスト

本プロジェクトでは、Clean Architectureを採用しているが、現在のディレクトリ構造は独自の命名を使用している。今後の機能追加（ルールトグル機能など）に際し、Clean Architectureの正式なレイヤー名とnrslibパターン（Input Port / Output Port / Presenter）を採用することで、以下を実現したい：

1. アーキテクチャの意図が明確になる
2. 新規参画者が理解しやすい
3. テスト容易性の向上
4. 依存性逆転の原則の徹底

### 参考資料

- [nrslib Clean Architecture Sample](https://github.com/nrslib/CleanArchitectureSample)
- [実践クリーンアーキテクチャ - nrslib](https://nrslib.com/clean-architecture/)
- Robert C. Martin「Clean Architecture」

## 決定

### 1. ディレクトリ構造: Clean Architecture 4層の正式名称を使用

```
src/
├── enterprise-business-rules/   ← 第1層: Enterprise Business Rules (Entities)
├── application-business-rules/  ← 第2層: Application Business Rules (Use Cases)
├── interface-adapters/          ← 第3層: Interface Adapters
└── frameworks-and-drivers/      ← 第4層: Frameworks & Drivers
```

### 2. フルnrslibパターンの採用

**制御の流れ**: View → Controller → Interactor → Presenter → View

**依存関係**（依存性逆転の原則）:
- Controller → Input Port ← Interactor (implements)
- Interactor → Output Port ← Presenter (implements)

```
【制御の流れ（実線矢印）】

┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐
│   View   │───►│  Controller  │───►│  Interactor  │───►│  Presenter   │───►│   View    │
│ (操作)   │    │              │    │              │    │              │    │ (表示更新) │
└──────────┘    └──────────────┘    └──────────────┘    └───────────────┘    └───────────┘


【依存関係（破線矢印 = implements）】

               ┌──────────────┐                        ┌───────────────┐
               │  Input Port  │                        │  Output Port  │
               │ <<interface>>│                        │ <<interface>> │
               └──────▲───────┘                        └───────▲───────┘
                      │                                        │
                      │ implements                             │ implements
                      │                                        │
               ┌──────┴───────┐    uses             ┌──────────┴──────┐
               │  Interactor  │───────────────────► │    Presenter    │
               │              │  (Output Port経由)   │                 │
               └──────────────┘                     └─────────────────┘
                      │
                      │ uses
                      ▼
               ┌──────────────┐
               │   Gateway    │
               │ <<interface>>│
               └──────────────┘
```

### 3. 12要素とディレクトリの対応

| # | Clean Architecture要素 | ディレクトリ | 備考 |
|---|----------------------|-------------|------|
| 1 | View | `frameworks-and-drivers/ui/` | React コンポーネント |
| 2 | View Model | （Presenterが直接更新するため省略） | |
| 3 | Controller | `interface-adapters/controllers/` | |
| 4 | Presenter | `interface-adapters/presenters/` | |
| 5 | Input Boundary (Input Port) | `application-business-rules/ports/input/` | |
| 6 | Output Boundary (Output Port) | `application-business-rules/ports/output/` | |
| 7 | Use Case Interactor | `application-business-rules/interactors/` | |
| 8 | Data Access Interface | `interface-adapters/gateways/persistence/` | DB関連 Gateway Interface |
| 8 | Data Access Interface | `interface-adapters/gateways/messaging/` | messaging関連 Gateway Interface |
| 9 | Data Access (Repository) | `frameworks-and-drivers/persistence/` | DB Gateway 実装 |
| 9 | Data Access (Repository) | `frameworks-and-drivers/messaging/` | messaging Gateway 実装 |
| 10 | Database | IndexedDB (Dexie) | |
| 11 | Entities | `enterprise-business-rules/entities/` | |
| 12 | External Interfaces | `frameworks-and-drivers/browser/` | Chrome API ラッパー |
| 12 | External Interfaces | `frameworks-and-drivers/entrypoints/background.ts` | Chrome runtime、tabs API、メッセージング |
| 12 | External Interfaces | `frameworks-and-drivers/entrypoints/content.ts` | Webページ操作、DOM操作 |

### 4. 詳細ディレクトリ構造

```
src/
├── enterprise-business-rules/                   ← 第1層: Enterprise Business Rules
│   ├── entities/                               ← Entity
│   │   └── RewriteRule/
│   │       └── RewriteRule.ts
│   ├── value-objects/                          ← Value Object
│   │   └── RewriteRules.ts
│   └── constants/                              ← 定数
│       └── RegexConstants.ts
│
├── application-business-rules/                  ← 第2層: Application Business Rules
│   ├── ports/
│   │   ├── input/                              ← Input Port (Interface)
│   │   │   └── rule/
│   │   │       └── IToggleRuleActiveUseCase.ts
│   │   └── output/                             ← Output Port (Interface)
│   │       └── rule/
│   │           └── IToggleRuleActivePresenter.ts
│   ├── interactors/                            ← Use Case Interactor
│   │   └── rule/
│   │       └── ToggleRuleActiveInteractor.ts
│   └── dto/                                    ← Data Transfer Objects
│       ├── input/
│       │   └── rule/
│       │       └── ToggleRuleActiveInputData.ts
│       └── output/
│           └── rule/
│               └── ToggleRuleActiveOutputData.ts
│
├── interface-adapters/                          ← 第3層: Interface Adapters
│   ├── controllers/                            ← Controller
│   │   └── rule/
│   │       └── ToggleRuleActiveController.ts
│   ├── presenters/                             ← Presenter
│   │   └── rule/
│   │       └── ToggleRuleActivePresenter.ts
│   └── gateways/                               ← Gateway (Interface)
│       ├── persistence/                        ← DB関連
│       │   └── IRewriteRuleRepository.ts
│       └── messaging/                          ← messaging関連
│           ├── ITabReloadGateway.ts
│           └── IDomOperationGateway.ts
│
└── frameworks-and-drivers/                      ← 第4層: Frameworks & Drivers
    ├── ui/                                     ← View (React)
    │   ├── components/
    │   │   ├── atoms/
    │   │   ├── molecules/
    │   │   └── organisms/
    │   └── pages/
    ├── persistence/                            ← DB Gateway 実装
    │   └── indexeddb/
    ├── messaging/                              ← messaging Gateway 実装
    │   ├── ChromeTabReloadGateway.ts
    │   └── ChromeDomOperationGateway.ts
    ├── browser/                                ← Chrome API ラッパー
    ├── di/                                     ← DI Container
    └── entrypoints/                            ← WXT Entry Points (CA外への橋)
```

### 5. 依存関係ルール

```
内側（安定）                                            外側（不安定）
───────────────────────────────────────────────────────────────────────→

┌────────────────────┐   ┌────────────────────┐   ┌──────────────────┐   ┌─────────────────────┐
│ enterprise-business│ ← │application-business│ ← │interface-adapters│ ← │frameworks-and-drivers│
│       -rules       │   │       -rules       │   │                  │   │                     │
└────────────────────┘   └────────────────────┘   └──────────────────┘   └─────────────────────┘

矢印の方向 = 依存の方向
外側から内側への依存のみ許可
```

## 結果

### メリット

1. **意図の明確化**: ディレクトリ名からClean Architectureの層が明確
2. **テスト容易性**: Input Port / Output Portによりモック差し替えが容易
3. **変更容易性**: UI変更がビジネスロジックに影響しない
4. **学習コスト低減**: Clean Architectureの標準的な命名に準拠

### デメリット

1. **ファイル数増加**: DTO、Port、Presenterなどのファイルが増える
2. **初期学習コスト**: フルパターンの理解が必要
3. **既存コードとの不整合**: 段階的な移行が必要

### 移行戦略

Parallel Change（Expand-Contract）パターンを採用：

1. **PR1 (Expand)**: 新構造でスケルトンを追加（既存コード変更なし）
2. **PR2 (Migrate)**: スケルトンに実装を埋める
3. **PR3 (Contract)**: 新実装を有効化、旧実装を削除

## 関連ドキュメント

- [設計書: toggle-rule-active](../design/toggle-rule-active/)
- [ユーザーストーリー: user-story-001-rule-toggle](../user-stories/user-story-001-rule-toggle/)
