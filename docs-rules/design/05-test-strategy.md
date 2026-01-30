# 05-test-strategy.md ルール

テストコードの設計意図と網羅性を可視化するドキュメント。

## 目的

- テストケースの「なぜ必要か」を明示する
- テストの冗長・不足を判断する基準を提供する
- AIが生成したテストのレビューを容易にする
- 複数ファイルにまたがるテストの全体像を俯瞰する

## 配置

テスト戦略書は **ソースコードのディレクトリ構造をミラーリング** して配置する（Clean Architecture準拠）。

```text
docs/design/src/
└── [layer]/
    └── [category]/
        └── [ClassName]/
            └── [methodName].md
```

### 配置例

| ソースコード | テスト戦略書 |
|-------------|-------------|
| `src/enterprise-business-rules/entities/RewriteRule/` | `docs/design/src/enterprise-business-rules/entities/RewriteRule/` |
| `src/interface-adapters/mappers/RewriteRuleMapper.ts` | `docs/design/src/interface-adapters/mappers/RewriteRuleMapper/` |
| `src/frameworks-and-drivers/browser/Tabs.ts` | `docs/design/src/frameworks-and-drivers/browser/Tabs/` |

### ディレクトリ構造

```text
docs/design/src/
├── enterprise-business-rules/
│   └── entities/
│       └── RewriteRule/
│           ├── withActive.md
│           └── matchesUrl.md
├── application-business-rules/
│   └── interactors/
│       └── ToggleRuleActiveInteractor/
│           └── execute.md
├── interface-adapters/
│   └── mappers/
│       └── RewriteRuleMapper/
│           ├── toEntity.md
│           └── toDto.md
└── frameworks-and-drivers/
    └── browser/
        └── Tabs/
            ├── constructor.md
            └── filterByRule.md
```

### 設計意図

- **srcと1:1対応**: ソースコードと同じ構造でテスト戦略書を配置
- **レイヤー意識**: Clean Architectureの4層構造を反映
- **共通モジュール対応**: 特定機能に依存しない配置で、機能横断的なモジュールも自然に配置可能

## 必須セクション

| セクション | 必須 | 説明 |
|-----------|------|------|
| 目的 | ○ | メソッドの責務を簡潔に記述 |
| テスト分類 | ○ | テストケースを観点ごとに分類 |
| 網羅性チェック | ○ | 過不足を確認するチェックリスト |
| テストファイル構成 | ○ | 実際のテストファイルとの対応 |
| モック戦略 | ○ | モック対象と理由、モックファイル構成 |

### 目的セクションの完全性

**適用対象**: 複数のState・メソッドを公開するモジュール（カスタムフック、UIコンポーネント、サービスクラス等）

「目的」セクションでモジュールが提供するState・メソッドを列挙する場合、**実装で公開されているすべてのState・メソッドを漏れなく記載すること**。

**規約**:
- 実装コードのexport/returnを確認し、公開されるすべてのAPI（State値、メソッド）を列挙する
- 一部のAPIのみを記載して他を省略しない
- 各メソッドの責務が明確な場合、括弧内で補足説明を加える

**適用例**:

| モジュール種別 | 適用 | 理由 |
|---------------|------|------|
| カスタムフック | ○ | 複数のState・メソッドを返す |
| UIコンポーネント | ○ | 複数のprops/コールバックを受け取る |
| サービスクラス | ○ | 複数のpublicメソッドを提供 |
| Entity/DTO | △ | 単一メソッドの場合は省略可 |
| Mapper | △ | 単一メソッドの場合は省略可 |

**例（カスタムフックの場合）**:

```markdown
## 目的

[機能]に関するState管理とロジックを提供するカスタムフック。
`[stateA]`, `[stateB]`, `[stateC]` のState管理と、`[methodA]`, `[methodB]`, `[methodC]`, `[methodD]` のロジックを提供する（[補足説明]）。
```

**チェックポイント**:
- [ ] 実装で返されるすべてのState値が記載されているか
- [ ] 実装で返されるすべてのメソッドが記載されているか
- [ ] テスト分類に対応するメソッドと目的セクションの記載が一致しているか

## テスト分類の観点

以下の観点でテストケースを分類する:

| 観点 | 説明 | 例 |
|------|------|-----|
| 状態変更（同値分割） | 入力値のパターンを網羅 | true→false, false→true |
| 境界値 | 境界条件のテスト | 空文字列、最大長 |
| 不変条件 | 変わらないべきものの確認 | イミュータブル性 |
| 副作用の範囲 | 変更対象以外が影響を受けないこと | 他プロパティ維持 |
| 異常系 | エラーケース | null入力、不正な型 |

## 機能要件トレーサビリティ（結合テスト戦略書で必須）

結合テスト戦略書では、機能要件ドキュメント（00-overview.md等）に記載された全ての要件がテストケースとしてカバーされていることを明示する。

### 目的

- 機能要件とテストケースの1対1対応を保証する
- テストケースの漏れを防止する
- レビュー時の確認を容易にする

### 必須セクション: 機能要件トレーサビリティ

結合テスト戦略書には以下のセクションを必ず含める：

```markdown
## 機能要件トレーサビリティ

### エラーハンドリング要件

| 機能要件（00-overview.md） | UIの状態 | テストケース | テストファイル |
|---------------------------|---------|-------------|---------------|
| ルール取得失敗 | 変更なし | 存在しないIDでエラー | error-cases.test.ts |
| ルール更新失敗 | 変更なし | DB更新エラー時 | error-cases.test.ts |
| タブリロード失敗 | トグル後の状態 | TabsGatewayエラー時 | partial-success.test.ts |

### 部分的成功の取り扱い

| シナリオ | 期待動作 | テストケース | テストファイル |
|---------|---------|-------------|---------------|
| ルール更新成功 + タブリロード失敗 | UIは更新、エラー通知表示 | ... | partial-success.test.ts |
```

### チェックリスト

結合テスト戦略書のレビュー時に以下を確認：

- [ ] 00-overview.md のエラーハンドリング表の全ケースがテストされているか
- [ ] 「部分的成功」などの特殊ケースがテストされているか
- [ ] 各テストケースが機能要件のどの項目に対応するか明記されているか

## テンプレート

```markdown
# [ClassName].[methodName]() テスト戦略

## 目的

[メソッドの責務を1-2文で記述]

## テスト分類

### 1. [観点名]

[この観点でテストする理由]

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| ... | ... | ... |

**対応テスト**: `[filename].test.ts`

### 2. [観点名]

...

## 網羅性チェック

- [x] [確認項目1]
- [x] [確認項目2]
- [ ] [不要な項目] → [不要な理由]

## テストファイル構成

\`\`\`
tests/unit/[path]/[methodName]/
├── normal-cases.test.ts       # [説明]
├── ...
\`\`\`

## モック戦略

[モックを使用する理由と対象を記述]

### 使用するモック

> **注意**: 新規モック作成前に既存モックを確認すること。詳細は [mock-file-placement.md](/docs/coding-standards/tests/common-rule/mock-file-placement.md) を参照。

| 依存関係 | モック理由 | モック対応 |
| -------- | ---------- | ---------- |
| [インターフェース名] | [モックする理由] | `[パス]` / vi.fn()直接 / 不要 |

### モックファイル構成

\`\`\`
tests/unit/[path]/[methodName]/
└── mocks/
    └── createMock[ClassName].ts    # モックファクトリ（既存モックがない場合のみ新規作成）
\`\`\`

### テストヘルパー

テストヘルパークラスを使用する場合、**実装コードは記載せず、ファイルパスの参照のみ**とする。

\`\`\`markdown
### テストヘルパー（例）

共通のセットアップ・クリーンアップロジックを集約したテストヘルパー:

**参照**: \`tests/unit/[path]/test-helpers.tsx\`
\`\`\`

**理由**:
- テストヘルパーの実装詳細はテストコードに属する
- ドキュメントとコードの二重管理を避ける
- 実装の変更がドキュメントの更新漏れを招くことを防ぐ
```

## 記述ルール

### テスト分類表

各テストケースに「根拠」を記載する:
- なぜこのテストケースが必要か
- どのようなバグを防ぐか

```markdown
| 分類 | テストケース | 根拠 |
|------|-------------|------|
| true → false | isActive=trueをfalseに変更 | 基本パターン（有効→無効） |
```

#### 依存関係の呼び出し検証表（UseCase/Interactor向け）

UseCase や Interactor など複数の依存関係を持つクラスでは、「依存関係の呼び出し」観点のテスト分類表に **実装状況** 列を追加することを推奨する:

```markdown
| 分類 | テストケース | 根拠 | 実装状況 |
|------|-------------|------|---------|
| Repository.update | 生成されたルールで呼び出し | 永続化の確認 | ✓ 実装済み |
| TabsService.queryTabs | 空オブジェクトで呼び出し | 全タブ取得 | 未実装（モック設定のみ） |
```

**理由**:
- 複数の依存関係がある場合、どのメソッド呼び出しが実際にテストされているかが曖昧になりやすい
- 実装状況を明記することで、網羅性チェックとの整合性を保ちやすくなる

### 網羅性チェック

不要な項目も明示的に記載し、理由を添える:

```markdown
- [x] 全入力パターン（4パターン）
- [ ] 異常系 → 不要（引数がbooleanのため型で制約）
```

#### 網羅性チェックの検証ルール（重要）

項目を `[x]`（実装済み）としてマークする前に、**テストコードに明示的なアサーション（`expect()`）が存在することを確認**すること。

**よくある誤り**:
- モックの設定（`vi.mocked(...).mockResolvedValue(...)`）があるだけで「テスト済み」と判断する
- モックが呼び出されることを前提としているが、実際に `expect(...).toHaveBeenCalled()` 等のアサーションがない

**正しい判断基準**:

| 状況 | チェック状態 |
|------|-------------|
| `expect(mock.method).toHaveBeenCalledWith(...)` がある | `[x]` 可 |
| モック設定のみ、アサーションなし | `[ ]` のまま |
| テストが存在するが、該当項目のアサーションがない | `[ ]` のまま |

**既存テストへのテスト戦略書追加時の注意**:

既存テストに対してテスト戦略書を後から作成する場合、テストコードの `expect()` 文を一つずつ確認し、実際に検証されている項目のみを `[x]` とすること。「このモックを使っているから検証されているはず」という推測でチェックしないこと。

### テストファイルとの対応

各テスト分類に対応するテストファイルを明記する:

```markdown
**対応テスト**: `normal-cases.test.ts`
```

### ファイルパスの記載

テスト戦略書でファイルパスを記載する際:

- `src/` および `tests/` からの相対パスを使用する
- `host-frontend-root/frontend-src-root/` は省略する
- これはテストコードのimportパスと一致させるため

```text
# ✅ 正しい記載
tests/unit/interface-adapters/mappers/RewriteRuleMapper/delete/
└── normal-cases.test.ts

# ❌ 誤った記載（冗長）
host-frontend-root/frontend-src-root/tests/unit/interface-adapters/mappers/RewriteRuleMapper/delete/
└── normal-cases.test.ts
```

### テンプレート内のマークダウンリンク

テンプレート（本ファイル）内で他ドキュメントへのリンクを記載する際は、**リポジトリルートからの絶対パス**を使用する。

**理由**: テンプレートは様々な階層のテスト戦略書にコピーして使用されるため、相対パス（`../../`）は配置場所によって機能しなくなる。

```markdown
# ✅ 正しい記載（ルート絶対パス）
[mock-file-placement.md](/docs/coding-standards/tests/common-rule/mock-file-placement.md)

# ❌ 誤った記載（相対パス - 階層依存）
[mock-file-placement.md](../../docs/coding-standards/tests/common-rule/mock-file-placement.md)
```

> **注意**: この規約はテンプレートファイル（docs-rules/配下）に適用される。実際のテスト戦略書（docs/design/配下）では相対パスを使用してもよい。

### テーブル列名の意味的一貫性

テーブルの列名は、その列に入る値の種類を正確に表すこと。

**規約**:
- 列名が示す意味と、実際に記載する値の種類が一致すること
- 複数の異なる種類の情報を1つの列に混在させる場合、列名は汎用的にすること

**例: 「モック対応」列**

「モック対応」列には以下のいずれかを記載する:
- ファイルパス: `tests/unit/.../mocks/`
- 直接モック: `vi.fn()直接`
- 不要: `不要`

```markdown
| 依存関係 | モック理由 | モック対応 |
| -------- | ---------- | ---------- |
| IRepository | DB層分離 | `tests/unit/.../mocks/` |
| onClose | コールバック検証 | vi.fn()直接 |
| なし | - | 不要 |
```

## コードとの関係

> **参照**: [jsdoc-rule.md](/docs/coding-standards/tests/common-rule/jsdoc-rule.md)

テスト戦略書はテストコードのJSDocを補完する:

| JSDoc | テスト戦略書 |
|-------|-------------|
| 何をテストするか | なぜテストするか |
| 個別のテストケース説明 | テストケースの分類と根拠 |
| コード内のドキュメント | 設計意図と網羅性の記録 |

### 優先順位
- テストコードが正、戦略書は設計意図の記録
- JSDocとテスト戦略書の内容が矛盾する場合、テストコード側を信頼

### 一貫性の維持
- テスト戦略書の「テスト分類」表とJSDocの番号付きリストが対応すること
- テストケースを追加・削除した場合、JSDocと戦略書の両方を更新すること

## テスト戦略書と実装の整合性

### 規約

- テスト戦略書に記載したすべてのテストケースを実装すること
- テスト実装時は戦略書をチェックリストとして使用すること
- 実装しないテストケースは戦略書に記載しないこと

### 実装時のチェックリスト

テスト実装完了時に以下を確認:

- [ ] 戦略書の「テスト分類」表のすべてのケースが実装されているか
- [ ] 戦略書の「テストファイル構成」と実際のファイル構成が一致しているか
- [ ] 戦略書の「モックファイル構成」/「ヘルパーファイル」と実際の構成が一致しているか
- [ ] 実装を省略したケースがある場合、戦略書から削除または理由を記載したか

**注意**: 実装中にファイル名や配置を変更した場合、必ず戦略書も更新すること。戦略書は設計時の意図を記録するだけでなく、実装後の実態を正確に反映する必要がある。

### 不整合が発生した場合

| 状況 | 対応 |
|------|------|
| 戦略書にあるがテスト未実装 | テストを実装する、または戦略書から削除 |
| テストがあるが戦略書に未記載 | 戦略書にケースを追加 |
| 実装中に不要と判断したケース | 戦略書から削除し、理由を網羅性チェックに記載 |

## 適用待ちの箇所

### 旧配置ルールで作成されたテスト戦略書

本規約の配置ルール変更（`docs/design/pages/.../05-test-strategy/` → `docs/design/src/`）により、以下のファイルが新しい規約に適合していない:

| 現在の配置 | 新規約での配置 |
|-----------|---------------|
| `docs/design/pages/rule-list/features/toggle-rule-active/05-test-strategy/RewriteRule-withActive.md` | `docs/design/src/enterprise-business-rules/entities/RewriteRule/withActive.md` |
| `docs/design/pages/rule-list/features/toggle-rule-active/05-test-strategy/Tabs-constructor.md` | `docs/design/src/frameworks-and-drivers/browser/Tabs/constructor.md` |
| `docs/design/pages/rule-list/features/toggle-rule-active/05-test-strategy/Tabs-filterByRule.md` | `docs/design/src/frameworks-and-drivers/browser/Tabs/filterByRule.md` |
| `docs/design/pages/rule-list/features/toggle-rule-active/05-test-strategy/ToggleRuleActiveInputData-constructor.md` | `docs/design/src/application-business-rules/dto/input/ToggleRuleActiveInputData/constructor.md` |
| `docs/design/pages/rule-list/features/toggle-rule-active/05-test-strategy/ToggleRuleActiveOutputData-constructor.md` | `docs/design/src/application-business-rules/dto/output/ToggleRuleActiveOutputData/constructor.md` |
| `docs/design/pages/rule-list/features/url-pattern-matching/05-test-strategy/RewriteRule-matchesUrl.md` | `docs/design/src/enterprise-business-rules/entities/RewriteRule/matchesUrl.md` |

### 対応方針

- **新規作成**: 新しい規約に従う（必須）
- **既存修正**: 別タスクとして対応（本ユーザーストーリーのスコープ外）

