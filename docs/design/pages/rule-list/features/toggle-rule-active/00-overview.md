# ルールトグル機能 設計概要

## 機能概要

ルール一覧画面において、各ルールの有効/無効をトグルボタンで切り替えられる機能を追加する。

## ユーザーストーリー

> ルール一覧でルールの有効/無効を切り替えられる

## トリガー

| アクター | 画面 | トリガー |
|---------|------|---------|
| ユーザー | ルール一覧（rules） | トグルスイッチをクリック |

※ システムイベント（タブリロード等）による自動トリガーはなし

## 機能要件

### 有効/無効トグル

- ルール一覧の各行にトグルスイッチを表示
- トグル操作で `isActive` フラグを反転
- 変更は即座にDBに永続化
- 該当するタブを自動リロード

## アーキテクチャ

Presenter付きパターン（Clean Architecture）を採用：

- **ADR**: [001-clean-architecture-with-presenter-pattern](../../../../../adr/001-clean-architecture-with-presenter-pattern.md)
- **ディレクトリ構造**: [01-directory-structure.md](./01-directory-structure.md)
- **クラス設計**: [02-class-design.md](./02-class-design.md)

## 開発戦略

Parallel Change（Expand-Contract）パターンを採用：

| フェーズ | 内容 | リスク |
|---------|------|-------|
| Expand | スケルトン追加、既存コード変更なし | 極低 |
| Migrate | 実装を埋める、テスト追加 | 低 |
| Contract | 統合・有効化 | 中 |

## 関連ドキュメント

- [ユーザーストーリー](../../../../../user-stories/user-story-001-rule-toggle/)
- [PR計画](../../../../../user-stories/user-story-001-rule-toggle/prs/)
