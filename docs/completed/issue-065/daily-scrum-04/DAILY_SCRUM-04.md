# DAILY SCRUM-04回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
<!-- PLAN.mdの計画の中でどのユーザーストーリーに取り組むか記載してください。 -->
- アーキテクチャ改善とテスト充実に焦点を当てる
  - EditRulePageのビジネスロジックをUseCaseレイヤーに分離（クリーンアーキテクチャ準拠）
  - ストレージ操作の単体テストを実装（リポジトリ層のテスト）
  - 編集画面のE2Eテストを拡充（コメントアウトされたテストの復活）
- メッセージング方式でのタブ内容更新機能の実装
- 編集画面でのキャンセル機能実装（ポップアップクローズ）
- 手動テストによる動作確認とtest-and-lintの実行

## 修正予定ファイル
<!-- 修正予定のファイルを記載してください。 -->
- リファクタリング: `src/components/pages/EditRulePage.tsx` ビジネスロジックの分離
- 新規作成: `src/application/usecases/EditRewriteRuleUseCase.ts` ユースケース層
- 新規作成: `tests/unit/infrastructure/ChromeStorageRewriteRuleRepository.test.ts` リポジトリ単体テスト
- 新規作成: `tests/unit/domain/RewriteRules.test.ts` ドメインモデル単体テスト
- 拡張: `tests/e2e/edit-page.spec.ts` E2Eテストの復活と拡充
- 拡張: `src/entrypoints/rules/RulesApp.tsx` メッセージング機能追加
- 拡張: `src/components/pages/EditRulePage.tsx` キャンセル機能実装

## スクラム内残タスク
- [x] EditRulePageのビジネスロジックをUseCaseに分離
- [x] メッセージング方式でのタブ内容更新機能実装

## 相談事項
<!-- workflow:01-create-daily-scrum-doc-after-coding.mdの場合は作成しない -->
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->
<!-- について、体言止めでの相談ではなににどう答えればよいのか明確にならないので使わないでください-->
<!-- 相談は具体的な内容を記載してください。 -->
<!-- 質問は不明点を明確に記載してください。 -->
<!-- レビューしてほしいことは、レビュー対象を具体的に記載してください。 -->
<!-- また上記相談・質問・レビューのトピックが重複する場合は、まとめて記載してください。 -->

**アーキテクチャとテスト戦略について相談**
- EditRulePageのビジネスロジックをUseCaseに分離する際、UseCase層の責務範囲はどこまでにすべきでしょうか？（リポジトリ呼び出し、バリデーション、エラーハンドリングなど）
  - EditRulePageがinfrastructure層、domain層に依存しないように、リポジトリ呼び出しやビジネスロジックはUseCaseに集約してください。バリデーションも可能な限りUseCaseで行い、UIコンポーネントは表示とユーザー入力の受け取りに専念させる設計が望ましいです。
- リポジトリ層の単体テストでは、Chrome Storage APIのモックをどのように実装するのが適切でしょうか？
  - →frog-frame-front/host-frontend-root/frontend-src-root/tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepositoryを参考にしてください
- 編集画面のE2Eテストで優先的に復活させるべきテストケースは何でしょうか？
  - // 19. Assert: コンソールエラーが発生していないことを確認
  // expect(consoleMessages).toHaveLength(0); です。ただし難しそうであれば、本スクラムの対象外としても構いません。
- メッセージング機能の実装では、Chrome Extension APIのメッセージング機能を使用する方針で良いでしょうか？
  - はい、その方針で問題ありません。`chrome.runtime.sendMessage`と`chrome.runtime.onMessage`を活用してください。infrastructure層に実装済みのロジックがないか確認し、あればそれを使うようにしてください 

## 一言コメント
<!-- 感情ベースで一言コメントをお願いします。 -->
スクラム03で編集機能の基本実装が完了したので、いよいよアーキテクチャの改善とテストの充実に取り組めます！保守性と品質を高めていく段階で、やりがいを感じます。

# DAILY SCRUM-04作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

### 1. EditRulePageのビジネスロジックをUseCaseレイヤーに分離
- `LoadRewriteRuleForEditUseCase`を作成し、ルール読み込みロジックを分離
- `UpdateRewriteRuleUseCase`を作成し、ルール更新ロジックを分離
- `EditRulePage`をリファクタリングし、UseCase経由でリポジトリを操作するように変更
- クリーンアーキテクチャに準拠した設計に改善

### 2. リポジトリ層の単体テスト実装
- `getById`メソッドの正常系テストを実装（4テストケース）
- `update`メソッドの正常系テストを実装（4テストケース）
- `getById`メソッドの異常系テスト（RewriteRuleNotFoundError）を実装

### 3. tsrツール設定の最適化
- tsconfig.tsr.jsonのexclude設定を調整し、application/domain/infrastructure層が削除されないように修正
- tsrツールのエクスポート単位の未使用判定の仕様を理解し、適切に対応

### 4. E2Eテストの修正と拡充
- 編集後のルール検証で不要なアサーションを削除し、テストを修正
- コメントアウトされていたコンソールエラーテストを復活

### 5. UseCaseレイヤーの単体テスト追加
- `LoadRewriteRuleForEditUseCase`の正常系テスト（3テストケース）
- `UpdateRewriteRuleUseCase`の正常系テスト（3テストケース）

### 6. メッセージング方式でのタブ内容更新機能実装
- `RefreshAllTabsAfterRuleUpdateUseCase`を作成
- `EditRulePage`でルール保存後に全タブの内容を自動更新する機能を追加

### 7. エラーハンドリングの改善
- `getById`メソッドがnullの代わりに`RewriteRuleNotFoundError`を投げるように変更
- 返り値を`Promise<RewriteRule | null>`から`Promise<RewriteRule>`に変更

### 8. クリーンアーキテクチャの遵守
- `RefreshAllTabsAfterRuleUpdateUseCase`からinfrastructure層のロジックを分離
- `IChromeTabsService`に`queryTabs`メソッドを追加し、DI経由で使用
- URLパターンが前方一致するタブのみに絞り込む機能を実装

### 9. ビジネスロジックのdomain層への移動
- `RewriteRule`エンティティに`matchesUrl`メソッドを追加
- URLパターンとタブURLの前方一致判定ロジックをdomain層に配置

### 10. RewriteRuleのurlPatternを必須パラメータ化
- urlPatternをオプショナル(`string | undefined`)から必須(`string`)に変更
- `matchesUrl`メソッドのロジックを空文字列チェックに修正
- 関連する全テストコードを修正

## 修正したファイル
- 新規作成: `src/application/usecases/rule/LoadRewriteRuleForEditUseCase.ts`
- 新規作成: `src/application/usecases/rule/UpdateRewriteRuleUseCase.ts`
- 新規作成: `src/application/usecases/rule/RefreshAllTabsAfterRuleUpdateUseCase.ts`
- 新規作成: `src/domain/errors/RewriteRuleNotFoundError.ts`
- 修正: `src/domain/entities/RewriteRule/RewriteRule.ts` (matchesUrlメソッド追加、urlPattern必須化)
- 修正: `src/application/ports/IRewriteRuleRepository.ts`
- 修正: `src/application/ports/IChromeTabsService.ts` (queryTabsメソッド追加)
- 修正: `src/infrastructure/browser/tabs/ChromeTabsService.ts` (queryTabsメソッド実装)
- 修正: `src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository.ts`
- リファクタリング: `src/components/pages/EditRulePage.tsx`
- 修正: `src/components/organisms/RewriteRuleForm.tsx`
- 修正: `tests/e2e/edit-page.spec.ts`
- 新規作成: `tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getById/normal-cases.test.ts`
- 新規作成: `tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getById/error-cases.test.ts`
- 新規作成: `tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/update/normal-cases.test.ts`
- 新規作成: `tests/unit/application/usecases/rule/LoadRewriteRuleForEditUseCase/execute/normal-cases.test.ts`
- 新規作成: `tests/unit/application/usecases/rule/UpdateRewriteRuleUseCase/execute/normal-cases.test.ts`
- 新規作成: `tests/unit/application/usecases/rule/RefreshAllTabsAfterRuleUpdateUseCase/execute/normal-cases.test.ts`
- 新規作成: `tests/unit/domain/entities/RewriteRule/matchesUrl/normal-cases.test.ts`
- 修正: `tsconfig.tsr.json`
- 修正: 多数のテストファイル（RewriteRuleコンストラクタの引数修正）
