# DAILY SCRUM-01回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
<!-- PLAN.mdの計画の中でどのユーザーストーリーに取り組むか記載してください。 -->
daily-scrum-01: IndexedDBライブラリ（Dexie.js）の現状調査とリポジトリ実装の準備
- 現在のLocalStorageRepositoryの実装確認
- Dexie.jsを使ったIndexedDBRepositoryの基本実装
- リポジトリインターフェースの確認と必要な調整

## 修正予定ファイル
<!-- 修正予定のファイルを記載してください。 -->
- src/infrastructure/persistance/LocalStorageRepository.ts（調査）
- src/infrastructure/persistance/IndexedDBRepository.ts（新規作成）
- src/infrastructure/persistance/DexieDatabase.ts（新規作成）
- src/application/ports/IRewriteRuleRepository.ts（調査）
- src/infrastructure/di/container.ts（調査）

## スクラム内残タスク
- [ ] 現在のLocalStorageRepositoryの実装確認
- [ ] Dexie.jsを使ったIndexedDBRepositoryの基本実装
- [ ] リポジトリインターフェースの確認と必要な調整

## 相談事項
<!-- workflow-01-create-daily-scrum-doc-after-coding.mdの場合は作成しない -->
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->
<!-- について、体言止めでの相談ではなににどう答えればよいのか明確にならないので使わないでください-->
<!-- 相談は具体的な内容を記載してください。 -->
<!-- 質問は不明点を明確に記載してください。 -->
<!-- レビューしてほしいことは、レビュー対象を具体的に記載してください。 -->
<!-- また上記相談・質問・レビューのトピックが重複する場合は、まとめて記載してください。 -->
<!-- ユーザーが使うコマンド: frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-discussion-then-start-coding.md-->

## 一言コメント
<!-- 感情ベースで一言コメントをお願いします。 -->
IndexedDBへの移行でより大容量のデータ保存が可能になることにワクワクしています！

# DAILY SCRUM-01作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

### IndexedDB実装の完了
- DexieRewriteRuleRepositoryの実装完了
- DIコンテナの設定でLocalStorageRepositoryからDexieRewriteRuleRepositoryへの切り替え
- Chrome Runtime Messaging経由でのRepository実装（content script用）

### メッセージハンドラーの整理
- saveRuleハンドラーとgetAllRulesハンドラーを独立したファイルに分離
- messageHandlers.tsを純粋な集約ファイルとして再構成
- content scriptのDIコンテナ（contentContainer.ts）を新規作成

### デバッグとテスト
- Chrome API呼び出しのPromise処理とエラーハンドリング改善
- DIコンテナテストの更新（新しいRepository実装に対応）
- 全テスト（単体テスト278件、E2Eテスト12件）の通過確認

### ドキュメント
- PlantUMLでのシーケンス図作成（handleSave-sequence.puml）
- IndexedDB使用時のデータフローを明確化

## 修正したファイル

### Infrastructure層
- src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository.ts (新規作成・修正)
- src/infrastructure/di/container.ts (DexieRewriteRuleRepositoryへの切り替え)
- src/infrastructure/di/contentContainer.ts (新規作成)
- src/infrastructure/browser/messaging/ChromeRuntimeRewriteRuleRepository.ts (新規作成)
- src/infrastructure/browser/router/messageHandlers.ts (ハンドラー集約のみに変更)
- src/infrastructure/browser/router/handlers/getAllRewriteRulesHandler.ts (新規作成)
- src/infrastructure/browser/router/handlers/saveRule.ts (作成→削除)
- src/infrastructure/browser/popup/ChromePopupService.ts (Promise処理修正)
- src/infrastructure/browser/tabs/ChromeTabsService.ts (デバッグログ削除)
- src/infrastructure/browser/tabs/ChromeCurrentTabService.ts (デバッグログ削除)

### Application層
- src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase.ts
- src/application/usecases/rule/UpdateRewriteRuleUseCase.ts
- src/application/usecases/rule/ApplySavedRulesOnPageLoadUseCase.ts (DI対応、デバッグログ削除)

### Components層
- src/components/atoms/Button.tsx (デバッグログ削除)
- src/components/molecules/SaveButton.tsx (デバッグログ削除)
- src/components/pages/EditRulePage.tsx (デバッグログ削除)

### Entrypoints
- src/entrypoints/popup/App.tsx (元の実装に復元、デバッグログ削除)
- src/entrypoints/content.ts (DIコンテナ使用、デバッグログ削除)

### テスト
- tests/unit/application/usecases/rule/LoadRewriteRuleForEditUseCase/execute/normal-cases.test.ts
- tests/unit/application/usecases/rule/UpdateRewriteRuleUseCase/execute/normal-cases.test.ts
- tests/unit/infrastructure/di/container/interface-registration-completeness.test.ts
- tests/unit/infrastructure/di/container/concrete-class-registration-completeness.test.ts
- tests/unit/infrastructure/browser/popup/ChromePopupService.test.ts (新実装対応)

### ドキュメント
- docs/diagrams/handleSave-sequence.puml (新規追加)