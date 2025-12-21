# ToggleRuleActiveInteractor.execute() テスト戦略

## 目的

ルールの有効/無効状態をトグルするワークフローを調整する。
Repository経由でルールを取得・更新し、TabsGateway経由でマッチするタブをリロードし、Presenterへ結果を通知する。

## テスト分類

### 1. 状態変更（同値分割）

isActiveの状態変更が正しく行われることを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| true → false | isActive=trueのルールをfalseに切り替え | 有効→無効の基本パターン |
| false → true | isActive=falseのルールをtrueに切り替え | 無効→有効の基本パターン |

**対応テスト**: `normal-cases.test.ts`

### 2. 依存関係の呼び出し

各依存関係が正しい引数で呼び出されることを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| Repository.getById | inputData.ruleIdで呼び出し | 正しいIDでルール取得 |
| Repository.update | トグル後のルールで呼び出し | 更新されたルールの永続化 |
| TabsGateway.reloadMatchingTabs | トグル後のルールで呼び出し | マッチするタブのリロード |
| Presenter.present | OutputDataで呼び出し | 結果の通知 |

**対応テスト**: `normal-cases.test.ts`（同一テスト内で検証）

### 3. OutputDataの内容

Presenterに渡されるOutputDataが正しいことを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| toggledRule設定 | OutputData.toggledRuleがトグル後のルール | 出力データの正確性 |

**対応テスト**: `normal-cases.test.ts`（同一テスト内で検証）

## 網羅性チェック

- [x] isActive=true → falseの切り替え
- [x] isActive=false → trueの切り替え
- [x] Repository.getByIdの呼び出し確認
- [x] Repository.updateの呼び出し確認
- [x] TabsGateway.reloadMatchingTabsの呼び出し確認
- [x] Presenter.presentの呼び出し確認
- [x] OutputDataの内容確認
- [ ] 異常系（Repository.getByIdでルールが見つからない） → 不要（Repository層で例外処理、Interactorは例外を伝播）
- [ ] 異常系（Repository.updateの失敗） → 不要（Infrastructure層で例外処理、Interactorは例外を伝播）

### 異常系テストが不要な理由

Interactorは正常フローの調整のみを担当し、エラーハンドリングの責務を持たない：

1. **責務の分離**: Interactorはワークフロー調整のみ、エラー処理はInfrastructure層
2. **エラー伝播**: Repositoryからのエラーは呼び出し元（Controller→View層）に伝播してUIで処理
3. **シンプルな設計**: 現時点でのビジネスルールに複雑な条件分岐がない

## テストファイル構成

```
tests/unit/application-business-rules/interactors/ToggleRuleActiveInteractor/execute/
└── normal-cases.test.ts       # 状態変更確認（配列ベース、2ケース）
```

## モック戦略

Interactorの3つの依存関係をモック化してテストする。
責務分離のため、モック生成関数は外部ファイルに配置する。

### モック対象

| 依存関係 | モック方法 | 理由 |
|---------|-----------|------|
| IRewriteRuleRepository | vi.fn()でメソッドをモック | DB/メッセージング層を分離 |
| ITabsGateway | vi.fn()でメソッドをモック | Chrome API層を分離 |
| IToggleRuleActivePresenter | vi.fn()でメソッドをモック | View層を分離 |

### モックファイル構成

```
tests/unit/application-business-rules/interactors/ToggleRuleActiveInteractor/
└── mocks/
    ├── createMockRepository.ts    # IRewriteRuleRepositoryのモック生成
    ├── createMockTabsGateway.ts   # ITabsGatewayのモック生成
    └── createMockPresenter.ts     # IToggleRuleActivePresenterのモック生成
```

### テストデータ

RewriteRuleエンティティは実インスタンスを使用（withActiveの動作確認のため）。
