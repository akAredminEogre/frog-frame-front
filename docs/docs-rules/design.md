# design ドキュメントルール

## ディレクトリ構造

```
docs/design/
├── pages/                              # 画面単位の設計
│   └── {画面名}/                       # 例: rule-list, edit, popup
│       ├── ui.md                       # 必須: UI設計
│       └── features/                   # 機能単位の設計
│           └── {機能名}/               # 例: toggle-rule-active
│               ├── 00-overview.md      # 必須: 概要
│               ├── 01-directory-structure.md  # 必須: ディレクトリ構成
│               └── 02-class-design.md  # 必須: クラス設計
└── clean-architecture/                 # アーキテクチャ共通設計（参考用）
    └── domain/
        └── entities.md
```

## 命名規則

### ディレクトリ名

- 画面名: kebab-case（小文字、ハイフン区切り）
- 機能名: kebab-case
- 例: `rule-list`, `toggle-rule-active`, `batch-delete`

### ファイル名

- 番号プレフィックス: 2桁（`00-`, `01-`, `02-`）
- 名前: kebab-case
- 拡張子: `.md`

## 必須ファイル

### ui.md（画面単位）

画面全体のUI設計を記載:

| セクション | 必須 | 説明 |
|-----------|------|------|
| レイアウト | ○ | 画面構成の概要 |
| コンポーネント一覧 | ○ | 使用するコンポーネント表 |
| 状態遷移 | △ | 画面の状態遷移（必要な場合） |

### 00-overview.md（機能単位）

機能概要を記載:

| セクション | 必須 | 説明 |
|-----------|------|------|
| 機能概要 | ○ | 機能の説明（1-2行） |
| ユーザーストーリー | ○ | 引用形式でストーリーを記載 |
| トリガー | ○ | アクター、画面、トリガー条件の表 |
| 機能要件 | ○ | 要件の箇条書き |
| 既存実装の確認 | △ | 既存コードの確認結果 |
| アーキテクチャ | ○ | 採用パターンとADRへのリンク |
| 開発戦略 | ○ | Parallel Changeなどの戦略 |
| 関連ドキュメント | ○ | 関連ドキュメントへのリンク |

### 01-directory-structure.md（機能単位）

ディレクトリ構成を記載:

| セクション | 必須 | 説明 |
|-----------|------|------|
| 対象ディレクトリ | ○ | 変更対象のディレクトリ一覧 |
| 第1層〜第4層 | ○ | 各層のディレクトリツリー |
| 依存関係図 | ○ | 層間の依存方向を示す図 |
| 12要素との対応 | ○ | Clean Architecture 12要素との対応表 |

### 02-class-design.md（機能単位）

クラス設計を記載:

| セクション | 必須 | 説明 |
|-----------|------|------|
| 制御フロー | ○ | 処理の流れを示す図 |
| 各クラスの詳細 | ○ | クラスごとのコード例 |
| クラス図 | ○ | クラス間の関係を示す図 |

## アーキテクチャ

Clean Architecture with Presenter パターンを採用:

- **ADR**: `docs/adr/001-clean-architecture-with-presenter-pattern.md`

### 4層構造

| 層 | ディレクトリ | 役割 |
|----|-------------|------|
| 第1層 | `enterprise-business-rules/` | Entity, Value Object |
| 第2層 | `application-business-rules/` | UseCase, Port, DTO |
| 第3層 | `interface-adapters/` | Controller, Presenter, Gateway(IF) |
| 第4層 | `frameworks-and-drivers/` | UI, DB, Messaging, DI |

### 第1層の構成

技術駆動パッケージングを採用:

```
enterprise-business-rules/
├── entities/           # Entity
├── value-objects/      # Value Object
└── constants/          # 定数
```

### Gateway分割

```
interface-adapters/gateways/
├── persistence/        # DB関連のGateway Interface
└── messaging/          # Chrome messaging関連のGateway Interface

frameworks-and-drivers/
├── persistence/        # DB Gateway 実装
└── messaging/          # messaging Gateway 実装
```

## コード例の記載

- 設計ドキュメントではコード例を記載可能
- import文はADR確定のパス構造に従う
- スコープ外の機能は記載しない

### importパスの例

```typescript
// Entity
import { RewriteRule } from 'src/enterprise-business-rules/entities/RewriteRule/RewriteRule';

// Gateway Interface
import { IRewriteRuleRepository } from 'src/interface-adapters/gateways/persistence/IRewriteRuleRepository';
import { ITabReloadGateway } from 'src/interface-adapters/gateways/messaging/ITabReloadGateway';
```

## 図の記法

- ASCII Art を使用
- UMLライクな表記を推奨
- 矢印の意味を凡例で示す

例:
```
矢印の方向 = 依存の方向（外→内のみ許可）
```

## 関連ドキュメント

- ユーザーストーリー: `docs/user-stories/`
- ADR: `docs/adr/`
- 基本ルール: [docs-rules.md](../docs-rules.md)
- ユーザーストーリールール: [user-stories.md](./user-stories.md)
