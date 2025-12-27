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

設計と実装の差分を以下の5分類で整理する:

| 分類 | 新規作成 | 既存 | 配置適切 | ロジック変更 | 対応方針 |
| ------|----------|------|----------|--------------|----------|
| A | ○ | - | - | - | 新規作成する |
| B | - | ○ | - | - | 機能開発後にリファクタリング的に配置変更(または対応しない) |
| C | - | ○ | - | ○ | 先に理論的配置へ移行 → 修正 |
| D | - | ○ | ○ | - | 対応不要 |
| E | - | ○ | ○ | ○ | 修正のみ行う |




**ポイント**: 分類Cのファイルのみ前提タスクとして移行を行う

##### 分析手順

- **03-directory-structure.md（理論）と現在のディレクトリ構造を比較**
- 各ファイルを上記5分類に振り分ける
- 分類Cのファイルについて、影響ファイル数を調査
- 影響を受けるファイル・モジュールをClean Architectureの層ごとに列挙
- 新規作成ファイルは分析対象外（既存ファイルの変更のみ分析）

**注意**: Clean Architecture遵守のためのディレクトリ移動は影響範囲が広くなるため、特に注意して分析する

記述例
```markdown
### 差分分類

| ファイル | 現在位置 | 理論位置 | 修正 | 分類 |
|---------|---------|---------|------|------|
| RewriteRule.ts | domain/entities/ | enterprise-business-rules/entities/ | 必須 | C |
| IRewriteRuleRepository.ts | application/ports/ | interface-adapters/gateways/ | 必須 | B |
| DexieDatabase.ts | infrastructure/persistence/ | frameworks-and-drivers/persistence/ | 不要 | C |

### 分類C: 移行必須ファイルの影響分析

#### RewriteRule.ts（51ファイル影響）
- 変更内容: enterprise-business-rules/entities/へ移動 + withActive()追加
- 影響モジュール:
  - application-business-rules/ (5ファイル)
  - interface-adapters/ (8ファイル)
  - frameworks-and-drivers/ (11ファイル)
  - tests/ (27ファイル)
```

#### 開発戦略

##### 開発パターン: Parallel Change + Skeleton Pattern

Clean Architectureに従った機能追加では、既存コードを壊さずに新機能を追加するため、
**Parallel Change**パターンと**Skeleton**パターンを組み合わせて採用する。

**Phase構成**

| Phase | 内容 | 説明 | テスト |
|-------|------|------|--------|
| 前提タスク | 分類Cファイルのディレクトリ移動 | ロジック変更なし、配置のみ | - |
| Phase 1 | ディレクトリ構造の準備 | 新ディレクトリ作成（空のまま） | - |
| Phase 2 | Skeleton作成 | インターフェース・スケルトンクラス（コンパイル通る最小実装） | 結合・E2Eテスト戦略書作成 |
| Phase 3 | 実装 | スケルトンにロジック追加 | 単体テスト戦略書作成・単体テスト実装 |
| Phase 4 | 統合 | 新旧並行稼働、UI統合 | 結合テスト・E2Eテスト実装 |
| Phase 5 | 旧コード削除 | 通常は別ユーザーストーリーで対応 | - |

**各層のPhase 2（Skeleton）記述ガイド**

- **第1層 (enterprise-business-rules)**: エンティティにメソッドスケルトン追加
- **第2層 (application-business-rules)**: Input/Output Port、Gateway Interface、DTO、Interactorスケルトン
- **第3層 (interface-adapters)**: Controller、Presenter、Factory、Mapperスケルトン
- **第4層 (frameworks-and-drivers)**: UIコンポーネント、Gateway実装、MessagingService、DI登録

**Skeletonの定義**

- コンパイルが通る最小実装
- 実際のロジックは空または `throw new Error('Not implemented')` で仮実装
- インターフェースは完全に定義する（メソッドシグネチャ、型定義）

##### テスト戦略

各Phaseでのテスト関連タスク:

**Phase 2: 結合・E2Eテスト戦略書の作成**

Skeleton作成と並行して、以下のテスト戦略書を設計ドキュメントに追加する:

| 戦略書 | 配置先 | 参照ルール |
|-------|--------|-----------|
| 結合テスト戦略書 | `docs/design/pages/{page}/features/{feature}/integration-test-strategy.md` | [06-integration-test-strategy.md](./design/06-integration-test-strategy.md) |
| E2Eテスト戦略書 | `docs/design/pages/{page}/features/{feature}/e2e-test-strategy.md` | [07-e2e-test-strategy.md](./design/07-e2e-test-strategy.md) |

**Phase 3: 実装・単体テスト戦略書・単体テスト**

各タスクは「実装」と「テスト」を1行にまとめて記載する:

```markdown
- [ ] {コンポーネント名} の実装、テスト戦略書・単体テスト
```

- 実装とテストを分離せず、1タスク = 1コンポーネントの完成とする
- 単体テスト戦略書の配置先: `docs/design/src/{layer}/.../{methodName}.md`
- 参照: [05-test-strategy.md](./design/05-test-strategy.md)
- 各タスク完了後にテストがパスすることを確認

**Phase 4: 結合テスト・E2Eテストの実装**

- UI統合後、結合テスト戦略書に基づいてテストを実装
- E2Eテスト戦略書に基づいて実ブラウザでのテストを実装
- `make testcheck` がパスすることを確認

##### タスク記載ルール

現状分析の結果とユーザーストーリー達成に必要なタスクを、1PR単位でチェックリスト形式で記載:

- 各タスク = 1PR = 1チェックボックス（`- [ ]`）
- **分類Cのファイル移行**を前提タスクとして先に記載
  - ファイルのディレクトリ移動は、それだけで1ファイルにつき1PRとし、修正は別PRで行う
    - 修正を同時に行うと、影響範囲の特定が困難になるため
    - また関連するファイルだからといって、1PR内で複数ファイルを移動しないこと
    - 各PRごとに`make testcheck`が通ることを確認する。
- ユーザーストーリー達成に必要なタスクを後に記載
- タスクは依存関係順に並べる
- **分類Bのファイルは移行しない**（機能開発後のリファクタリング or 対応しない）
- PR番号は付けない
  - PRは実際の開発時に作成するため
  - また状況によりPRの増減、分割、統合が発生するため

**完了条件**: ユーザーストーリー完了時に、関連するファイル（分類A, C, E）はClean Architectureを遵守していること
- 分類Bのファイルは問わない

**タスク網羅性チェック**: 開発戦略作成後、以下を確認すること:
1. 差分分類で「修正:必須」としたすべてのファイルに対応するタスクがあるか
2. 01-class-design.md で新規作成とした全クラスに対応するタスクがあるか
3. 分類Cファイルの移動タスク（前提タスク）と修正タスク（達成タスク）が両方あるか

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

### network-diagram.puml (任意)
README.mdの開発戦略セクションのタスクをもとに作成。
適宜更新する。

参考資料のため厳密なルールはなし。

## 関連ドキュメント

- 設計ドキュメント: `docs/design/pages/{画面名}/features/{機能名}/`
- ADR: `docs/adr/`
- 基本ルール: [docs-rules.md](../docs-rules.md)
