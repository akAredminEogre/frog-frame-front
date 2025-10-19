# Issueの計画

# DAILY-SCRUM単位のタスク
- ISSUE.mdを元に、開発タスクをデイリースクラム単位に分解する

## DAILY-SCRUM-01: Dexie.jsセットアップとスキーマ設計
- [x] Dexie.jsライブラリのインストール（`npm install dexie`）
- [x] Dexie.js型定義の確認（TypeScript対応）
- [x] IndexedDBデータベーススキーマの設計
  - [x] RewriteRulesテーブルのスキーマ定義
  - ~~[ ] SelectedPageTextテーブルのスキーマ定義~~ (chrome.storageに保存するため削除)
- [x] データベースセットアップクラスの作成（`src/infrastructure/persistance/indexeddb/DexieDatabase.ts`）
- [x] スキーマのバージョン管理戦略の決定
- [x] 作業内容のコミット

**目標**: Dexie.jsが正しくインストールされ、データベーススキーマが定義されている状態 ✅ 完了

## DAILY-SCRUM-02: DexieRewriteRuleRepository実装
- [x] `DexieRewriteRuleRepository`クラスの作成（`src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository.ts`）
- [x] 独立したクラスとして実装（`IRewriteRuleRepository`は将来実装予定）
  - [x] `create(rule: RewriteRule): Promise<void>`メソッド（DB側で自動採番）
  - [x] `update(rule: RewriteRule): Promise<void>`メソッド
  - [x] `getAll(): Promise<RewriteRules>`メソッド（`each()`を使用し最適化）
  - [x] `getById(id: string): Promise<RewriteRule>`メソッド
- [x] Primary Keyの自動採番対応（スキーマ`'++id'`）
- [x] ユニットテストの作成
  - [x] `tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/create/normal-cases.test.ts`
  - [x] `tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/create/Abend/error-cases.test.ts`
  - [x] `tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/update/normal-cases.test.ts`
  - [x] `tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/getAll/normal-cases.test.ts`
  - [x] `tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/getById/normal-cases.test.ts`
  - [x] `tests/unit/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository/getById/error-cases.test.ts`
- [x] テストが全てパスすることを確認（277個のユニットテスト、9個のE2Eテスト）
- [x] 作業内容のコミット

**目標**: DexieRewriteRuleRepositoryが完全に実装され、テストがパスする状態 ✅ 完了

## ~~DAILY-SCRUM-03: DexieSelectedPageTextService実装~~ (不要)
~~- [ ] `DexieSelectedPageTextService`クラスの作成（`src/infrastructure/persistance/indexeddb/DexieSelectedPageTextService.ts`）~~
~~- [ ] `ISelectedPageTextService`インターフェースの実装~~
  ~~- [ ] `setSelectedPageText(text: string): Promise<void>`メソッド~~
  ~~- [ ] `getSelectedPageText(): Promise<string>`メソッド~~
~~- [ ] ユニットテストの作成~~
  ~~- [ ] `tests/unit/infrastructure/persistance/indexeddb/DexieSelectedPageTextService/setSelectedPageText/normal-cases.test.ts`~~
  ~~- [ ] `tests/unit/infrastructure/persistance/indexeddb/DexieSelectedPageTextService/setSelectedPageText/edge-cases.test.ts`~~
  ~~- [ ] `tests/unit/infrastructure/persistance/indexeddb/DexieSelectedPageTextService/setSelectedPageText/Abend/null-undefined-validation.test.ts`~~
  ~~- [ ] `tests/unit/infrastructure/persistance/indexeddb/DexieSelectedPageTextService/getSelectedPageText/normal-cases.test.ts`~~
  ~~- [ ] `tests/unit/infrastructure/persistance/indexeddb/DexieSelectedPageTextService/getSelectedPageText/Abend/no-data-cases.test.ts`~~
~~- [ ] テストが全てパスすることを確認（`npm run test`）~~
~~- [ ] 作業内容のコミット~~

**理由**: SelectedPageTextはchrome.storageに保存する方針に変更したため、IndexedDB実装は不要

## DAILY-SCRUM-04: DI更新とRewriteRuleRepositoryの切り替え
- [ ] DIコンテナの更新（`src/infrastructure/di/container.ts`）
  - [ ] `IRewriteRuleRepository`の登録を`DexieRewriteRuleRepository`に変更
- [ ] 作業内容のコミット

**目標**: DIコンテナが更新され、RewriteRuleRepositoryがDexie実装に切り替わっている状態

**変更点**: アプリ未リリースのためマイグレーション不要、SelectedPageTextはchrome.storageに保存するためDI更新も不要

## DAILY-SCRUM-05: 統合テストと最終検証
- [ ] 既存のユニットテストの実行と確認（`npm run test`）
- [ ] E2Eテストの実行と確認（`npm run test:e2e`）
- [ ] 開発環境での動作確認
  - [ ] Rules画面でルールの作成・編集・削除が正常に動作する
  - [ ] コンテキストメニューからのDOM置換が正常に動作する
  - [ ] データがIndexedDBに正しく保存されることをDevToolsで確認
- [ ] `make test-and-lint`の実行
  - [ ] 全テストがパス
  - [ ] 未使用コードがない
  - [ ] Lintエラーがない
- [ ] 不具合があれば修正
- [ ] 最終コミット
- [ ] ドキュメントの更新（必要に応じて）

**目標**: 全てのテストがパスし、機能が正常に動作する状態

# ISSUEを通した相談事
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->
<!-- について、体言止めでの相談ではなににどう答えればよいのか明確にならないので使わないでください-->
<!-- 相談は具体的な内容を記載してください。 -->
<!-- 質問は不明点を明確に記載してください。 -->
<!-- レビューしてほしいことは、レビュー対象を具体的に記載してください。 -->
<!-- また上記相談・質問・レビューのトピックが重複する場合は、まとめて記載してください。 -->

## マイグレーション戦略について
既存のchrome.storage.localからIndexedDBへのマイグレーションを実施する際、以下のアプローチを検討しています：
1. background.tsの起動時に一度だけマイグレーションを実行する
2. マイグレーション完了フラグをIndexedDBに保存する
3. フラグが存在する場合はマイグレーションをスキップする

この戦略で問題ないか、または他に推奨されるアプローチがあればレビューをお願いします。
→このアプリはまだリリースされていません。なので今回はマイグレーションは不要です。

## IndexedDBのモック方法について
ユニットテストでDexie.jsをどのようにモックするか検討が必要です。以下のアプローチを考えています：
1. `fake-indexeddb`ライブラリを使用してIndexedDBをエミュレート
2. Dexie.jsのインスタンスをテスト用に作成し、テスト後にクリーンアップ

より適切なテスト方法があればアドバイスをお願いします。
→この方針でお願いいたします

# 残タスク
<!-- issueの進捗に応じて記入 -->
- 全タスクは上記DAILY-SCRUM単位のタスクを参照
