# ISSUE-113 IndexedDB環境検証テストの実装

## タイトル
IndexedDB環境検証テストを追加し、環境セットアップ問題の早期検知を実現

## 概要と理由
開発環境でIndexedDBが導入されて間もなく、ブランチpull後やWSL・CodeSpaces環境によってはIndexedDBが正しく動作しないことがありました。E2Eテストの失敗から原因調査に時間がかかるため、ユニットテストレベルで環境セットアップの問題を早期検知できるようにします。

### 背景
- IndexedDB導入直後で、環境セットアップの問題が発生しやすい
- E2E失敗時の原因調査に時間がかかる
- `make dev`再実行や`docker compose exec frontend npm run install`で解決できるが、問題の検知が遅い

### 目的
- ユニットテストレベルで環境問題を即座に検知
- E2E失敗前に問題を発見し、デバッグ時間を削減
- 明確なエラーメッセージで解決方法を提示

## 主な変更点

### 新規作成
**tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/environment-verification.test.ts**
- IndexedDB環境検証テスト（5つのテストケース）:
  1. `globalThis.indexedDB`が存在することを確認
  2. fake-indexeddbのIDBFactoryインスタンスであることを検証
  3. Dexieデータベースが正常に初期化できることを確認
  4. rewriteRulesテーブルが利用可能であることを確認
  5. 基本的なIndexedDB操作（CRUD）が実行可能であることを確認

### 修正
**tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/create/normal-cases.test.ts**
- beforeEachに環境チェックを追加
- IndexedDBが利用できない場合の明確なエラーメッセージを実装:
  ```
  IndexedDB is not available in test environment.
  Please check if fake-indexeddb setup is correct in tests/unit/infrastructure/persistance/indexeddb/setup.ts.
  This may happen after git pull - try running: docker compose exec frontend npm run install
  ```

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- `make unit` でユニットテストが正常に動作することを確認
  - 全283テストが通過
  - 環境検証テスト5件が正常に動作

## 補足
[追加の文脈や注意点]
- 本実装はfake-indexeddbを使用したユニットテスト環境での検証です
- fake-indexeddbはIndexedDB APIの仕様に準拠した完全な実装を提供しています
- エラーメッセージには解決方法（`docker compose exec frontend npm run install`）を含めています
- 既存のテストはすべて正常に動作し、新しい環境検証テストも追加されました

## 本スコープの対象外となったタスク

なし（計画通りに全タスクを完了）

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
