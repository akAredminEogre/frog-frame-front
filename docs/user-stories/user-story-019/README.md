# User Story 019: ルールJSONインポート機能作成（Phase 1: E2E正常1シナリオ）

## ストーリー

> ルール一覧でJSONファイルからルールをインポートできる

## 概要

ルール一覧画面において、JSONファイルをインポートしてルールを一括登録できる機能を追加する。
エクスポート機能（user-story-015）で出力したJSONファイルと互換性のある形式で取り込みを行い、
プレビュー確認後に確定することでルールを上書き保存する。

本ユーザーストーリーは Phase 1 として、E2E正常1シナリオ（正常系インポートフロー）の実装を対象とする。
将来フェーズで実装する改善項目は、下記「子タスク（別PR対応）」に記載する。

## 設計ドキュメント

- [import-rules-json 設計](../../design/pages/rule-list/features/import-rules-json/)
  - [00-overview.md](../../design/pages/rule-list/features/import-rules-json/00-overview.md) - 機能概要
  - [01-class-design.md](../../design/pages/rule-list/features/import-rules-json/01-class-design.md) - クラス設計
  - [02-sequence.puml](../../design/pages/rule-list/features/import-rules-json/02-sequence.puml) - シーケンス図
  - [03-directory-structure.md](../../design/pages/rule-list/features/import-rules-json/03-directory-structure.md) - ディレクトリ構造
  - [e2e-test-strategy.md](../../design/pages/rule-list/features/import-rules-json/e2e-test-strategy.md) - E2Eテスト戦略書

## 現状分析

### 実装済みコンポーネント（PR#394 feat/rule-json-import）

| ファイル | 分類 | 状態 |
|--------|------|------|
| `IImportRulesJsonUseCase.ts` | A | 実装済み |
| `IImportRulesJsonPresenter.ts` | A | 実装済み |
| `ImportRulesJsonInputData.ts` | A | 実装済み（未使用・将来対応 → US-018） |
| `ImportRulesJsonOutputData.ts` | A | 実装済み |
| `ImportRulesJsonInteractor.ts` | A | 実装済み |
| `IImportRulesJsonController.ts` | A | 実装済み |
| `ImportRulesJsonController.ts` | A | 実装済み |
| `IImportRulesJsonControllerFactory.ts` | A | 実装済み |
| `ImportRulesJsonControllerFactory.ts` | A | 実装済み |
| `ImportRulesJsonPresenter.ts` | A | 実装済み |
| `ImportRulesJsonUI.tsx` | A | 実装済み（将来改善 → US-016） |
| `useImportRulesJson.ts` | A | 実装済み |
| `container.ts` | E | 修正済み（DI登録） |

### PR#394で先送りした改善項目（子タスク）

以下の項目は変更範囲・複雑度を理由に本PRで実装せず、別PRで対応することとした:

| ユーザーストーリー | 対象 | 内容 |
|-----------------|------|------|
| [US-016](../user-story-016/README.md) | `ImportRulesJsonUI.tsx` | ModalDialogBase移行（アクセシビリティ完全対応） |
| [US-017](../user-story-017/README.md) | `ImportRulesJsonInteractor.ts` | I/Oバッチ最適化（Dexie bulk操作） |
| [US-018](../user-story-018/README.md) | `ImportRulesJsonInputData.ts` 他 | UseCase/Controller InputData注入パターン統一 |
| [US-020](../user-story-020/README.md) | `IRewriteRuleRepository.ts` 他 | ID保持リストア（createWithId実装） |

## 開発戦略

### Phase 1: E2E 1シナリオ実装（PR#394 完了）

#### 第2層: application-business-rules

- [x] IImportRulesJsonUseCase（Input Port インターフェース）
- [x] IImportRulesJsonPresenter（Output Port インターフェース）
- [x] ImportRulesJsonInputData / OutputData（DTO）
- [x] ImportRulesJsonInteractor の実装（previewImport / confirmImport）

#### 第3層: interface-adapters

- [x] IImportRulesJsonController（Controllerインターフェース、ADR-005準拠）
- [x] ImportRulesJsonController の実装
- [x] IImportRulesJsonControllerFactory（Factoryインターフェース、ADR-005準拠）
- [x] ImportRulesJsonControllerFactory の実装
- [x] ImportRulesJsonPresenter の実装

#### 第4層: frameworks-and-drivers

- [x] useImportRulesJson カスタムフックの実装（ファイル選択・プレビュー・確定）
- [x] ImportRulesJsonUI UIコンポーネントの実装
- [x] RulesApp.tsx にインポートボタンを統合
- [x] container.ts に DI 登録を追加

#### E2Eテスト

- [x] E2Eテスト戦略書の作成
- [x] E2Eテスト実装（正常系 1 シナリオ: `normal-flow.spec.ts`）

### 子タスク（別PR対応）

- [ ] [US-016](../user-story-016/README.md): ModalDialogBase移行（アクセシビリティ完全対応）
- [ ] [US-017](../user-story-017/README.md): I/Oバッチ最適化（Dexie bulk操作）
- [ ] [US-018](../user-story-018/README.md): UseCase/Controller InputData注入パターン統一
- [ ] [US-020](../user-story-020/README.md): ID保持リストア（createWithId実装）

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
