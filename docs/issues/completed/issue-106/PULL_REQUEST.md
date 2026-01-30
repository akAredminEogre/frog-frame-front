# ISSUE-106 PULL REQUEST - IndexedDBへの完全移行

## タイトル
feat: LocalStorageからIndexedDBへの完全移行とアーキテクチャ改善

## 概要と理由
Chromeエクステンションの大容量データ保存要件に対応するため、LocalStorageからIndexedDB（Dexie.js）への完全移行を実施しました。既存の実装を置き換えつつ、アーキテクチャの一貫性を保ち、メッセージハンドラーの責務分離により保守性を向上させました。

## 主な変更点

### Infrastructure層
- **新規実装**: `DexieRewriteRuleRepository.ts` - IndexedDBを使用したRepository実装
- **DI設定更新**: `container.ts` - LocalStorageからDexieRepositoryへの切り替え
- **Content Script対応**: `contentContainer.ts` - content script専用DIコンテナを新規作成
- **Chrome Runtime Messaging**: `ChromeRuntimeRewriteRuleRepository.ts` - content script用メッセージング経由Repository
- **メッセージハンドラー分離**: 
  - `getAllRewriteRulesHandler.ts` - getAllRules専用ハンドラーを独立
  - `messageHandlers.ts` - 純粋なハンドラー集約ファイルに再構成
- **Chrome API改善**: `ChromePopupService.ts` - Promise処理とエラーハンドリング強化

### Application層
- **UseCase更新**: 既存のSave/Update/ApplyUseCaseをIndexedDB対応に調整
- **DI対応**: `ApplySavedRulesOnPageLoadUseCase.ts` - DIコンテナによる依存性注入対応

### Entrypoints
- **content.ts**: DIコンテナ使用とChrome Runtime Messaging経由Repository利用
- **popup/App.tsx**: 既存実装を維持（直接Repository使用）

### ドキュメンテーション
- **シーケンス図**: `docs/diagrams/handleSave-sequence.puml` - IndexedDB使用時のデータフロー図

### テスト
- **DIコンテナテスト**: 新しいRepository実装に対応したテスト更新
- **Chrome APIテスト**: Promise処理改善に対応したテスト追加・更新

## テスト方法
[動作確認の手順]
- `make test-and-check` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
  - 単体テスト：278件すべて通過
  - E2Eテスト：12件すべて通過

## 補足
- Chrome Runtime Messagingパターンにより、content scriptとbackground script間の通信を統一
- メッセージハンドラーの責務分離により、今後の機能追加時の保守性が向上
- 全テストが継続的に通過し、既存機能への影響なし

## 本スコープの対象外となったタスク
- LocalStorageからIndexedDBへのデータマイグレーション機能（今後の課題）
- パフォーマンス最適化（基本実装完了により、今後の改善として残置）

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->