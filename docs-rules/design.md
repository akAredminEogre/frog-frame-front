# design ドキュメントルール

## 設計方針

**理論的設計を先行させ、E2E 1パターン実装に直結させる**

設計ドキュメントは Clean Architecture の原則に基づく「理論的なあるべき姿」を記述する。
設計完了後は**スケルトン実装フェーズを経ずに**、E2E 1パターンが通る実装に直接進む。

```text
設計ドキュメント（理論）  →  E2E 1パターン実装  →  ユニットテスト戦略・不具合修正
     ↓                              ↓
 あるべき姿を定義          1シナリオが通る最小実装
```

> **廃止**: スケルトン実装フェーズ（ADR準拠のクラス骨格のみ作成する工程）は廃止。
> 設計完了後は直接 E2E シナリオを1件通す実装に進むこと。

詳細な開発フロー: [.AI/development-flow.md](../.AI/development-flow.md) を参照

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
│               └── 03-directory-structure.md  # オプション: ディレクトリ構成（理論）
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
| ui.md（画面単位） | 必須 | [design/ui.md](./design/ui.md) |
| 00-overview.md（機能単位） | 必須 | [design/00-overview.md](./design/00-overview.md) |
| 01-class-design.md（機能単位） | 必須 | [design/01-class-design.md](./design/01-class-design.md) |
| 02-sequence.puml（機能単位） | 必須 | [design/02-sequence.md](./design/02-sequence.md) |
| 03-directory-structure.md（機能単位） | **オプション** | [design/03-directory-structure.md](./design/03-directory-structure.md) |

> **注意**: `03-directory-structure.md` はオプション。クラス設計・シーケンス図から
> ディレクトリ構成が自明でない複雑な機能にのみ作成すること。スケルトン実装の代替ではない。

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

- ユーザーストーリー: `docs/user-stories/`
- ADR: `docs/adr/`
- 基本ルール: [ドキュメント共通ルール](./common/index.md)
- ユーザーストーリールール: [user-stories.md](./user-stories.md)
