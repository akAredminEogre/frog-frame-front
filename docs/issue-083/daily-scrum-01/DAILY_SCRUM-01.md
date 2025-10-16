# DAILY SCRUM-01回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
<!-- PLAN.mdの計画の中でどのユーザーストーリーに取り組むか記載してください。 -->
PLAN.mdの最初のタスク「プロダクションコード、テストコード、ドキュメント中のfavorite-keyword-link-frogをfrog-frame-frontに変更」に取り組みます。

具体的には、以下の作業を実施します:
1. プロダクションコード内の`favorite-keyword-link-frog`を`frog-frame-front`に一括置換
2. テストコード内の`favorite-keyword-link-frog`を`frog-frame-front`に一括置換
3. ドキュメント内の`favorite-keyword-link-frog`を`frog-frame-front`に一括置換
4. package.jsonなどの設定ファイル内のアプリ名を更新
5. 変更後の動作確認（ビルドやテストが通るか）

## 修正予定ファイル
<!-- 修正予定のファイルを記載してください。 -->
- プロダクションコード全般（`host-frontend-root/frontend-src-root/src/`配下）
- テストコード全般（`host-frontend-root/frontend-src-root/tests/`配下）
- ドキュメント全般（`docs/`配下）
- `host-frontend-root/frontend-src-root/package.json`
- `host-frontend-root/frontend-src-root/README.md`
- `host-frontend-root/frontend-src-root/wxt.config.ts`
- その他、アプリ名を参照している設定ファイル

## スクラム内残タスク
- [ ] プロダクションコード内の`favorite-keyword-link-frog`を`frog-frame-front`に一括置換
- [ ] テストコード内の`favorite-keyword-link-frog`を`frog-frame-front`に一括置換
- [ ] ドキュメント内の`favorite-keyword-link-frog`を`frog-frame-front`に一括置換
- [ ] package.jsonなどの設定ファイル内のアプリ名を更新
- [ ] 変更後の動作確認（ビルドやテストが通るか）

## 相談事項
<!-- workflow:01-create-daily-scrum-doc-after-coding.mdの場合は作成しない -->
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->
<!-- について、体言止めでの相談ではなににどう答えればよいのか明確にならないので使わないでください-->
<!-- 相談は具体的な内容を記載してください。 -->
<!-- 質問は不明点を明確に記載してください。 -->
<!-- レビューしてほしいことは、レビュー対象を具体的に記載してください。 -->
<!-- また上記相談・質問・レビューのトピックが重複する場合は、まとめて記載してください。 -->
<!-- ユーザーが使うコマンド: favorite-keyword-link-frog/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-discussion-then-start-coding.md-->

### アプリ名の一括置換を行う際の確認事項
一括置換を行う前に、以下の点を確認したいです:
1. `favorite-keyword-link-frog`という文字列が、コードの動作に影響を与える箇所（例：API名、データベーステーブル名、外部サービスとの連携など）に使われていないか確認が必要ですか？それとも、単純にアプリ名として使われているだけで、すべて置換して問題ないでしょうか？
  - APIやDB名にはなっていません。外部サービスとも連携していないので、単純にアプリ名として使われているだけです。置換して問題ないはずです
2. 一括置換の際、除外すべきファイルやディレクトリ（例：`.git`、`node_modules`、ビルド成果物など）はありますか？
  - 除外するというより、下記のディレクトリにしぼってまず行ってみて、うまく行かない点があれば追加するという方針で行ってみてください。
  - `host-frontend-root/frontend-src-root/src/`配下
  - `host-frontend-root/frontend-src-root/tests/`配下
  - `favorite-keyword-link-frog/host-frontend-root/frontend-src-root`直下の設定ファイル
  - `favorite-keyword-link-frog`直下の設定ファイル。特にDocker関係
3. 置換後、特に注意して動作確認すべき機能やテストはありますか？
  - 特にありません。最後にtest-and-lintを実行して、すべて通ればOKとします。

これらの点について確認した上で作業を進めたいと思います。

## 一言コメント
<!-- 感情ベースで一言コメントをお願いします。 -->
アプリ名の大規模な変更なので、影響範囲を慎重に確認しながら進めます！

# DAILY SCRUM-01作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

プロダクションコード、テストコード、ドキュメント中の`favorite-keyword-link-frog`を`frog-frame-front`に変更する作業を実施しました。

### 実施内容
1. コンテキストメニューのID、タイトル、parentIdを`favorite-keyword-link-frog`から`frog-frame-front`に変更
2. package.jsonのパッケージ名を`favorite-keyword-link-frog`から`frog-frame-front`に変更
3. package-lock.jsonを`npm install`により自動更新
4. 全テスト実行による動作確認（単体テスト、E2Eテスト、knip、TypeScriptコンパイル、ESLint）

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

## 修正したファイル
1. host-frontend-root/frontend-src-root/src/application/usecases/contextmenu/ContextMenuSetupUseCase.ts
2. host-frontend-root/frontend-src-root/package.json
3. host-frontend-root/frontend-src-root/package-lock.json (npm installにより自動更新)
