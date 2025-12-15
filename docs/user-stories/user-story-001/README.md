# User Story 001: ルールトグル機能

## ストーリー

> ルール一覧でルールの有効/無効を切り替えられる

## 概要

ルール一覧画面において、各ルールの有効/無効をトグルボタンで切り替えられる機能。

## 設計ドキュメント

- [toggle-rule-active 設計](../../design/pages/rule-list/features/toggle-rule-active/)
  - [00-overview.md](../../design/pages/rule-list/features/toggle-rule-active/00-overview.md) - 機能概要
  - [01-class-design.md](../../design/pages/rule-list/features/toggle-rule-active/01-class-design.md) - クラス設計
  - [02-sequence.puml](../../design/pages/rule-list/features/toggle-rule-active/02-sequence.puml) - シーケンス図
  - [03-directory-structure.md](../../design/pages/rule-list/features/toggle-rule-active/03-directory-structure.md) - ディレクトリ構造

## 現状分析

### 差分分類

設計ドキュメント（理論）と現在の実装の差分を分類：

| ファイル | 現在位置 | 理論位置 | 修正 | 分類 |
|---------|---------|---------|------|------|
| RewriteRule.ts | src/domain/entities/ | src/enterprise-business-rules/entities/ | 必須（withActive, matchesUrl追加） | B |
| IRewriteRuleRepository.ts | src/application/ports/ | src/application-business-rules/ports/gateway/ | 必須（パス変更のみ） | B |
| RulesApp.tsx | src/entrypoints/rules/ | src/frameworks-and-drivers/ui/pages/rules/ | 必須（トグルハンドラー追加） | B |
| container.ts | src/infrastructure/di/ | src/frameworks-and-drivers/di/ | 必須（DI登録追加） | B |
| DexieRewriteRuleRepository.ts | src/infrastructure/persistence/ | src/frameworks-and-drivers/persistence/ | 不要 | C |
| ChromeRuntimeRewriteRuleRepository.ts | src/infrastructure/ | src/frameworks-and-drivers/messaging/ | 必須（Mapper委譲に変更、ADR-002参照） | B |

### 分類B: 移行必須ファイルの影響分析

#### RewriteRule.ts

- **変更内容**:
  - `src/enterprise-business-rules/entities/` への移動
  - `withActive()` メソッド追加（有効/無効の状態変更）
  - `matchesUrl()` メソッド追加（URLマッチング判定、ADR-001参照）
- **影響ファイル数**: 51ファイル
- **影響モジュール**:
  - enterprise-business-rules/ (7ファイル) - DomDiffer, RewriteRules, Tab等
  - application-business-rules/ (5ファイル) - UseCases
  - interface-adapters/ (2ファイル) - RuleTableRow, RulesTable
  - frameworks-and-drivers/ (10ファイル) - Repository実装, handlers
  - tests/ (27ファイル)

#### IRewriteRuleRepository.ts

- **変更内容**:
  - `src/application-business-rules/ports/gateway/` への移動（Gateway Interface）
  - Interactorが依存するため application-business-rules 層に配置
- **影響ファイル数**: 14ファイル
- **影響モジュール**:
  - application-business-rules/ (5ファイル) - UseCases
  - frameworks-and-drivers/ (6ファイル) - container, Repository実装
  - tests/ (3ファイル)

#### ChromeRuntimeRewriteRuleRepository.ts

- **変更内容**:
  - `src/frameworks-and-drivers/messaging/` への移動
  - RewriteRuleMapperへの委譲に変更（DTOを意識しない、ADR-002参照）
- **影響ファイル数**: 少数

#### RulesApp.tsx

- **変更内容**:
  - `src/frameworks-and-drivers/ui/pages/rules/` への移動
  - トグルハンドラー追加
- **影響ファイル数**: 少数（entrypoint）

#### container.ts

- **変更内容**:
  - `src/frameworks-and-drivers/di/` への移動
  - Toggle関連クラスのDI登録追加
- **影響ファイル数**: 多数（DI設定は全体に影響）

### 分類C: 対応しない

以下のファイルは修正不要のため、現行位置のまま：

- `DexieRewriteRuleRepository.ts` - ロジック変更なし

## 開発戦略

### 前提タスク（分類Bファイルのディレクトリ移動のみ行う）

- [ ] RewriteRule.ts を enterprise-business-rules/entities/ へ移動（51ファイル）
- [ ] IRewriteRuleRepository.ts を application-business-rules/ports/gateway/ へ移動（14ファイル）

### ユーザーストーリー達成タスク

- [ ] RewriteRule に withActive(), matchesUrl() を追加
- [ ] ToggleSwitch UIコンポーネントを追加
- [ ] ITabsGateway / ChromeTabsGateway を追加
- [ ] Toggle UseCase関連クラスを実装
- [ ] Messaging関連クラスを実装（ADR-002、ADR-003参照）
- [ ] ChromeRuntimeRewriteRuleRepository をMapper委譲方式に変更
- [ ] RulesApp.tsx にトグルUIを統合

### 対応しない（分類C）

- DexieRewriteRuleRepository.ts - 修正不要のため現行位置のまま

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
