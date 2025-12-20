# User Story 001: ルールトグル機能

## ストーリー

> ルール一覧でルールの有効/無効を切り替えられる

## 概要

ルール一覧画面において、各ルールの有効/無効をトグルボタンで切り替えられる機能。

## 設計ドキュメント

- [toggle-rule-active 設計](../../../design/pages/rule-list/features/toggle-rule-active/)
  - [00-overview.md](../../../design/pages/rule-list/features/toggle-rule-active/00-overview.md) - 機能概要
  - [01-class-design.md](../../../design/pages/rule-list/features/toggle-rule-active/01-class-design.md) - クラス設計
  - [02-sequence.puml](../../../design/pages/rule-list/features/toggle-rule-active/02-sequence.puml) - シーケンス図
  - [03-directory-structure.md](../../../design/pages/rule-list/features/toggle-rule-active/03-directory-structure.md) - ディレクトリ構造

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

### 方針: 案C + Parallel Change + Skeleton Pattern

既存コードを壊さずに新機能を追加するため、**Parallel Change**パターンと**Skeleton**パターンを採用する。

```
[前提タスク] 分類Cファイルのディレクトリ移動のみ（ロジック変更なし）
[Phase 1] 新ディレクトリ構造を作成（空のまま）
[Phase 2] Skeleton: インターフェース・スケルトンクラスを作成（コンパイル通る最小実装）
[Phase 3] 実装: スケルトンに実際のロジックを追加
[Phase 4] 統合（新旧並行稼働）
[Phase 5] 旧コード削除（このユーザーストーリーでは実施しない）
```

### 前提タスク: 分類Cファイルのディレクトリ移動

各層ごとに1PRとして実施し、各PR完了時に`make testcheck`が通ることを確認：

**RewriteRule.ts移行（51ファイル影響）**
- [x] RewriteRule.ts移行 + enterprise-business-rules層の修正（7ファイル + 関連テスト）

**その他のファイル移行（各1PR）**
- [x] RulesApp.tsx を `src/frameworks-and-drivers/ui/pages/rules/` へ移行（entrypointsとテスト修正）
- [x] container.ts を `src/frameworks-and-drivers/di/` へ移行（全層のimport修正含む）
- [x] ChromeRuntimeRewriteRuleRepository.ts を `src/frameworks-and-drivers/messaging/` へ移行（関連ファイル修正）

### Phase 1: ディレクトリ構造の準備

- [x] Clean Architecture 4層ディレクトリを作成
  - `src/enterprise-business-rules/entities/`
  - `src/application-business-rules/ports/{input,output,gateway}/`
  - `src/application-business-rules/interactors/`
  - `src/application-business-rules/dto/{input,output}/`
  - `src/interface-adapters/{controllers,presenters,mappers,ports}/`
  - `src/frameworks-and-drivers/{ui,persistence,messaging,proxy-service,browser,di}/`

### Phase 2: Skeleton（インターフェース・スケルトンクラス作成）

- [x] コンパイルが通る最小実装でスケルトンを作成（実際のロジックは空または NotImplementedError）：

**第1層: enterprise-business-rules**
- [x] RewriteRule に withActive(), matchesUrl() のスケルトンを追加

**第2層: application-business-rules**
- [x] IToggleRuleActiveUseCase（Input Port インターフェース）
- [x] IToggleRuleActivePresenter（Output Port インターフェース）
- [x] ITabsGateway（Gateway インターフェース）
- [x] ToggleRuleActiveInputData / OutputData（DTO）
- [x] ToggleRuleActiveInteractor（スケルトン実装）

**第3層: interface-adapters**
- [x] ToggleRuleActiveController（スケルトン実装）
- [x] ToggleRuleActivePresenter（スケルトン実装）
- [x] IRewriteRuleMessagingPort（インターフェース）
- [x] RewriteRuleMapper（スケルトン実装）

**第4層: frameworks-and-drivers**
- [x] ToggleSwitch UIコンポーネント（スケルトン）
- [x] ChromeTabsGateway（スケルトン実装）
- [x] RewriteRuleMessagingService（スケルトン実装）
- [x] RewriteRuleDTO, GetByIdRequestDTO, UpdateRuleActiveRequestDTO（DTO）
- [x] container.ts にスケルトンクラスのDI登録を追加

### Phase 3: 実装（スケルトンにロジック追加）

スケルトンに実際のビジネスロジックを実装：

- [x] RewriteRule.withActive(), matchesUrl() の実装
- [ ] ToggleRuleActiveInteractor の実装（テスト未実装）
- [x] ToggleRuleActiveController の実装（テスト済み）
- [x] ToggleRuleActivePresenter の実装（テスト済み）
- [x] RewriteRuleMapper の実装（Entity ↔ DTO 変換）（テスト済み）
- [x] ChromeTabsGateway の実装（タブリロード）（developマージで完了）
- [ ] RewriteRuleMessagingService の実装 **（3d-3b: ロジック実装 + proxy-service統合）**
  - 現在はスケルトン実装（3d-3a完了: パッケージ追加、クラス・DTO・インターフェース定義のみ）
  - background.ts で registerRewriteRuleMessagingService() を呼び出す **（未実装。別PRで対応予定）**
  - E2Eテストへの影響を調査・修正
- [ ] ToggleSwitch UIコンポーネントの実装（テスト未実装）

### Phase 4: 統合（新旧並行稼働）

**現状**: developマージ完了（2024-12-20 3回目）、ChromeTabsGateway・ToggleRuleActivePresenter実装済み、RewriteRuleMessagingService詳細情報取得、残り統合タスクに集中

- [ ] ChromeRuntimeRewriteRuleRepository を Mapper委譲方式に変更
  - 既存の直接DB操作 → Mapper経由に変更  
  - IRewriteRuleRepository インターフェースは変更なし
  - **現在位置**: `src/frameworks-and-drivers/persistence/ChromeRuntimeRewriteRuleRepository.ts`
- [ ] RulesApp.tsx にトグルUIを統合
  - ToggleSwitch コンポーネントを配置
  - ToggleRuleActiveController を呼び出すハンドラーを追加
  - **現在位置**: `src/frameworks-and-drivers/ui/pages/rules/RulesApp.tsx`

**優先順位**: 上記2タスクを完了後、テスト実装に並行移行可能

### Phase 5: 旧コード削除（このユーザーストーリーでは実施しない）

以下は将来のリファクタリングタスクとして残す：
- 旧ディレクトリ構造の削除
- 分類Bファイルの理論的配置への移動

### 対応しない（分類B）

- IRewriteRuleRepository.ts - パス変更のみ（ロジック変更なし）のため現行位置のまま
- DexieRewriteRuleRepository.ts - ロジック変更なしのため現行位置のまま

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
