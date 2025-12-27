# User Story 003: ルール削除機能

## ストーリー

> ルール一覧でルールを削除できる

## 概要

ルール一覧画面において、各ルールのゴミ箱アイコンをクリックすることでルールを物理削除できる機能を追加する。削除前に確認ダイアログを表示し、削除後は削除されたルールのURLパターンに一致するタブをリロードする。

## 設計ドキュメント

- [ルール削除機能 設計概要](../../design/pages/rule-list/features/delete-rule/00-overview.md)
- [クラス設計](../../design/pages/rule-list/features/delete-rule/01-class-design.md)
- [ディレクトリ構造設計](../../design/pages/rule-list/features/delete-rule/03-directory-structure.md)
- [ADR-001: Clean Architecture with Presenter Pattern](../../adr/001-clean-architecture-with-presenter-pattern.md)
- [ADR-002: メッセージングに @webext-core を採用](../../adr/002-messaging-with-webext-core.md)
- [ADR-003: DB アクセスを messaging 経由に統一し DTO を使用](../../adr/003-unified-db-access-via-messaging.md)
- [ADR-005: ReactコールバックをPresenterに注入するためのFactoryパターン採用](../../adr/005-factory-pattern-for-react-callback-injection.md)

## 現状分析

### 差分分類

| ファイル | 現在位置 | 理論位置 | 修正 | 分類 |
|---------|---------|---------|------|------|
| RewriteRule.ts | enterprise-business-rules/entities/ | enterprise-business-rules/entities/ | 不要 | D |
| ITabsGateway.ts | application-business-rules/ports/gateway/ | application-business-rules/ports/gateway/ | 不要 | D |
| ChromeTabsGateway.ts | frameworks-and-drivers/browser/ | frameworks-and-drivers/browser/ | 不要 | D |
| IRewriteRuleRepository.ts | application-business-rules/ports/gateway/ | application-business-rules/ports/gateway/ | 必須 | E |
| DexieRewriteRuleRepository.ts | frameworks-and-drivers/persistence/ | frameworks-and-drivers/persistence/ | 必須 | E |
| ChromeRuntimeRewriteRuleRepository.ts | frameworks-and-drivers/persistence/ | frameworks-and-drivers/persistence/ | 必須 | E |
| RewriteRuleMapper.ts | interface-adapters/mappers/ | interface-adapters/mappers/ | 必須 | E |
| IRewriteRuleMessagingPort.ts | interface-adapters/ports/ | interface-adapters/ports/ | 必須 | E |
| RewriteRuleMessagingService.ts | frameworks-and-drivers/messaging/ | frameworks-and-drivers/messaging/ | 必須 | E |
| RewriteRuleProxyService.ts | frameworks-and-drivers/messaging/ | frameworks-and-drivers/messaging/ | 必須 | E |
| RewriteRuleProxyServiceImpl.ts | frameworks-and-drivers/messaging/ | frameworks-and-drivers/messaging/ | 必須 | E |
| RulesApp.tsx | frameworks-and-drivers/ui/pages/rules/ | frameworks-and-drivers/ui/pages/rules/ | 必須 | E |
| RuleTableRow.tsx | components/molecules/RuleTableRow/ | frameworks-and-drivers/ui/components/molecules/RuleTableRow/ | 必須 | B |

**分類凡例**:
- A: 新規作成
- B: 既存・配置不適切・ロジック変更なし
- C: 既存・配置不適切・ロジック変更あり（前提タスクとして移行必須）
- D: 既存・配置適切・ロジック変更なし（対応不要）
- E: 既存・配置適切・ロジック変更あり（修正のみ）

### 新規作成ファイル（分類A）

| ファイル | 配置先 | 説明 |
|---------|--------|------|
| DeleteRuleInputData.ts | application-business-rules/dto/input/ | 入力DTO |
| DeleteRuleOutputData.ts | application-business-rules/dto/output/ | 成功時出力DTO |
| DeleteRuleErrorOutputData.ts | application-business-rules/dto/output/ | エラー出力DTO |
| IDeleteRuleUseCase.ts | application-business-rules/ports/input/ | Input Port |
| IDeleteRulePresenter.ts | application-business-rules/ports/output/ | Output Port |
| DeleteRuleInteractor.ts | application-business-rules/interactors/ | UseCase実装 |
| IDeleteRuleController.ts | interface-adapters/controllers/ | Controllerインターフェース |
| DeleteRuleController.ts | interface-adapters/controllers/ | Controller実装 |
| IDeleteRuleControllerFactory.ts | interface-adapters/factories/ | Factoryインターフェース |
| DeleteRuleControllerFactory.ts | interface-adapters/factories/ | Factory実装 |
| DeleteRulePresenter.ts | interface-adapters/presenters/ | Presenter実装 |
| DeleteRuleRequestDTO.ts | frameworks-and-drivers/messaging/dto/request-dto/ | メッセージング用DTO |
| DeleteButton.tsx | frameworks-and-drivers/ui/components/atoms/DeleteButton/ | ゴミ箱アイコンボタン |
| ConfirmDialog.tsx | frameworks-and-drivers/ui/components/organisms/ConfirmDialog/ | 確認ダイアログ |
| ToastNotification.tsx | frameworks-and-drivers/ui/components/molecules/ToastNotification/ | トースト通知 |

## 開発戦略

### 前提タスク（分類Cファイルのディレクトリ移動のみ行う）

なし（分類Cに該当するファイルなし）

### ユーザーストーリー達成タスク

#### Phase 1: メッセージング基盤（既存ファイル修正）

- [ ] DeleteRuleRequestDTO を作成
- [ ] IRewriteRuleRepository に delete() メソッドを追加
- [ ] IRewriteRuleMessagingPort に delete() メソッドを追加
- [ ] RewriteRuleProxyService (IRewriteRuleProxyService) に deleteRule() メソッドを追加
- [ ] RewriteRuleProxyServiceImpl に deleteRule() 実装を追加
- [ ] RewriteRuleMessagingService に delete() 実装を追加
- [ ] RewriteRuleMapper に delete() 実装を追加
- [ ] DexieRewriteRuleRepository に delete() 実装を追加
- [ ] ChromeRuntimeRewriteRuleRepository に delete() 実装を追加

#### Phase 2: 削除ユースケース層（新規作成）

- [ ] DeleteRuleInputData を作成
- [ ] DeleteRuleOutputData を作成
- [ ] DeleteRuleErrorOutputData を作成
- [ ] IDeleteRuleUseCase を作成
- [ ] IDeleteRulePresenter を作成
- [ ] DeleteRuleInteractor を作成

#### Phase 3: Controller/Presenter層（新規作成）

- [ ] IDeleteRuleController を作成
- [ ] DeleteRuleController を作成
- [ ] IDeleteRuleControllerFactory を作成
- [ ] DeleteRuleControllerFactory を作成
- [ ] DeleteRulePresenter を作成
- [ ] container.ts に DI 登録を追加

#### Phase 4: UIコンポーネント層（新規作成・修正）

- [ ] DeleteButton コンポーネントを作成
- [ ] ConfirmDialog コンポーネントを作成
- [ ] ToastNotification コンポーネントを作成
- [ ] RuleTableRow に DeleteButton を追加
- [ ] RulesApp に削除処理を統合（deletingIds 管理、Controller 呼び出し、エラー表示）

### 対応しない（分類B）

- RuleTableRow.tsx の配置移動（components/molecules/ → frameworks-and-drivers/ui/components/molecules/）
  - 機能開発後にリファクタリングとして対応可能
  - 今回の削除機能には影響しない

### タスク網羅性チェック

1. **差分分類で「修正:必須」としたすべてのファイルに対応するタスクがあるか**: ✓
   - IRewriteRuleRepository, DexieRewriteRuleRepository, ChromeRuntimeRewriteRuleRepository → Phase 1
   - RewriteRuleMapper, IRewriteRuleMessagingPort, RewriteRuleMessagingService → Phase 1
   - RewriteRuleProxyService, RewriteRuleProxyServiceImpl → Phase 1
   - RulesApp, RuleTableRow → Phase 4

2. **01-class-design.md で新規作成とした全クラスに対応するタスクがあるか**: ✓
   - DTO類 → Phase 1, 2
   - UseCase類 → Phase 2
   - Controller/Presenter類 → Phase 3
   - UIコンポーネント類 → Phase 4

3. **分類Cファイルの移動タスク（前提タスク）と修正タスク（達成タスク）が両方あるか**: N/A（分類Cなし）

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照

## 関連ドキュメント

- [User Story 001: ルールトグル機能](../completed/user-story-001/README.md) - 類似アーキテクチャの先行実装
- [User Story 002: メッセージングを @webext-core に移行](./user-story-002/README.md) - メッセージング基盤
