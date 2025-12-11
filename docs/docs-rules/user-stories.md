# user-stories ドキュメントルール

## ディレクトリ構造

```
docs/user-stories/
├── user-story-{番号}/
│   ├── README.md                 # 必須: ストーリー概要
│   └── acceptance-criteria.md    # 必須: 受け入れ条件
```

## 命名規則

### ディレクトリ名

- 形式: `user-story-{3桁番号}`
- 番号: 001から連番
- 例: `user-story-001`, `user-story-002`

## 必須ファイル

### README.md

以下のセクションを含む:

| セクション | 必須 | 説明 |
|-----------|------|------|
| ストーリー | ○ | 引用形式でユーザーストーリーを記載 |
| 概要 | ○ | 機能の説明 |
| 設計ドキュメント | ○ | 関連する設計ドキュメントへのリンク |
| 現状分析 | ○ | 設計目標と現在の実装の差分分析 |
| 開発戦略 | ○ | 採用するパターン（Parallel Changeなど） |
| 受け入れ条件 | ○ | acceptance-criteria.mdへのリンク |

#### 現状分析

設計目標と現在の実装の差分を分析し、開発戦略の判断材料とする:

- 設計ドキュメントの目標と現在の実装を比較
- **設計ドキュメントのディレクトリ構造と現在の構造を比較**
  - 異なる場合、ディレクトリ移動自体を変更内容として記載
- 変更が必要な箇所を特定
- 影響を受けるファイル・モジュールをClean Architectureの層ごとに列挙
- 各層内で変更の影響を受けるモジュールを再帰的に列挙
- ストーリー着手前に必要な前提変更があればフラグを立てる
- 新規作成ファイルは分析対象外（既存ファイルの変更のみ分析）

**注意**: Clean Architecture遵守のためのディレクトリ移動は影響範囲が広くなるため、特に注意して分析する

記述例
```markdown

### enterprise-business-rules/ (第1層)
- `src/domain/entities/RewriteRule/RewriteRule.ts`
  - 変更内容
    - isActive プロパティ追加
    - src/enterprise-business-rules/entities/RewriteRule/RewriteRule.tsへの移動
  - 影響モジュール
    - application-business-rules/
      - `src/application-business-rules/services/RewriteRuleService/RewriteRuleService.ts`
    - interface-adapters/
      - `src/interface-adapters/controllers/RewriteRuleController/RewriteRuleController.ts`
      - `src/interface-adapters/gateways/RewriteRuleRepository/RewriteRuleRepository.ts
    - frameworks-and-drivers/
      - `src/frameworks-and-drivers/database/RewriteRuleModel/RewriteRuleModel.ts
      - .....
```

### acceptance-criteria.md

ユーザーストーリーを満たすかどうかを検証する条件を記載:

- 各条件はチェックリスト形式（`- [ ]`）で記載
- AC番号は連番（AC-1, AC-2, ...）
- 2つのカテゴリに分類する

| カテゴリ | 説明 | 記述スタイル |
|---------|------|-------------|
| ユーザーストーリー要件 | ユーザー視点での機能要件 | ドメイン用語で記述 |
| 技術要件 | 実装上必要な技術的条件 | 実装詳細を含めてよい |

```markdown
# 受け入れ条件

## ユーザーストーリー要件

- [ ] AC-1: トグル操作でルールの有効/無効が切り替わる
- [ ] AC-2: 変更が保存される

## 技術要件

- [ ] AC-3: 該当URLのタブがリロードされる
```

## 関連ドキュメント

- 設計ドキュメント: `docs/design/pages/{画面名}/features/{機能名}/`
- ADR: `docs/adr/`
- 基本ルール: [docs-rules.md](../docs-rules.md)
