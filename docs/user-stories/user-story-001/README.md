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

#### enterprise-business-rules/ (第1層)

- `src/domain/entities/RewriteRule/RewriteRule.ts`
  - 変更内容
    - `src/enterprise-business-rules/entities/RewriteRule/RewriteRule.ts` への移動
  - 影響モジュール（51ファイル）
    - enterprise-business-rules/
      - `src/domain/entities/DomDiffer.ts`
      - `src/domain/entities/ElementMatchesFlexiblePattern.ts`
      - `src/domain/entities/ReplaceElementPreservingState.ts`
      - `src/domain/value-objects/RewriteRules.ts`
      - `src/domain/value-objects/Tab.ts`
      - `src/domain/value-objects/Tabs.ts`
      - `src/domain/value-objects/MatchingElements.ts`
    - application-business-rules/
      - `src/application/ports/IRewriteRuleRepository.ts`
      - `src/application/usecases/rule/GetAllRewriteRulesUseCase.ts`
      - `src/application/usecases/rule/LoadRewriteRuleForEditUseCase.ts`
      - `src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase.ts`
      - `src/application/usecases/rule/UpdateRewriteRuleUseCase.ts`
    - interface-adapters/
      - `src/components/molecules/RuleTableRow/RuleTableRow.tsx`
      - `src/components/organisms/RulesTable/RulesTable.tsx`
    - frameworks-and-drivers/
      - `src/entrypoints/rules/RulesApp.tsx`
      - `src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository.ts`
      - `src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository.ts`
    - tests/ (27ファイル)

⚠️ **前提変更**: このストーリー着手前にディレクトリ構造のClean Architecture準拠移行が必要

#### application-business-rules/ (第2層)

変更不要 - `IRewriteRuleRepository.getById/update` は既に実装済み

参考実装:
- `src/application/usecases/rule/UpdateRewriteRuleUseCase.ts` - タブリロードロジックを参考にする

#### interface-adapters/ (第3層)

- `src/components/molecules/RuleTableRow/RuleTableRow.tsx` - トグルUI追加
  - 現状: 編集ボタン、URLパターン、oldString、newString のみ表示
  - 変更: トグルスイッチコンポーネントを追加

#### frameworks-and-drivers/ (第4層)

- `src/entrypoints/rules/` - RulesApp にトグルハンドラー追加が必要になる可能性

## 開発戦略

### 前提タスク（現状分析より）

domain/ → enterprise-business-rules/ 移行（1ファイル完結型）:

- [ ] RewriteRule/ 移行（51ファイル）- エンティティ + Strategy
- [ ] Tab関連 移行（~25ファイル）- Tab, TabId, TabUrl, Tabs
- [ ] DomDiffer関連 移行（~15ファイル）- DomDiffer, ElementMatchesFlexiblePattern, ReplaceElementPreservingState, MatchingElements, ParserContextStrategy
- [ ] RewriteRules 移行（~10ファイル）- value object
- [ ] その他 移行（~10ファイル）- ElementSelector, SelectedPageText, RegexConstants, Elements, AddedNodes, MutationRecords, ports, errors

※ 各PR: ファイル移動 + import変更のみ、ロジック変更なし

### ユーザーストーリー達成タスク

- [ ] トグルスイッチUIコンポーネント（atoms）を追加
- [ ] ToggleRuleActiveUseCaseを実装
- [ ] RuleTableRowにトグルUIを統合
- [ ] RulesAppにトグルハンドラーを追加

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
