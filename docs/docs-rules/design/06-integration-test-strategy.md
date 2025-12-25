# 06-integration-test-strategy.md ルール

結合テストの設計意図と網羅性を可視化するドキュメント。

## 目的

- 複数コンポーネント間の連携が正しく動作することを検証する設計を明文化
- テスト対象フローの全体像を可視化
- モック戦略（何をモックし、何を実際に動かすか）を明確化
- 入力値 → ロジック → DB の整合性検証ポイントを定義

## 単体テストとの違い

| 観点 | 単体テスト | 結合テスト |
|------|-----------|-----------|
| **スコープ** | 1クラス/1メソッド | 複数レイヤーのフロー |
| **配置基準** | ソースコード構造に対応 | feature単位 |
| **モック戦略** | 依存を全てモック | 外部依存のみモック |
| **検証対象** | 入出力の正確性 | レイヤー間の連携・DB整合性 |
| **DB** | モック | 実DB（fake-indexeddb等） |

## 配置

結合テスト戦略書は、featureの `00-overview.md` と同じディレクトリに配置する。

```
docs/design/pages/{page-name}/features/{feature-name}/
├── 00-overview.md
├── ...
└── integration-test-strategy.md    # ← ここに配置
```

### 配置例

| feature | テスト戦略書 |
|---------|-------------|
| toggle-rule-active（ルール有効/無効切り替え） | `docs/design/pages/rule-list/features/toggle-rule-active/integration-test-strategy.md` |
| create-rule（ルール作成） | `docs/design/pages/rule-list/features/create-rule/integration-test-strategy.md` |

### 設計意図

- **feature単位**: 機能ごとにテストを管理し、再利用性を高める
- **設計ドキュメントと同一ディレクトリ**: 設計書との対応を明確化、検索性を向上
- **トレーサビリティ**: `00-overview.md` と同じ場所に配置することで、機能の全体像を把握しやすくする

## 必須セクション

| セクション | 必須 | 説明 |
|-----------|------|------|
| 目的 | ○ | 結合テストで検証する内容を簡潔に記述 |
| テストスコープ | ○ | 対象レイヤー、実コンポーネント、モック対象の一覧 |
| テスト分類 | ○ | テストケースを観点ごとに分類 |
| 網羅性チェック | ○ | 過不足を確認するチェックリスト |
| テストファイル構成 | ○ | 実際のテストファイルとの対応 |
| モック戦略 | ○ | モック対象と理由、モックファイル構成 |
| テストデータ設計 | ○ | 初期データと期待結果 |
| 依存関係図 | △ | フローが複雑な場合は必須 |

## テストスコープの定義

### 対象フローの記述

テスト対象の処理フローをASCII図で示す:

```markdown
### 対象レイヤー

\`\`\`
入力: ruleId
  ↓
Controller.toggleActive(ruleId)
  ↓
Interactor.execute(inputData)
  ├→ Repository.getById(ruleId)
  ├→ Entity.withActive(!isActive)
  ├→ Repository.update(toggledRule)
  ├→ [Gateway.reloadMatchingTabs() - モック]
  └→ Presenter.present(outputData)
       ↓
出力: callback(toggledRule)
\`\`\`
```

### 実コンポーネント vs モック

| 分類 | コンポーネント | 理由 |
|------|---------------|------|
| 実コンポーネント | Controller, UseCase, Repository, Entity, Presenter | 連携検証が目的 |
| モック | Gateway（Chrome API依存） | テスト環境で動作不可 |

## テスト分類の観点

結合テスト特有の観点:

| 観点 | 説明 | 例 |
|------|------|-----|
| 状態切り替え | ビジネスロジックの正常動作 | true→false, false→true |
| データ整合性 | 入力とDB保存値の一致 | ID整合性、他プロパティ不変 |
| 出力整合性 | コールバック/戻り値の検証 | Presenter経由の出力 |
| 副作用の範囲 | 他データへの影響がないこと | 他レコード不変 |
| エラー伝播 | エラーの正しいハンドリング | 存在しないID、DB未変更 |

## テンプレート

```markdown
# {feature-name} 結合テスト戦略

## 目的

[結合テストで検証する内容を1-2文で記述]

## テストスコープ

### 対象レイヤー

\`\`\`
入力: [入力パラメータ]
  ↓
[Controller].[method]()
  ↓
[Interactor].execute()
  ├→ [Repository].[method]()
  ├→ [Entity].[method]()
  ├→ [[モック対象] - モック]
  └→ [Presenter].present()
       ↓
出力: [コールバック/戻り値]
\`\`\`

### 実コンポーネント（モックしない）

| レイヤー | コンポーネント | 理由 |
|---------|---------------|------|
| Interface Adapters | [Controller名] | [理由] |
| Application | [Interactor名] | [理由] |
| Infrastructure | [Repository名] | [理由] |
| Enterprise | [Entity名] | [理由] |

### モック対象

| コンポーネント | 理由 |
|---------------|------|
| [Gateway名] | [外部依存の理由] |

## テスト分類

### 1. 正常系 - [観点名]

[この観点でテストする理由]

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| ... | ... | ... |

**対応テスト**: `normal-cases.test.ts`

### 2. データ整合性 - [観点名]

[この観点でテストする理由]

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| ... | ... | ... |

**対応テスト**: `data-integrity.test.ts`

### 3. 出力整合性 - [観点名]

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| ... | ... | ... |

**対応テスト**: `presenter-output.test.ts`

### 4. エラー系 - [観点名]

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| ... | ... | ... |

**対応テスト**: `error-cases.test.ts`

## 網羅性チェック

- [x] [確認項目1]
- [x] [確認項目2]
- [ ] [不要な項目] → [不要な理由]

## テストファイル構成

\`\`\`
tests/integration/{feature-name}/
├── setup.ts                    # 共通セットアップ
├── helpers/
│   └── createTest[Name].ts     # テストデータ生成ヘルパー
├── normal-cases.test.ts        # 正常系テスト
├── data-integrity.test.ts      # データ整合性テスト
├── presenter-output.test.ts    # Presenter出力テスト
└── error-cases.test.ts         # エラー系テスト
\`\`\`

※ モックファイルは `tests/integration/` 配下ではなく、`tests/{layer}/{category}/{ClassName}/` に配置する（後述のモック戦略を参照）

## モック戦略

### モック対象

- **[コンポーネント名]**: [モックする理由]

### モックの実装方針

[モックの振る舞いをどう定義するか]

### モックファイル構成

モックファイルは `docs/coding-standards/tests/common-rule.md` の「モックファイルの配置ルール」に従い、
モック対象クラスのソースディレクトリ構造を `tests/` 配下で反映したディレクトリに配置する。

\`\`\`
tests/{layer}/{category}/{ClassName}/
└── createMock[Name].ts
\`\`\`

例: `src/frameworks-and-drivers/browser/ChromeTabsGateway/` のモック
→ `tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway.ts`

## テストデータ設計

### 初期データ

\`\`\`typescript
// [説明]
const [変数名] = new [Entity](
  [プロパティ値],
  ...
);
\`\`\`

### 期待結果

| 入力 | 操作後の状態 | DB状態 | コールバック引数 |
|------|-------------|--------|-----------------|
| [入力データ] | [期待状態] | [DB内容] | [コールバック内容] |

## 依存関係図

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    テストコード                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 1. DBにテストデータ挿入                                 │   │
│  │ 2. Controller.[method]() 呼び出し                     │   │
│  │ 3. コールバック結果を検証                               │   │
│  │ 4. DBの状態を検証                                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  結合対象コンポーネント                       │
│                                                             │
│  [フローを図示]                                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`
```

## 記述ルール

### テストスコープの明確化

- 結合テストで検証するレイヤーを明示
- モック対象とその理由を必ず記載
- 「なぜこのコンポーネントは実物を使うのか」を説明

### データ整合性の検証ポイント

以下の観点を必ず含める:

1. **入力 → DB**: 入力値がDBに正しく保存されるか
2. **DB → 出力**: DBの値が正しく出力に反映されるか
3. **副作用**: 他のデータに影響がないか

### エラー系の設計

- エラー発生時の**DBの状態**を検証（ロールバック的動作）
- エラーコールバックの呼び出しを検証
- 正常系コールバックが呼ばれないことを検証

## テストファイル命名規則

| ファイル名 | 内容 |
|-----------|------|
| `setup.ts` | テスト環境のセットアップ（fake-indexeddb等） |
| `normal-cases.test.ts` | 正常系テスト |
| `data-integrity.test.ts` | データ整合性テスト |
| `presenter-output.test.ts` | Presenter/コールバック出力テスト |
| `error-cases.test.ts` | エラー系テスト |
| `helpers/createTest*.ts` | テストデータ生成ヘルパー |

※ モックファクトリ（`createMock*.ts`）は `tests/{layer}/{category}/{ClassName}/` に配置

## 実行環境

- **DBモック**: fake-indexeddb（IndexedDBのインメモリ実装）
- **ブラウザAPI**: @webext-core/fake-browser
- **テストフレームワーク**: Vitest

## 単体テスト戦略書との関係

| 単体テスト戦略書 | 結合テスト戦略書 |
|-----------------|-----------------|
| 個別メソッドの入出力 | フロー全体の連携 |
| `docs/design/src/` | `docs/design/integration-tests/` |
| クラス/メソッド単位 | feature単位 |

両方のテスト戦略書を作成することで、テストの網羅性を担保する。

## 参考

- 単体テスト戦略書: [05-test-strategy.md](./05-test-strategy.md)
- ユーザーストーリー: `docs/user-stories/`
