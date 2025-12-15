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
| RewriteRule.ts | src/domain/entities/ | src/enterprise-business-rules/entities/ | 必須（withActive, matchesUrl追加） | C |
| IRewriteRuleRepository.ts | src/application/ports/ | src/application-business-rules/ports/gateway/ | 不要（パス変更のみ） | B |
| RulesApp.tsx | src/entrypoints/rules/ | src/frameworks-and-drivers/ui/pages/rules/ | 必須（トグルハンドラー追加） | C |
| container.ts | src/infrastructure/di/ | src/frameworks-and-drivers/di/ | 必須（DI登録追加） | C |
| DexieRewriteRuleRepository.ts | src/infrastructure/persistence/ | src/frameworks-and-drivers/persistence/ | 不要 | B |
| ChromeRuntimeRewriteRuleRepository.ts | src/infrastructure/ | src/frameworks-and-drivers/messaging/ | 必須（Mapper委譲に変更、ADR-002参照） | C |

### 分類C: 移行必須ファイルの影響分析

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

#### ChromeRuntimeRewriteRuleRepository.ts

- **変更内容**:
  - `src/frameworks-and-drivers/messaging/` への移動
  - RewriteRuleMapperへの委譲に変更（DTOを意識しない、ADR-002参照）
- **影響ファイル数**: 少数
- **影響モジュール**:
  - frameworks-and-drivers/ (少数) - container, テスト

#### RulesApp.tsx

- **変更内容**:
  - `src/frameworks-and-drivers/ui/pages/rules/` への移動
  - トグルハンドラー追加
- **影響ファイル数**: 少数（entrypoint）
- **影響モジュール**:
  - frameworks-and-drivers/ (少数) - entrypoints

#### container.ts

- **変更内容**:
  - `src/frameworks-and-drivers/di/` への移動
  - Toggle関連クラスのDI登録追加
- **影響ファイル数**: 多数（DI設定は全体に影響）
- **影響モジュール**:
  - 全層 - DI解決が変わるため広範囲に影響

### 分類B: 対応しない

以下のファイルは配置不適切だがロジック変更不要のため、機能開発後にリファクタリング（または対応しない）：

- `IRewriteRuleRepository.ts` - パス変更のみ（ロジック変更なし）
- `DexieRewriteRuleRepository.ts` - ロジック変更なし

## 開発戦略

### 方針: 案C + Parallel Change

既存コードを壊さずに新機能を追加するため、**Parallel Change**パターンを採用する。

```
[Phase 1] 新ディレクトリ構造を作成（空のまま）
[Phase 2] 新クラスを新ディレクトリに追加（既存コードに影響なし）
[Phase 3] 新旧を並行稼働させながら段階的に移行
[Phase 4] 旧コードを削除（このユーザーストーリーでは実施しない）
```

### Phase 1: ディレクトリ構造の準備

- [ ] Clean Architecture 4層ディレクトリを作成
  - `src/enterprise-business-rules/entities/`
  - `src/application-business-rules/ports/{input,output,gateway}/`
  - `src/application-business-rules/interactors/`
  - `src/application-business-rules/dto/{input,output}/`
  - `src/interface-adapters/{controllers,presenters,mappers,ports}/`
  - `src/frameworks-and-drivers/{ui,persistence,messaging,proxy-service,browser,di}/`

### Phase 2: 新クラスの追加（既存コードに影響なし）

- [ ] RewriteRule に withActive(), matchesUrl() を追加（既存メソッドはそのまま）
- [ ] ToggleSwitch UIコンポーネントを新規作成
- [ ] Toggle UseCase関連クラスを新規作成
  - IToggleRuleActiveUseCase（Input Port）
  - IToggleRuleActivePresenter（Output Port）
  - ToggleRuleActiveInteractor
  - ToggleRuleActiveInputData / OutputData
- [ ] Toggle Controller / Presenter を新規作成
- [ ] ITabsGateway / ChromeTabsGateway を新規作成
- [ ] Messaging関連クラスを新規作成（ADR-002、ADR-003参照）
  - IRewriteRuleMessagingPort
  - RewriteRuleMapper
  - RewriteRuleMessagingService
  - RewriteRuleDTO, GetByIdRequestDTO, UpdateRuleActiveRequestDTO

### Phase 3: 統合（新旧並行稼働）

- [ ] container.ts に新クラスのDI登録を追加（既存登録はそのまま）
- [ ] ChromeRuntimeRewriteRuleRepository を Mapper委譲方式に変更
  - 既存の直接DB操作 → Mapper経由に変更
  - IRewriteRuleRepository インターフェースは変更なし
- [ ] RulesApp.tsx にトグルUIを統合
  - ToggleSwitch コンポーネントを配置
  - ToggleRuleActiveController を呼び出すハンドラーを追加

### Phase 4: 旧コード削除（このユーザーストーリーでは実施しない）

以下は将来のリファクタリングタスクとして残す：
- 旧ディレクトリ構造の削除
- 分類Bファイルの理論的配置への移動

### 対応しない（分類B）

- IRewriteRuleRepository.ts - パス変更のみ（ロジック変更なし）のため現行位置のまま
- DexieRewriteRuleRepository.ts - ロジック変更なしのため現行位置のまま

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
