# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=01
実装が完了したらPROGRESS-01-01.mdを追記してコードレビューを依頼してください
## スクラム-01(01回目) の進捗
<!-- ここに進捗を記載 -->

RewriteRule.idの型をstringからnumberに変更する作業を完了しました。

### 修正したファイル

- src/domain/entities/RewriteRule/RewriteRule.ts
- src/application/ports/IRewriteRuleRepository.ts
- src/domain/errors/RewriteRuleNotFoundError.ts
- src/application/usecases/rule/UpdateRewriteRuleUseCase.ts
- src/domain/value-objects/RewriteRules.ts
- src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository.ts
- src/infrastructure/persistance/indexeddb/DexieRewriteRuleRepository.ts
- src/application/usecases/rule/LoadRewriteRuleForEditUseCase.ts
- src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase.ts
- src/components/pages/EditRulePage.tsx
- tests/unit/application/usecases/rule/UpdateRewriteRuleUseCase/execute/normal-cases.test.ts
- tests/unit/domain/entities/RewriteRule/fromPlainObject/normal-cases.test.ts
- tests/unit/domain/entities/RewriteRule/fromPlainObject/error-cases.test.ts
- tests/unit/application/usecases/rule/LoadRewriteRuleForEditUseCase/execute/normal-cases.test.ts
- tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getById/error-cases.test.ts
- tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getById/Abend/error-cases.test.ts
- tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getById/normal-cases.test.ts

### 次回以降のスクラムに先送りする課題
<!-- 本issueで解決するが、本スクラムでは取り扱わない課題 -->

なし（本スクラムで予定していた作業は完了）

### 本issueの対象外とする課題

なし

### スクラム-01(01回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-daily-scrum-pass-review.md -->

---