# DeleteRuleInteractor.execute() テスト戦略

## 目的

ルールを削除するワークフローを調整する。
Repository経由でルールを取得・削除し、成功をPresenterに通知した後、TabsGateway経由でマッチするタブをリロードする。
エラー発生時はPresenter.presentErrorを呼び出してエラーを通知する。

## テスト分類

### 1. 正常系（基本フロー）

ルールの削除が正常に行われることを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 削除成功 | ルールIDを指定して削除が実行される | 基本的な削除操作の確認 |

**対応テスト**: `normal-cases.test.ts`

### 2. 依存関係の呼び出し

各依存関係が正しい引数で呼び出されることを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| Repository.getById | inputData.ruleIdで呼び出し | タブリロード判定用にルール取得 |
| Repository.delete | inputData.ruleIdで呼び出し | ルールの削除 |
| Presenter.present | OutputDataで呼び出し | 削除成功の通知 |
| TabsGateway.reloadMatchingTabs | 取得したルールで呼び出し | マッチするタブのリロード |

**対応テスト**: `normal-cases.test.ts`（同一テスト内で検証）

### 3. OutputDataの内容

Presenterに渡されるOutputDataが正しいことを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| deletedRuleId設定 | OutputData.deletedRuleIdが入力されたruleId | 出力データの正確性 |

**対応テスト**: `normal-cases.test.ts`（同一テスト内で検証）

### 4. 異常系（エラーハンドリング）

各依存関係でエラーが発生した場合にpresentErrorが呼び出されることを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| Repository.getById失敗 | エラー時にpresentErrorが呼び出される | ルール取得失敗の通知 |
| Repository.delete失敗 | エラー時にpresentErrorが呼び出される | ルール削除失敗の通知 |

**対応テスト**: `error-cases.test.ts`

### 5. 部分的成功（タブリロード失敗）

DB削除成功後にタブリロードが失敗した場合の挙動を確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| TabsGateway.reloadMatchingTabs失敗 | presentが先に呼び出され、その後presentErrorが呼び出される | DB削除成功後のタブリロード失敗 |

**対応テスト**: `partial-success-cases.test.ts`

## 網羅性チェック

- [x] ルール削除成功
- [x] Repository.getByIdの呼び出し確認
- [x] Repository.deleteの呼び出し確認
- [x] Presenter.presentの呼び出し確認
- [x] TabsGateway.reloadMatchingTabsの呼び出し確認
- [x] OutputDataの内容確認
- [x] 異常系（Repository.getByIdでエラー発生）
- [x] 異常系（Repository.deleteでエラー発生）
- [x] 異常系（TabsGateway.reloadMatchingTabsでエラー発生 - 部分的成功）

### 部分的成功の取り扱い

Repository.delete成功後にTabsGateway.reloadMatchingTabsが失敗した場合：
- Presenter.presentが先に呼び出される（UIからルールを削除）
- その後Presenter.presentErrorが呼び出される（タブリロード失敗をユーザーに通知）

これにより、データベースからルールは削除されたがタブリロードが失敗した場合でも、UIは正しい状態（ルール削除済み）を表示する。

## テストファイル構成

```
tests/unit/application-business-rules/interactors/DeleteRuleInteractor/execute/
├── normal-cases.test.ts          # 正常系確認
├── error-cases.test.ts           # 異常系確認（配列ベース、2ケース）
└── partial-success-cases.test.ts # 部分的成功確認
```

## モック戦略

Interactorの3つの依存関係をモック化してテストする。
責務分離のため、モック生成関数は外部ファイルに配置する。

> **重要**: モック作成は [basic-rule.md](../../coding-standards/tests/unit/common-rule/basic-rule.md) の「モック作成の分離ルール」に従うこと。
> - モック作成は、別のクラスファイルに切り出し、それをインポートして使用すること
> - テストコード内で直接モックを定義しないこと
> - モックファクトリは `createMock[ClassName].ts` の形式で命名
> - **モック方法に具体的な実装コードを記載しないこと**（実装はテストコードを参照）

### 既存モック確認チェック（必須）

新規モック作成前に、同一インターフェースの既存モックを確認すること。

- [x] `grep -r "createMockRewriteRuleRepository" tests/` で既存モックを検索した → 既存モック使用
- [x] `grep -r "createMockTabsGateway" tests/` で既存モックを検索した → **既存モック発見、再利用すべき**
- [x] `grep -r "createMockPresenter" tests/` で既存モックを検索した → IDeleteRulePresenter用は新規作成

> **参照**: [common-rule.md](../../../../../coding-standards/tests/common-rule.md) の「モック作成前の確認手順」

### モック対象

| 依存関係 | モック方法 | 理由 | 既存モック |
|---------|-----------|------|-----------|
| IRewriteRuleRepository | vi.fn()でメソッドをモック | DB/メッセージング層を分離 | `tests/unit/application/ports/IRewriteRuleRepository/mocks/` ✓ |
| ITabsGateway | vi.fn()でメソッドをモック | Chrome API層を分離 | `tests/unit/.../ToggleRuleActiveInteractor/mocks/` ✓ |
| IDeleteRulePresenter | vi.fn()でメソッドをモック | View層を分離 | 新規作成（IDeleteRulePresenter固有） |

### モックファイル構成

```
tests/unit/application-business-rules/interactors/DeleteRuleInteractor/
└── mocks/
    ├── createMockPresenter.ts     # IDeleteRulePresenterのモック生成（新規）
    └── createMockTabsGateway.ts   # 既存モックを再エクスポート
```

注:
- IRewriteRuleRepositoryのモックは既存の共通モックを使用
- ITabsGatewayのモックは既存の`ToggleRuleActiveInteractor/mocks/createMockTabsGateway.ts`を再エクスポートすべき

### テストデータ

RewriteRuleエンティティは実インスタンスを使用（matchesUrlの動作確認のため）。
