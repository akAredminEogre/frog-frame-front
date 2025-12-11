# User Story 001: ルールトグル機能

## ストーリー

> ルール一覧でルールの有効/無効を切り替えられる

## 概要

ルール一覧画面において、各ルールの有効/無効をトグルボタンで切り替えられる機能。

## 関連ドキュメント

| ドキュメント | リンク |
|-------------|--------|
| ADR | [001-clean-architecture-with-presenter-pattern](../../adr/001-clean-architecture-with-presenter-pattern.md) |
| 設計概要 | [00-overview.md](../../design/pages/rule-list/features/toggle-rule-active/00-overview.md) |
| ディレクトリ構造 | [01-directory-structure.md](../../design/pages/rule-list/features/toggle-rule-active/01-directory-structure.md) |
| クラス設計 | [02-class-design.md](../../design/pages/rule-list/features/toggle-rule-active/02-class-design.md) |

## 開発戦略

**Parallel Change（Expand-Contract）パターン** を採用

| フェーズ | 説明 | リスク |
|---------|------|--------|
| Expand | スケルトン追加、既存コード変更なし | 極低 |
| Migrate | 実装を埋める、テスト追加 | 低 |
| Contract | 統合・有効化 | 中 |

## PR一覧

| PR | ファイル | 状態 | 内容 |
|----|----------|------|------|
| [PR-001](./prs/pr-001.md) | pr-001.md | ⬜ 未着手 | Expand（スケルトン追加） |
| [PR-002](./prs/pr-002.md) | pr-002.md | ⬜ 未着手 | Migrate（実装を埋める） |
| [PR-003](./prs/pr-003.md) | pr-003.md | ⬜ 未着手 | Contract（統合・有効化） |

## 進捗

- [ ] PR-001 マージ完了
- [ ] PR-002 マージ完了
- [ ] PR-003 マージ完了
- [ ] 機能リリース完了

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
