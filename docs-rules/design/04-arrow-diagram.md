# アローダイアグラム規約

コンポーネント間の依存関係・タスク間の依存ネットワークを PlantUML 形式で図示するための規約。

**ファイル形式: PlantUML (.puml) 必須**

## 概要

アローダイアグラムは、クリーンアーキテクチャにおける依存の方向と、コンポーネント間のデータフローを
視覚的に示す設計ドキュメントである。シーケンス図 (02-sequence.puml) が「時系列フロー」を示すのに対し、
アローダイアグラムは「静的な依存関係・データの流れ方向」を示す。

完了済みユーザーストーリーの実績:

- `docs/user-stories/completed/user-story-001/04-network-diagram.puml` (タスク依存ネットワーク図)
- `docs/user-stories/completed/user-story-003/network-diagram.puml` (タスク依存ネットワーク図)

## 記法ルール

### ファイル構造

```text
@startuml {図のID}
!theme plain
title {タイトル}

' ノード定義
' 依存関係（矢印）
' 凡例・補足

@enduml
```

### ノード定義

`rectangle` を用いてコンポーネント・タスクを定義する。

```text
rectangle "表示テキスト\n複数行も可\n[状態]" as alias #color
```

色の使用規則（完了済みUSの実績から）:

| 色 | 状態 |
|-----|------|
| `#green` | 完了 |
| `#lightgreen` | 完了（淡色） |
| `#yellow` | 進行中 |
| `#pink` / `#red` | ブロック中・未着手 |

### 矢印の種類と意味

| 記法 | 意味 |
|------|------|
| `A --> B` | A が B に依存（依存元 --> 依存先） |
| `A --> B : ラベル` | ラベル付き依存 |
| `A -[#color]-> B : ラベル` | 色付き矢印（完了済みは `#gray`） |

**依存の方向**: 外層 → 内層のみ許可 (Clean Architecture 原則)

- Presentation → Application → Domain
- Infrastructure → Application → Domain
- 内 → 外の依存: インターフェース (Port) 経由でのみ許可

### 凡例

`legend right` ブロックまたは `note` ブロックを使用する。

**`legend right` ブロック（推奨）:**

```text
legend right
  |= 色 |= 状態 |
  | <#green> | 完了 |
  | <#yellow> | 進行中 |
endlegend
```

**`note` ブロック（個別ノードへの注記）:**

```text
note top of alias
**完了済み**
#green
end note
```

### 補足・状況

`note bottom` ブロックで設計上の注意事項や進捗状況を記載する。

```text
note bottom
**User Story XXX: {機能名}**

**アーキテクチャ**: Clean Architecture + Presenter Pattern

**最新状況 (YYYY-MM-DD):**
- ✅ 完了事項
- ⬜ 未着手事項
end note
```

## 必須要素

アローダイアグラムファイルには以下を必ず含めること:

1. **`@startuml` / `@enduml`**: PlantUML ラッパー（必須）
2. **`!theme plain`**: テーマ指定（必須）
3. **`title`**: 図のタイトル（必須）
4. **ノード定義**: `rectangle` を用いたコンポーネント・タスクの定義
5. **依存関係**: 矢印による依存関係の明示
6. **凡例**: 色・記法の意味説明（`legend right` または `note` ブロック）

## オプション要素

- `note bottom` ブロックによる状況・補足・アーキテクチャ説明
- PlantUML コメント（`'` で始まる行）によるセクション区切り
- 完了済み依存関係の色変更（`-[#gray]->` でグレーアウト）

## サンプル図

### サンプル 1: タスク依存ネットワーク図（実績に基づく形式）

```text
@startuml task-dependency-network
!theme plain
title UserStory XXX: {機能名} - タスク依存ネットワーク図

' ノード定義（タスク）
rectangle "T1\nDomain Entity\n実装\n[完了]" as t1 #green
rectangle "T2\nUseCase\n実装\n[完了]" as t2 #green
rectangle "T3\nRepository\nInterface\n[完了]" as t3 #green
rectangle "T4\nRepositoryImpl\n実装\n[完了]" as t4 #green
rectangle "T5\nUI Component\n実装\n[完了]" as t5 #green

' 依存関係（完了済みはグレー）
t1 -[#gray]-> t2 : 完了済み
t3 -[#gray]-> t2 : 完了済み
t3 -[#gray]-> t4 : 完了済み
t2 -[#gray]-> t5 : 完了済み

' 凡例
legend right
  |= 色 |= 状態 |
  | <#green> | 完了 |
endlegend

note bottom
**アーキテクチャ**: Clean Architecture

**最新状況 (YYYY-MM-DD):**
- ✅ 全タスク完了
end note

@enduml
```

### サンプル 2: 進行中タスクを含む依存マップ

```text
@startuml feature-dependency
!theme plain
title {機能名} - コンポーネント依存図

' Presentation Layer
rectangle "UI\nComponent" as ui #lightgreen
rectangle "ViewModel" as vm #yellow

' Application Layer
rectangle "UseCase" as usecase #lightgreen

' Domain Layer
rectangle "Domain\nEntity" as entity #lightgreen

' Infrastructure Layer
rectangle "Repository\nInterface" as repoIf #lightgreen
rectangle "Repository\nImpl" as repoImpl #lightgreen

' 依存関係
ui --> vm
vm --> usecase
usecase --> entity
usecase --> repoIf
repoIf --> repoImpl

legend right
  |= 色 |= 状態 |
  | <#lightgreen> | 完了 |
  | <#yellow> | 進行中 |
endlegend

@enduml
```

## ファイル配置

機能設計ドキュメントの場合:

```text
docs/design/pages/{画面名}/features/{機能名}/
└── 04-arrow-diagram.puml   # .puml 拡張子を使用
```

ユーザーストーリー設計ドキュメントの場合:

```text
docs/user-stories/completed/{user-story-XXX}/
└── 04-network-diagram.puml   # 新規作成時はこの命名規則
```

> **注**: 既存の `user-story-003/network-diagram.puml` は04-プレフィックスなしで作成済み。新規作成時は `04-` プレフィックス付きで統一すること。
