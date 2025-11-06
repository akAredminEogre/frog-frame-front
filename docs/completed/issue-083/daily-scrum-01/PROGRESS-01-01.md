# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

## スクラム-01(01回目) の進捗

プロダクションコード、テストコード、ドキュメント中の`frog-frame-front`を`frog-frame-front`に変更する作業を実施しました。

### 修正したファイル

1. **host-frontend-root/frontend-src-root/src/application/usecases/contextmenu/ContextMenuSetupUseCase.ts**
   - コンテキストメニューのID: `frog-frame-front-parent` → `frog-frame-front-parent`
   - コンテキストメニューのタイトル: `frog-frame-front` → `frog-frame-front`
   - サブメニューのparentId: `frog-frame-front-parent` → `frog-frame-front-parent`

2. **host-frontend-root/frontend-src-root/package.json**
   - パッケージ名: `frog-frame-front` → `frog-frame-front`

3. **host-frontend-root/frontend-src-root/package-lock.json**
   - `npm install`により自動更新

### テスト結果

- ✅ 単体テスト: 72ファイル、262テスト すべて成功
- ✅ E2Eテスト: 9テスト すべて成功
- ✅ knip: 未使用コードなし
- ✅ TypeScript コンパイル: 成功
- ✅ ESLint: 成功

### 次回以降のスクラムに先送りする課題

なし

### 本issueの対象外とする課題

なし

### スクラム-01(01回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド: frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド: frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow:daily-scrum-pass-review.md -->

---
