# network-diagram.puml ガイドライン

user-story ディレクトリ内の network-diagram.puml 作成ルール（任意ファイル）。

README.mdの開発戦略セクションのタスクをもとに作成するアローダイアグラム。

## 目的

**タスク依存関係の可視化**（開発作業の順序を示す）

## 重要: クラス図との違い

このダイアグラムは**タスク依存ネットワーク図**であり、**UMLクラス図やアーキテクチャ依存図ではない**。

| 観点 | タスク依存ネットワーク図（本図） | クラス依存図 |
|------|-------------------------------|-------------|
| 矢印の意味 | 「このタスク完了後、次のタスクを開始できる」 | 「このクラスは別のクラスに依存する」 |
| 矢印の例 | `Interactor実装 --> Controller実装` | `Controller --> Interactor` |
| 解釈 | Interactor実装が完了してからController実装を開始 | ControllerがInteractorを参照する |

### 例: Clean Architectureにおける矢印の方向

```text
タスク依存図:  interactorImpl --> controllerImpl  (Interactorを先に実装 → Controllerを後に実装)
クラス依存図:  Controller --> Interactor         (ControllerがInteractorに依存)
```

両者は矢印の方向が逆になるが、それぞれの文脈で正しい。レビュー時に混同しないよう注意。

## 記載ルール

- **Phase 1 (Skeleton) は注釈に留める**: 自明なため図のノードには含めず、noteセクションで言及する
- **Phase 2 以降のタスクをノードとして記載**: 実装タスク間の依存関係を示す
- **色分け**: Phase ごとに色を統一する

## 凡例の例

```plantuml
legend right
  |= 色 |= Phase |
  | <#lightgray> | Phase 1: テスト戦略書 |
  | <#orange> | Phase 2: 実装+単体テスト |
  | <#pink> | Phase 3: 統合 |
endlegend
```

## noteセクションの構成

図に含まないPhase（前提・後続）は note セクションで説明する:

```plantuml
note bottom
**前提（図に含まない）**:
  - Phase 0: ...
  - Phase 1: Skeleton作成（...）
**本図の範囲**:
  - Phase 2: 実装
  - Phase 3: 統合
**後続（このストーリーでは実施しない）**:
  - Phase 4: 旧コード削除
end note
```
