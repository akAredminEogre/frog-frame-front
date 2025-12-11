# User Story 001: ルールトグル機能

## ストーリー

> ルール一覧でルールの有効/無効を切り替えられる

## 概要

ルール一覧画面において、各ルールの有効/無効をトグルボタンで切り替えられる機能。

## 設計ドキュメント

- [toggle-rule-active 設計](../../design/pages/rule-list/features/toggle-rule-active/)

## 現状分析

### 設計目標との差分

| 項目 | 設計目標 | 現状 | 対応 |
|------|---------|------|------|
| isActive プロパティ | RewriteRule に isActive を持つ | ✅ 実装済み | 変更不要 |
| Repository | getById/update メソッド | ✅ 実装済み | 変更不要 |
| タブリロード | 変更時に該当タブをリロード | ✅ UpdateRewriteRuleUseCaseに実装済み | 参考にする |
| トグルUI | 各行にトグルスイッチ | ❌ なし | 追加が必要 |
| トグルUseCase | isActiveのみ変更するUseCase | ❌ なし | 新規作成 |

### 影響を受ける既存ファイル（層別）

※ 新規作成ファイルは分析対象外

#### Domain層（enterprise-business-rules）

変更不要 - `RewriteRule.isActive` は既に実装済み

#### Application層（application-business-rules）

変更不要 - `IRewriteRuleRepository.getById/update` は既に実装済み

参考実装:
- `src/application/usecases/rule/UpdateRewriteRuleUseCase.ts` - タブリロードロジックを参考にする

#### Interface Adapters層

- `src/components/molecules/RuleTableRow/RuleTableRow.tsx` - トグルUI追加
  - 現状: 編集ボタン、URLパターン、oldString、newString のみ表示
  - 変更: トグルスイッチコンポーネントを追加

#### Frameworks & Drivers層

- `src/entrypoints/rules/` - RulesApp にトグルハンドラー追加が必要になる可能性

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
