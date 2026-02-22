# design ドキュメントルール

## ディレクトリ構造

```text
docs/design/
├── pages/                              # 画面/トリガー単位の設計
│   └── {画面名 or トリガー名}/         # 例: rule-list, edit, tab-reload
│       ├── ui.md                       # 必須: UI設計（画面の場合）
│       └── features/                   # 機能単位の設計
│           └── {機能名}/               # 例: toggle-rule-active
│               ├── 00-overview.md      # 必須: 概要
│               ├── 01-class-design.md  # 必須: クラス設計（理論）
│               ├── 02-sequence.puml    # 必須: シーケンス図
│               ├── 03-directory-structure.md  # 必須: ディレクトリ構成（理論）
│               └── 04-arrow-diagram.puml # 必須: アローダイアグラム（依存関係・データフロー図）
└── clean-architecture/                 # アーキテクチャ共通設計（参考用）
    └── domain/
        └── entities.md
```

## 命名規則

### ディレクトリ名

- `pages/` 配下のディレクトリ名（`features/` の親）: **画面名**または**トリガー名**
  - 画面名: `rule-list`, `edit`, `popup` など
  - トリガー名: `tab-reload`, `url-change` など（画面に紐づかない機能の場合）
- 機能名: kebab-case（小文字、ハイフン区切り）
- 例: `toggle-rule-active`, `batch-delete`

### ファイル名

- 番号プレフィックス: 2桁（`00-`, `01-`, `02-`, `03-`）
- 名前: kebab-case
- 拡張子: `.md` または `.puml`（シーケンス図）

## 必須ファイルのルール

各ファイルの詳細ルールは以下を参照:

| ファイル | 必須/オプション | ルール |
|---------|----------------|--------|
| ui.md（画面単位） | **必須** | [design/ui.md](./design/ui.md) |
| 00-overview.md（機能単位） | **必須** | [design/00-overview.md](./design/00-overview.md) |
| 01-class-design.md（機能単位） | **必須** | [design/01-class-design.md](./design/01-class-design.md) |
| 02-sequence.puml（機能単位） | **必須** | [design/02-sequence.md](./design/02-sequence.md) |
| 03-directory-structure.md（機能単位） | **必須** | [design/03-directory-structure.md](./design/03-directory-structure.md) |
| アローダイアグラム（機能単位） | **必須** | [design/04-arrow-diagram.md](./design/04-arrow-diagram.md) |

> `03-directory-structure.md` とアローダイアグラムは**必須**。

### テスト戦略書

| ファイル | ルール |
|---------|--------|
| 結合テスト戦略書 | [design/06-integration-test-strategy.md](./design/06-integration-test-strategy.md) |

## 図の記法

- ASCII Art を使用
- UMLライクな表記を推奨
- 矢印の意味を凡例で示す

例:
```text
矢印の方向 = 依存の方向（外→内のみ許可）
```

## 関連ドキュメント

- 開発フロー: [docs/development-flow/new-feature/index.md](../docs/development-flow/new-feature/index.md)
- ユーザーストーリー: `docs/user-stories/`
- ADR: `docs/adr/`
- 基本ルール: [ドキュメント共通ルール](./common/index.md)
- ユーザーストーリールール: [user-stories.md](./user-stories.md)
