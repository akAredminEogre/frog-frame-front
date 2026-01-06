# ADR-009: UI/Container分離とAtomic Designの統合

## ステータス

採用

## コンテキスト

本プロジェクトはClean Architectureを採用しているが、Frameworks & Drivers層内のReactコンポーネントの設計指針が明確でなかった。

以下の課題があった：
- コンポーネントがビジネスロジックとUIの両方を担当し、テストが困難
- コンポーネントの粒度が不明確で、再利用性が低い
- Storybookでの見た目確認時に、モックが複雑になる

GLOBIS Tech Blog記事で紹介されているUI/Container分離パターンと、Atomic Designを統合することで、これらの課題を解決する。

## 決定

### 統合の前提

#### 層の位置づけ

| Clean Architecture層 | 含まれる要素 |
|---------------------|-------------|
| Enterprise Business Rules | Entity, ValueObject, DomainService |
| Application Business Rules | UseCase(Interactor), InputData/OutputData, InputPort/OutputPort |
| Interface Adapters | Controller, Presenter, Repository実装, Gateway実装, Factory, DTO, ViewModel |
| Frameworks & Drivers | React Components, Custom Hooks(UI状態管理), DIコンテナ設定 |

#### UI/Container分離の位置づけ

| 要素 | Clean Architecture層 |
|-----|---------------------|
| UI層（.ui.tsx） | Frameworks & Drivers |
| Container層（.container.tsx） | Frameworks & Drivers |
| Hooks（useXxx.ts）※UI状態管理 | Frameworks & Drivers |
| Composition | Frameworks & Drivers内の設計手法 |

#### Atomic Designの位置づけ

Atomic DesignはすべてFrameworks & Drivers層内のUIコンポーネントの粒度分類として適用。

### ディレクトリ構成

```
src/
├── domain/                          # Enterprise Business Rules
│   ├── entities/
│   ├── valueObjects/
│   └── services/
│
├── application/                     # Application Business Rules
│   └── useCases/
│       └── [useCaseName]/
│           ├── I[UseCaseName]UseCase.ts    # InputPort
│           ├── [UseCaseName]Interactor.ts
│           ├── [UseCaseName]InputData.ts
│           ├── [UseCaseName]OutputData.ts
│           └── I[UseCaseName]Presenter.ts  # OutputPort
│
├── adapters/                        # Interface Adapters
│   ├── controllers/
│   ├── presenters/
│   ├── factories/
│   ├── repositories/
│   ├── gateways/
│   ├── dtos/
│   └── viewModels/
│
├── di/                              # 依存性注入設定
│   └── container.ts
│
└── frameworks/                      # Frameworks & Drivers
    └── react/
        ├── components/              # Atomic Design適用
        │   ├── atoms/
        │   ├── molecules/
        │   └── organisms/
        │
        ├── templates/               # ページレイアウト
        │
        └── pages/                   # ページ単位（Container + Composition）
            └── [PageName]/
                ├── index.tsx                    # エントリーポイント
                ├── [PageName].container.tsx     # Container（Controller呼び出し）
                ├── [PageName].ui.tsx            # Presentational Component
                ├── hooks/
                │   └── use[PageName]State.ts    # ページ固有のUI状態管理
                └── components/                  # ページ固有コンポーネント
```

### 設計ルール

#### 依存関係ルール

| 層 | 依存できる層 |
|----|-------------|
| domain/ | なし |
| application/ | domain/ のみ |
| adapters/ | domain/, application/ |
| frameworks/ | domain/, application/, adapters/ |

#### Container（.container.tsx）の責務

- DIコンテナからControllerを取得
- UI状態（useState）を管理
- Controllerのコールバックを定義
- UI層にpropsとCompositionで子要素を渡す

#### UI（.ui.tsx）の責務

- propsで受け取ったデータを表示
- propsで受け取ったコールバックを呼び出す
- useState/useEffectは見た目に関する状態のみ許容（アニメーション、フォーカス等）
- ビジネスロジックに関する状態は持たない

#### Atomic Design適用範囲

| 分類 | 配置場所 | 特徴 |
|------|---------|------|
| atoms | components/atoms/ | 最小UI部品、汎用的 |
| molecules | components/molecules/ | atoms組み合わせ、汎用的 |
| organisms | components/organisms/ | 複数ページで再利用される単位 |
| templates | templates/ | ページレイアウト |
| pages | pages/[PageName]/ | ページ固有、Container/UI分離 |

#### ページ固有コンポーネント

- `pages/[PageName]/components/` に配置
- Atomic Designの階層には含めない
- これによりorganismsの肥大化を防ぐ

#### Compositionルール

- UI層は子コンポーネントを直接importしない
- Container層でCompositionし、UI層にReactNodeとして渡す
- これによりUI層のテスタビリティを確保

### テスト戦略

| 層 | テスト対象 | テスト手法 |
|----|-----------|-----------|
| domain/ | Entity, ValueObject, DomainService | 単体テスト |
| application/ | Interactor | 単体テスト（Repository/Gateway/Presenterをモック） |
| adapters/ | Controller, Presenter, Repository | 単体テスト + 統合テスト |
| frameworks/ UI層 | Presentational Component | Storybook + VRT |
| frameworks/ Container層 | Container Component | 統合テスト（Controllerをモック） |

UI層がビジネスロジックを持たないため、Storybookでの見た目確認が容易になる。

## 理由

1. **テスタビリティ向上**: UI層がビジネスロジックを持たないため、Storybookでの見た目確認が容易
2. **関心の分離**: Container層がロジック、UI層が表示を担当することで、変更の影響範囲を限定
3. **再利用性向上**: Atomic Designによりコンポーネントの粒度が明確になり、再利用が容易
4. **Clean Architectureとの整合性**: すべてFrameworks & Drivers層内の設計手法として位置づけ、層の境界を維持

### 適用済みの箇所

該当なし（新規採用）

### 適用待ちの箇所

| 対象 | 現状 | 対応方針 |
|------|------|---------|
| 既存のReactコンポーネント | Container/UI分離なし | 新規開発から段階的に適用 |

## 影響ドキュメント

このADRが変更された場合、以下のドキュメントも更新が必要：

- なし

## 関連ドキュメント

- [ADR-001: Clean Architecture with Presenter Pattern](./001-clean-architecture-with-presenter-pattern.md)
- [ADR-005: Factory Pattern for React Callback Injection](./005-factory-pattern-for-react-callback-injection.md)
- [ADR-008: UI Component Directory Migration](./008-ui-component-directory-migration.md)
