# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=01
実装が完了したらPROGRESS-01.mdを追記してコードレビューを依頼してください
## スクラム-01(01回目) の進捗
<!-- ここに進捗を記載 -->

RewriteRuleエンティティに`isActive`プロパティを追加しました。

### 作業内容
1. RewriteRuleエンティティのコンストラクタに`isActive: boolean = true`パラメータを追加
2. RewriteRuleParamsインターフェースに`isActive: boolean`プロパティを追加
3. fromParamsとfromPlainObjectファクトリーメソッドを`isActive`に対応させる
4. RewriteRuleのテストケースを`isActive`プロパティ対応で更新
5. 関連する全てのTypeScriptファイルで`isActive`プロパティ不足エラーを修正

### 修正したファイル

- `src/domain/entities/RewriteRule/RewriteRule.ts` - isActiveプロパティ追加
- `src/application/types/RewriteRuleParams.ts` - isActiveプロパティ追加
- `tests/unit/domain/entities/RewriteRule/constructor/normal-cases.test.ts` - テスト更新
- `tests/unit/domain/entities/RewriteRule/fromPlainObject/normal-cases.test.ts` - テスト更新
- `src/components/organisms/RewriteRuleForm.stories.tsx` - StorybookのProps修正
- `src/components/pages/EditRulePage.tsx` - 初期状態修正
- `src/entrypoints/popup/App.tsx` - 初期状態修正
- `tests/unit/application/usecases/rule/UpdateRewriteRuleUseCase/execute/normal-cases.test.ts` - テスト更新

### 次回以降のスクラムに先送りする課題
<!-- 本issueで解決するが、本スクラムでは取り扱わない課題 -->

- Repository層で`isActive`カラムの操作を実装
- Repository層のテストコードを追加・更新
- make testcheckの実行と修正

### 本issueの対象外とする課題

UIやビジネスロジックへの`isActive`カラムの反映は別チケットで対応する。

### スクラム-01(01回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-daily-scrum-pass-review.md -->
```
- `src/components/organisms/RewriteRuleForm.stories.tsx` - StorybookのProps修正
- `src/components/pages/EditRulePage.tsx` - 初期状態修正
- `src/entrypoints/popup/App.tsx` - 初期状態修正
```
は、お気持ちとしてはまだ修正を加えたくなかったというのがあります。
これらはUIやビジネスロジックへの反映に近い部分なので、
```TypeScript
export interface RewriteRuleParams {
  oldString: string;
  newString: string;
  urlPattern: string;
  isRegex: boolean;
  isActive?: boolean = true; // 機能実装完了時には、必須化する
}
```
とすることで、上記3ファイルの修正をせずに済ませることはできないでしょうか？
---