# 05-test-strategy.md ルール

テストコードの設計意図と網羅性を可視化するドキュメント。

## 目的

- テストケースの「なぜ必要か」を明示する
- テストの冗長・不足を判断する基準を提供する
- AIが生成したテストのレビューを容易にする
- 複数ファイルにまたがるテストの全体像を俯瞰する

## 配置

テスト戦略書は **ソースコードのディレクトリ構造をミラーリング** して配置する（Clean Architecture準拠）。

```
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

```
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

## テスト分類の観点

以下の観点でテストケースを分類する:

| 観点 | 説明 | 例 |
|------|------|-----|
| 状態変更（同値分割） | 入力値のパターンを網羅 | true→false, false→true |
| 境界値 | 境界条件のテスト | 空文字列、最大長 |
| 不変条件 | 変わらないべきものの確認 | イミュータブル性 |
| 副作用の範囲 | 変更対象以外が影響を受けないこと | 他プロパティ維持 |
| 異常系 | エラーケース | null入力、不正な型 |

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

> **重要**: モック作成は [basic-rule.md](../../coding-standards/tests/unit/common-rule/basic-rule.md) の「モック作成の分離ルール」に従うこと。
> - モック作成は、別のクラスファイルに切り出し、それをインポートして使用すること
> - テストコード内で直接モックを定義しないこと
> - モックファクトリは `createMock[ClassName].ts` の形式で命名

### モック対象

- [モック対象1]: [モックする理由]
- [モック対象2]: [モックする理由]

### モックファイル構成

\`\`\`
tests/unit/[path]/[methodName]/
└── mocks/
    └── createMock[ClassName].ts    # モックファクトリ
\`\`\`
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

### 網羅性チェック

不要な項目も明示的に記載し、理由を添える:

```markdown
- [x] 全入力パターン（4パターン）
- [ ] 異常系 → 不要（引数がbooleanのため型で制約）
```

### テストファイルとの対応

各テスト分類に対応するテストファイルを明記する:

```markdown
**対応テスト**: `normal-cases.test.ts`
```

## コードとの関係

> **参照**: [JSDoc-rule.md](../../coding-standards/tests/unit/common-rule/JSDoc-rule.md)

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

