# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=04
実装が完了したらPROGRESS-04-07.mdを追記してコードレビューを依頼してください
## スクラム-04(07回目) の進捗
<!-- ここに進捗を記載 -->

### レビューコメントへの対応

レビューコメントで指摘された「getByIdメソッドがnullの代わりに例外を投げるように変更」を実装しました。

### 実装内容

1. **RewriteRuleNotFoundErrorの作成**
   - ファイル: `src/domain/errors/RewriteRuleNotFoundError.ts` (新規作成)
   - 機能: ルールが見つからない場合にスローされるカスタムエラークラス

2. **IRewriteRuleRepositoryインターフェースの更新**
   - ファイル: `src/application/ports/IRewriteRuleRepository.ts`
   - 変更内容: `getById`メソッドの返り値を`Promise<RewriteRule | null>`から`Promise<RewriteRule>`に変更

3. **ChromeStorageRewriteRuleRepositoryの更新**
   - ファイル: `src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository.ts`
   - 変更内容:
     - `RewriteRuleNotFoundError`をインポート
     - `getById`メソッドでルールが見つからない場合に`RewriteRuleNotFoundError`を投げるように実装

4. **テストの更新**
   - `tests/unit/application/usecases/rule/LoadRewriteRuleForEditUseCase/execute/normal-cases.test.ts`: nullを返すケースを削除
   - `tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getById/normal-cases.test.ts`: nullを返すケースを削除し、オプショナルチェーンを削除
   - `tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getById/error-cases.test.ts` (新規作成): 異常系テストを追加

### テスト結果

全てのテストが成功しました:
- ユニットテスト: 250 passed
- 全体: 63ファイル、250テスト すべて成功

### コミット

- コミット1: `270aef6` - refactor: getByIdがnullの代わりに例外を投げるように変更
- コミット2: `84c3e60` - docs: レビューコメント対応内容をPROGRESS-04-06.mdに追記

### 修正したファイル

- `src/domain/errors/RewriteRuleNotFoundError.ts` (新規作成)
- `src/application/ports/IRewriteRuleRepository.ts` (更新)
- `src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository.ts` (更新)
- `tests/unit/application/usecases/rule/LoadRewriteRuleForEditUseCase/execute/normal-cases.test.ts` (更新)
- `tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getById/normal-cases.test.ts` (更新)
- `tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getById/error-cases.test.ts` (新規作成)

### 次回以降のスクラムに先送りする課題
<!-- 本issueで解決するが、本スクラムでは取り扱わない課題 -->

なし

### 本issueの対象外とする課題

なし

### スクラム-04(07回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド workflow:see-and-commit-review-comment-then-code-again -->
<!-- ユーザーが使うコマンド workflow:daily-scrum-pass-review-scrum -->

frog-frame-front/host-frontend-root/frontend-src-root/src/application/usecases/rule/RefreshAllTabsAfterRuleUpdateUseCase.ts
には、infrastructure層のロジックを直接実装しないようにしてください。
また、適用するタブは、RewriteRule編集したもので、URLパターンが前方一致するものだけにしてください。


---
