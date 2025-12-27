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

設計ドキュメント（理論）と現在の実装の差分を分類：

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
| RuleTableRow.tsx | components/molecules/RuleTableRow/ | frameworks-and-drivers/ui/components/molecules/RuleTableRow/ | 不要 | B |

**分類凡例**:
- A: 新規作成
- B: 既存・配置不適切・ロジック変更なし
- C: 既存・配置不適切・ロジック変更あり（前提タスクとして移行必須）
- D: 既存・配置適切・ロジック変更なし（対応不要）
- E: 既存・配置適切・ロジック変更あり（修正のみ）

### 分類C: 移行必須ファイルの影響分析

なし（分類Cに該当するファイルなし）

### 分類B: 対応しない

以下のファイルは配置不適切だがロジック変更不要のため、機能開発後にリファクタリング（または対応しない）：

- `RuleTableRow.tsx` - components/molecules/ → frameworks-and-drivers/ui/components/molecules/ への移動のみ

## 開発戦略

### 方針: Parallel Change + Skeleton Pattern

既存コードを壊さずに新機能を追加するため、**Parallel Change**パターンと**Skeleton**パターンを採用する。

```
[前提タスク] 分類Cファイルのディレクトリ移動のみ（ロジック変更なし）→ なし
[Phase 1] ディレクトリ構造の準備（必要に応じて新ディレクトリ作成）
[Phase 2] Skeleton: インターフェース・スケルトンクラスを作成（コンパイル通る最小実装）
[Phase 3] 実装: スケルトンに実際のロジックを追加
[Phase 4] 統合（新旧並行稼働、UI統合）
[Phase 5] 旧コード削除（このユーザーストーリーでは実施しない）
```

### 前提タスク: 分類Cファイルのディレクトリ移動

なし（分類Cに該当するファイルなし）

### Phase 1: ディレクトリ構造の準備

- [ ] 新規ディレクトリを作成（既存のものは作成不要）
  - `src/frameworks-and-drivers/ui/components/atoms/DeleteButton/`
  - `src/frameworks-and-drivers/ui/components/organisms/ConfirmDialog/`
  - `src/frameworks-and-drivers/ui/components/atoms/ToastNotification/`

### Phase 2: Skeleton（インターフェース・スケルトンクラス作成）

コンパイルが通る最小実装でスケルトンを作成（実際のロジックは空または NotImplementedError）：

**第2層: application-business-rules**
- [ ] DeleteRuleInputData（入力DTO）
- [ ] DeleteRuleOutputData（成功時出力DTO）
- [ ] DeleteRuleErrorOutputData（エラー出力DTO）
- [ ] IDeleteRuleUseCase（Input Port インターフェース）
- [ ] IDeleteRulePresenter（Output Port インターフェース）
- [ ] DeleteRuleInteractor（スケルトン実装）
- [ ] IRewriteRuleRepository に delete() メソッドシグネチャを追加

**第3層: interface-adapters**
- [ ] IDeleteRuleController（Controllerインターフェース）
- [ ] DeleteRuleController（スケルトン実装）
- [ ] IDeleteRuleControllerFactory（Factoryインターフェース、ADR-005参照）
- [ ] DeleteRuleControllerFactory（スケルトン実装）
- [ ] DeleteRulePresenter（スケルトン実装）
- [ ] IRewriteRuleMessagingPort に delete() メソッドシグネチャを追加

**第4層: frameworks-and-drivers**
- [ ] DeleteRuleRequestDTO（メッセージング用DTO）
- [ ] RewriteRuleProxyService (IRewriteRuleProxyService) に deleteRule() スケルトン追加
- [ ] RewriteRuleProxyServiceImpl に deleteRule() スケルトン追加
- [ ] RewriteRuleMessagingService に delete() スケルトン追加
- [ ] RewriteRuleMapper に delete() スケルトン追加
- [ ] DexieRewriteRuleRepository に delete() スケルトン追加
- [ ] ChromeRuntimeRewriteRuleRepository に delete() スケルトン追加
- [ ] DeleteButton UIコンポーネント（スケルトン）
- [ ] ConfirmDialog UIコンポーネント（スケルトン）
- [ ] ToastNotification UIコンポーネント（スケルトン）
- [ ] container.ts にスケルトンクラスのDI登録を追加

**テスト戦略書**
- [ ] 結合テスト戦略書を作成（integration-test-strategy.md）
- [ ] E2Eテスト戦略書を作成（e2e-test-strategy.md）

### Phase 3: 実装（スケルトンにロジック追加）

スケルトンに実際のビジネスロジックを実装（各タスクは実装・テスト戦略書・単体テストを含む）：

**メッセージング基盤**
- [ ] DeleteRuleRequestDTO の実装、テスト戦略書・単体テスト
- [ ] RewriteRuleProxyService.deleteRule() の実装、テスト戦略書・単体テスト
- [ ] RewriteRuleProxyServiceImpl.deleteRule() の実装、テスト戦略書・単体テスト
- [ ] RewriteRuleMessagingService.delete() の実装、テスト戦略書・単体テスト
- [ ] RewriteRuleMapper.delete() の実装、テスト戦略書・単体テスト（Entity ↔ DTO 変換 + MessagingPort経由通信）
- [ ] DexieRewriteRuleRepository.delete() の実装、テスト戦略書・単体テスト（IndexedDB物理削除）
- [ ] ChromeRuntimeRewriteRuleRepository.delete() の実装、テスト戦略書・単体テスト（Mapper委譲）

**ユースケース層**
- [ ] DeleteRuleInputData の実装、テスト戦略書・単体テスト
- [ ] DeleteRuleOutputData の実装、テスト戦略書・単体テスト
- [ ] DeleteRuleErrorOutputData の実装、テスト戦略書・単体テスト
- [ ] DeleteRuleInteractor の実装、テスト戦略書・単体テスト（Repository削除 + TabsGatewayリロード）

**Controller/Presenter層**
- [ ] DeleteRuleController の実装、テスト戦略書・単体テスト
- [ ] DeleteRuleControllerFactory の実装、テスト戦略書・単体テスト
- [ ] DeleteRulePresenter の実装、テスト戦略書・単体テスト（成功時View更新、失敗時エラー通知）

**UIコンポーネント層**
- [ ] DeleteButton の実装、テスト戦略書・単体テスト（ゴミ箱アイコン表示、クリックイベント通知）
- [ ] ConfirmDialog の実装、テスト戦略書・単体テスト（確認メッセージ、削除/キャンセルボタン）
- [ ] ToastNotification の実装、テスト戦略書・単体テスト（エラー/成功メッセージ表示）

### Phase 4: 統合（新旧並行稼働、UI統合）

**UI統合**
- [ ] RuleTableRow に DeleteButton を追加
- [ ] RulesApp に削除処理を統合
  - `deletingIds` による重複削除防止
  - ConfirmDialog の表示制御
  - DeleteRuleController の呼び出し
  - ToastNotification によるエラー表示
- [ ] container.ts の DI 登録を本実装に更新

**結合テスト**
- [ ] 正常系テスト（ルール削除 → DB永続化確認）
- [ ] データ整合性テスト（他ルールへの影響なし）
- [ ] Presenter出力テスト（コールバック検証）
- [ ] エラー系テスト（存在しないルールID）
- [ ] 部分的成功テスト（削除成功・タブリロード失敗）

**E2Eテスト**
- [ ] 正常操作フロー（ゴミ箱クリック → 確認ダイアログ → 削除 → 一覧から消える）
- [ ] キャンセル操作（確認ダイアログでキャンセル → 何も起こらない）
- [ ] DB永続化（ページリロード後もルールが削除されている）
- [ ] 複数ルール独立性（1つ削除しても他ルールに影響なし）

### Phase 5: 旧コード削除（このユーザーストーリーでは実施しない）

以下は将来のリファクタリングタスクとして残す：
- 分類Bファイルの理論的配置への移動（RuleTableRow.tsx）

### 対応しない（分類B）

- RuleTableRow.tsx の配置移動（components/molecules/ → frameworks-and-drivers/ui/components/molecules/）
  - 機能開発後にリファクタリングとして対応可能
  - 今回の削除機能には影響しない

### タスク網羅性チェック

1. **差分分類で「修正:必須」としたすべてのファイルに対応するタスクがあるか**: ✓
   - IRewriteRuleRepository → Phase 2（シグネチャ追加）
   - DexieRewriteRuleRepository, ChromeRuntimeRewriteRuleRepository → Phase 2, 3
   - RewriteRuleMapper, IRewriteRuleMessagingPort, RewriteRuleMessagingService → Phase 2, 3
   - RewriteRuleProxyService, RewriteRuleProxyServiceImpl → Phase 2, 3
   - RulesApp → Phase 4

2. **01-class-design.md で新規作成とした全クラスに対応するタスクがあるか**: ✓
   - DTO類 → Phase 2, 3
   - UseCase類 → Phase 2, 3
   - Controller/Presenter/Factory類 → Phase 2, 3
   - UIコンポーネント類 → Phase 2, 3, 4

3. **分類Cファイルの移動タスク（前提タスク）と修正タスク（達成タスク）が両方あるか**: N/A（分類Cなし）

4. **テスト関連タスクが含まれているか**: ✓
   - 結合・E2Eテスト戦略書 → Phase 2
   - 単体テスト戦略書・単体テスト → Phase 3
   - 結合テスト・E2Eテスト → Phase 4

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照

## 関連ドキュメント

- [User Story 001: ルールトグル機能](../completed/user-story-001/README.md) - 類似アーキテクチャの先行実装
- [User Story 002: メッセージングを @webext-core に移行](../user-story-002/README.md) - メッセージング基盤
