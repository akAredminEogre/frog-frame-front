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
| 開発戦略 | ○ | 1PR単位のタスクチェックリスト |
| 受け入れ条件 | ○ | acceptance-criteria.mdへのリンク |

#### 現状分析

設計ドキュメント（理論的設計）と現在の実装の差分を分析し、開発戦略の判断材料とする。

##### 差分の分類

設計と実装の差分を以下の3分類で整理する:

| 分類 | 条件 | 対応方針 |
|------|------|----------|
| A | 修正不要 & 配置適切 | そのまま利用 |
| B | **修正必須** | 先に理論的配置へ移行 → 修正 |
| C | 修正不要 & 配置不適切 | 機能開発後にリファクタリング（または対応しない） |

**ポイント**: 分類Bのファイルのみ前提タスクとして移行を行う

##### 分析手順

- **03-directory-structure.md（理論）と現在のディレクトリ構造を比較**
- 各ファイルを上記3分類に振り分ける
- 分類Bのファイルについて、影響ファイル数を調査
- 影響を受けるファイル・モジュールをClean Architectureの層ごとに列挙
- 新規作成ファイルは分析対象外（既存ファイルの変更のみ分析）

**注意**: Clean Architecture遵守のためのディレクトリ移動は影響範囲が広くなるため、特に注意して分析する

記述例
```markdown
### 差分分類

| ファイル | 現在位置 | 理論位置 | 修正 | 分類 |
|---------|---------|---------|------|------|
| RewriteRule.ts | domain/entities/ | enterprise-business-rules/entities/ | 必須 | B |
| IRewriteRuleRepository.ts | application/ports/ | interface-adapters/gateways/ | 必須 | B |
| DexieDatabase.ts | infrastructure/persistence/ | frameworks-and-drivers/persistence/ | 不要 | C |

### 分類B: 移行必須ファイルの影響分析

#### RewriteRule.ts（51ファイル影響）
- 変更内容: enterprise-business-rules/entities/へ移動 + withActive()追加
- 影響モジュール:
  - application-business-rules/ (5ファイル)
  - interface-adapters/ (8ファイル)
  - frameworks-and-drivers/ (11ファイル)
  - tests/ (27ファイル)
```

#### 開発戦略

現状分析の結果とユーザーストーリー達成に必要なタスクを、1PR単位でチェックリスト形式で記載:

- 各タスク = 1PR = 1チェックボックス（`- [ ]`）
- **分類Bのファイル移行**を前提タスクとして先に記載
- ユーザーストーリー達成に必要なタスクを後に記載
- タスクは依存関係順に並べる
- **分類Cのファイルは移行しない**（機能開発後のリファクタリング or 対応しない）

**完了条件**: ユーザーストーリー完了時に、関連するファイル（分類A, B）はClean Architectureを遵守していること
- 分類Cのファイルは問わない

記述例
```markdown
## 開発戦略

### 前提タスク（分類B: 移行必須）

- [ ] RewriteRule.ts を enterprise-business-rules/entities/ へ移行（51ファイル）
- [ ] IRewriteRuleRepository.ts を interface-adapters/gateways/ へ移行（14ファイル）

### ユーザーストーリー達成タスク

- [ ] トグルスイッチUIコンポーネントを追加
- [ ] トグル処理UseCaseを実装
- [ ] RuleTableRowにトグルUIを統合

### 対応しない（分類C）

- DexieDatabase.ts - 修正不要のため現行位置のまま
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
