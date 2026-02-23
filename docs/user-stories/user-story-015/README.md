# User Story 015: ルールJSONエクスポート機能

## ストーリー

> ルール一覧でルールをJSONファイルとしてエクスポートできる

## 概要

ルール一覧画面において、保存済みの全ルールをJSON形式でファイルにエクスポートできる機能を追加する。
エクスポートされたJSONファイルは将来のインポート機能と互換性のある形式とし、メタデータとルールの全属性（ID含む）を含める。

## 設計ドキュメント

- [export-rules-json 設計](../../design/pages/rule-list/features/export-rules-json/)
  - [00-overview.md](../../design/pages/rule-list/features/export-rules-json/00-overview.md) - 機能概要
  - [01-class-design.md](../../design/pages/rule-list/features/export-rules-json/01-class-design.md) - クラス設計
  - [02-sequence.puml](../../design/pages/rule-list/features/export-rules-json/02-sequence.puml) - シーケンス図
  - [03-directory-structure.md](../../design/pages/rule-list/features/export-rules-json/03-directory-structure.md) - ディレクトリ構造
  - [e2e-test-strategy.md](../../design/pages/rule-list/features/export-rules-json/e2e-test-strategy.md) - E2Eテスト戦略書

## 現状分析

### 差分分類

設計ドキュメント（03-directory-structure.md）と現在の実装の差分を分類：

| ファイル | 現在位置 | 理論位置 | 修正 | 分類 |
|--------|---------|---------|------|------|
| IExportRulesJsonUseCase.ts | 存在しない | src/application-business-rules/ports/input/ | 新規作成 | A |
| IExportRulesJsonPresenter.ts | 存在しない | src/application-business-rules/ports/output/ | 新規作成 | A |
| ExportRulesJsonInputData.ts | 存在しない | src/application-business-rules/dto/input/ | 新規作成 | A |
| ExportRulesJsonOutputData.ts | 存在しない | src/application-business-rules/dto/output/ | 新規作成 | A |
| ExportRulesJsonErrorOutputData.ts | 存在しない | src/application-business-rules/dto/output/ | 新規作成 | A |
| ExportRulesJsonInteractor.ts | 存在しない | src/application-business-rules/interactors/ | 新規作成 | A |
| IExportRulesJsonController.ts | 存在しない | src/interface-adapters/controllers/ | 新規作成 | A |
| ExportRulesJsonController.ts | 存在しない | src/interface-adapters/controllers/ | 新規作成 | A |
| IExportRulesJsonControllerFactory.ts | 存在しない | src/interface-adapters/factories/ | 新規作成 | A |
| ExportRulesJsonControllerFactory.ts | 存在しない | src/interface-adapters/factories/ | 新規作成 | A |
| ExportRulesJsonPresenter.ts | 存在しない | src/interface-adapters/presenters/ | 新規作成 | A |
| ExportButton.tsx | 存在しない | src/frameworks-and-drivers/ui/components/atoms/ExportButton/ | 新規作成 | A |
| useExportRulesJson.ts | 存在しない | src/frameworks-and-drivers/ui/hooks/ | 新規作成 | A |
| RulesApp.tsx | 既存 | src/frameworks-and-drivers/ui/pages/rules/ | 修正（ExportButton追加） | E |
| container.ts | 既存 | src/frameworks-and-drivers/di/ | 修正（DI登録追加） | E |
| IRewriteRuleRepository.ts | 既存 | src/application-business-rules/ports/gateway/ | 変更なし（getAll()使用） | D |
| RewriteRuleMapper.ts | 既存 | src/interface-adapters/mappers/ | 変更なし（getAll()使用） | D |

### 分類C: 移行必須ファイル

なし。既存ファイルはすべて適切な位置に配置済み。

### 分類B: 対応しない

なし。

## 開発戦略

### Phase 1: Skeleton（インターフェース・スケルトンクラス作成）

コンパイルが通る最小実装でスケルトンを作成する。

#### 第2層: application-business-rules

- [ ] IExportRulesJsonUseCase（Input Port インターフェース）
- [ ] IExportRulesJsonPresenter（Output Port インターフェース）
- [ ] ExportRulesJsonInputData / OutputData / ErrorOutputData（DTO）
- [ ] ExportRulesJsonInteractor に IExportRulesJsonUseCase を実装（スケルトン）

#### 第3層: interface-adapters

- [ ] IExportRulesJsonController（Controllerインターフェース、ADR-005準拠）
- [ ] ExportRulesJsonController（スケルトン実装）
- [ ] IExportRulesJsonControllerFactory（Factoryインターフェース、ADR-005準拠）
- [ ] ExportRulesJsonControllerFactory（スケルトン実装）
- [ ] ExportRulesJsonPresenter（スケルトン実装）

#### 第4層: frameworks-and-drivers

- [ ] ExportButton UIコンポーネント（スケルトン）
- [ ] useExportRulesJson カスタムフック（スケルトン）

#### テスト戦略書作成

- [ ] 結合テスト戦略書の作成（`docs/design/pages/rule-list/features/export-rules-json/integration-test-strategy.md`）

### Phase 2: 実装（スケルトンにロジック追加）

#### 第2層: application-business-rules

- [ ] ExportRulesJsonInteractor の実装、テスト戦略書・単体テスト

#### 第3層: interface-adapters

- [ ] ExportRulesJsonController の実装、テスト戦略書・単体テスト
- [ ] ExportRulesJsonPresenter の実装、テスト戦略書・単体テスト
- [ ] ExportRulesJsonControllerFactory の実装、テスト戦略書・単体テスト

#### 第4層: frameworks-and-drivers

- [ ] ExportButton UIコンポーネントの実装、テスト戦略書・単体テスト
- [ ] useExportRulesJson カスタムフックの実装、テスト戦略書・単体テスト

### Phase 3: 統合

- [ ] container.ts に ExportRulesJsonControllerFactory のDI登録を追加
- [ ] RulesApp.tsx に ExportButton を統合（useExportRulesJson 呼び出し）
- [ ] 結合テスト戦略書に基づくテスト実装完了
  - 詳細: [integration-test-strategy.md](../../design/pages/rule-list/features/export-rules-json/integration-test-strategy.md)
- [ ] E2Eテスト戦略書に基づくテスト実装完了
  - 詳細: [e2e-test-strategy.md](../../design/pages/rule-list/features/export-rules-json/e2e-test-strategy.md)

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
