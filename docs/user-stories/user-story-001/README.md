# User Story 001: ルールトグル機能

## ストーリー

> ルール一覧でルールの有効/無効を切り替えられる

## 概要

ルール一覧画面において、各ルールの有効/無効をトグルボタンで切り替えられる機能。

## 設計ドキュメント

- [toggle-rule-active 設計](../../design/pages/rule-list/features/toggle-rule-active/)

## 現状分析

### 差分分類

設計ドキュメント（理論）と現在の実装の差分を分類：

| ファイル | 現在位置 | 理論位置 | 修正 | 分類 |
|---------|---------|---------|------|------|
| RewriteRule.ts | src/domain/entities/ | src/enterprise-business-rules/entities/ | 必須（withActive追加） | B |
| IRewriteRuleRepository.ts | src/application/ports/ | src/interface-adapters/gateways/ | 必須（設計上Gateway Interface） | B |
| RulesApp.tsx | src/entrypoints/rules/ | src/frameworks-and-drivers/ui/pages/rules/ | 必須（トグルハンドラー追加） | B |
| DexieRewriteRuleRepository.ts | src/infrastructure/persistence/ | src/frameworks-and-drivers/persistence/ | 不要 | C |
| container.ts | src/infrastructure/di/ | src/frameworks-and-drivers/di/ | 必須（DI登録追加） | B |

### 分類B: 移行必須ファイルの影響分析

#### RewriteRule.ts

- **変更内容**:
  - `src/enterprise-business-rules/entities/` への移動
  - `withActive()` メソッド追加
- **影響ファイル数**: 51ファイル
- **影響モジュール**:
  - enterprise-business-rules/ (7ファイル) - DomDiffer, RewriteRules, Tab等
  - application-business-rules/ (5ファイル) - UseCases
  - interface-adapters/ (2ファイル) - RuleTableRow, RulesTable
  - frameworks-and-drivers/ (10ファイル) - Repository実装, handlers
  - tests/ (27ファイル)

#### IRewriteRuleRepository.ts

- **変更内容**:
  - `src/interface-adapters/gateways/` への移動（Gateway Interface）
- **影響ファイル数**: 14ファイル
- **影響モジュール**:
  - application-business-rules/ (5ファイル) - UseCases
  - frameworks-and-drivers/ (6ファイル) - container, Repository実装
  - tests/ (3ファイル)

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
- `ChromeRuntimeRewriteRuleRepository.ts` - ロジック変更なし
- その他、変更のない既存ファイル

## 開発戦略

### 前提タスク（分類B: 移行必須）

- [ ] RewriteRule.ts を enterprise-business-rules/entities/ へ移行（51ファイル）
  - withActive() メソッド追加
  - importパス更新
- [ ] IRewriteRuleRepository.ts を interface-adapters/gateways/ へ移行（14ファイル）
  - importパス更新のみ

### ユーザーストーリー達成タスク

- [ ] ToggleSwitch UIコンポーネント（atoms）を追加
- [ ] ITabsGateway / ChromeTabsGateway を追加
- [ ] Toggle関連クラスを実装
  - ToggleRuleActiveInputData
  - ToggleRuleActiveOutputData
  - IToggleRuleActiveUseCase
  - IToggleRuleActivePresenter
  - ToggleRuleActiveInteractor
  - ToggleRuleActiveController
  - ToggleRuleActivePresenter
- [ ] RulesApp.tsx にトグルハンドラーを追加
- [ ] container.ts にDI登録を追加

### 対応しない（分類C）

- DexieRewriteRuleRepository.ts - 修正不要のため現行位置のまま
- ChromeRuntimeRewriteRuleRepository.ts - 修正不要のため現行位置のまま

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
