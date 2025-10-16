# DAILY SCRUM-02回目
# DAILY SCRUM-作業計画
<!-- 作業計画は作業前のみ記入 -->

## 本スクラムの作業予定
<!-- PLAN.mdの計画の中でどのユーザーストーリーに取り組むか記載してください。 -->
PLAN.mdの最初のタスクの続きとして、`.clinerules`と`docs`ディレクトリ内の`frog-frame-front`を`frog-frame-front`に変更します。

具体的には、以下の作業を実施します:
1. `.clinerules`ディレクトリ内のMarkdownファイルで`frog-frame-front`を`frog-frame-front`に一括置換
2. `docs`ディレクトリ内のMarkdownファイルで`frog-frame-front`を`frog-frame-front`に一括置換
3. 変更後の動作確認（ドキュメントの整合性確認）

スクラム01回目では、プロダクションコード（package.json、コンテキストメニューのID等）の変更を実施しました。
今回は、ドキュメントとワークフロールールの文言を統一します。

## 修正予定ファイル
<!-- 修正予定のファイルを記載してください。 -->
- `frog-frame-front/.clinerules/`配下の全Markdownファイル
- `frog-frame-front/docs/`配下の全Markdownファイル

## スクラム内残タスク
- [ ] `.clinerules`ディレクトリ内のMarkdownファイルで`frog-frame-front`を`frog-frame-front`に一括置換
- [ ] `docs`ディレクトリ内のMarkdownファイルで`frog-frame-front`を`frog-frame-front`に一括置換
- [ ] 変更後の動作確認（ドキュメントの整合性確認）

## 相談事項
<!-- workflow:01-create-daily-scrum-doc-after-coding.mdの場合は作成しない -->
<!-- 相談したいこと、質問したいこと、レビューしてほしいこと -->
<!-- について、体言止めでの相談ではなににどう答えればよいのか明確にならないので使わないでください-->
<!-- 相談は具体的な内容を記載してください。 -->
<!-- 質問は不明点を明確に記載してください。 -->
<!-- レビューしてほしいことは、レビュー対象を具体的に記載してください。 -->
<!-- また上記相談・質問・レビューのトピックが重複する場合は、まとめて記載してください。 -->
<!-- ユーザーが使うコマンド: frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-discussion-then-start-coding.md-->

### ドキュメントとワークフロールールの文言変更について
`.clinerules`と`docs`ディレクトリ内のMarkdownファイルで`frog-frame-front`を`frog-frame-front`に一括置換を行う予定です。

1. **置換対象ディレクトリ**
   - `frog-frame-front/.clinerules/`配下の全Markdownファイル
   - `frog-frame-front/docs/`配下の全Markdownファイル

2. **置換内容**
   - 文字列: `frog-frame-front` → `frog-frame-front`

3. **除外条件**
   - ディレクトリ名やファイルパスは除外（あくまでファイル内容の文言のみ変更）

この方針で問題ないか確認したいです。また、一括置換後に特に確認すべきドキュメントがあれば教えてください。

→問題ありません。この方針で進めてください。特に確認すべきドキュメントはありません。

## 一言コメント
<!-- 感情ベースで一言コメントをお願いします。 -->
ドキュメントとワークフロールールの文言を統一して、プロジェクト全体の整合性を高めます！

# DAILY SCRUM-02作業実績
## 本スクラムでの作業実績内容
<!-- 本スクラムでの作業内容を記載してください。 -->
<!-- 結果的に不要になった作業や試行錯誤は記述しないでください -->

`.clinerules`と`docs`ディレクトリ内のMarkdownファイルで`favorite-keyword-link-frog`を`frog-frame-front`に一括置換を実施しました。

1. `.clinerules`ディレクトリ内のMarkdownファイル（16ファイル）で文言置換
2. `docs`ディレクトリ内のMarkdownファイル（129ファイル）で文言置換
3. テスト&リントの実行
   - 単体テスト: 262個すべて成功 ✅
   - Knip（未使用コード検出）: 問題なし ✅
   - E2Eテスト: 7個成功、2個失敗 ⚠️

### E2Eテスト失敗について

以下の2つのE2Eテストが失敗していますが、今回の変更（ドキュメントの文言置換のみ）とは無関係な既存問題です：

1. `edit-page.spec.ts:8:1` - 正規表現で取得した値をタグ内に埋め込んだルールが、一覧に表示され、編集できる
2. `edit-page.spec.ts:186:1` - 編集画面でキャンセルボタンをクリックすると、ポップアップが閉じる

今回の変更はドキュメント（Markdownファイル）のみで、プロダクションコードには一切変更を加えていません。

## 修正したファイル

#### .clinerules配下（16ファイル）
- `.clinerules/02-workflow-automation/01-issue-launches/workflow:commit-plan-then-start-daily-issue.md`
- `.clinerules/02-workflow-automation/01-issue-launches/workflow:create-plan-with-issue.md`
- `.clinerules/02-workflow-automation/02-daily-scrum-starts/test-and-lint-before-complete.md`
- `.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:create-daily-scrum.md`
- `.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:record-progress.md`
- `.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-and-commit-review-comment-then-code-again.md`
- `.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-discussion-then-start-coding.md`
- `.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:start-coding-according-to-daily-scrum.md`
- `.clinerules/02-workflow-automation/03-daily-scrum-finishes/01-create-daily-scrum-doc-after-coding.md`
- `.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow:daily-scrum-pass-review.md`
- `.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow:record-progress-after-coding.md`
- `.clinerules/02-workflow-automation/04-pull-request/01-create-pr-md.md`
- `.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md`
- `.clinerules/02-workflow-automation/04-pull-request/workflow:re-submit-pull-request.md`
- `.clinerules/02-workflow-automation/04-pull-request/workflow:update-pr-md.md`
- `.clinerules/05-project-specific-rules.md`

#### docs配下（129ファイル）
- `docs/WITH_CLINE.md`
- `docs/completed/issue-001/DAILY_SCRUM.md`
- `docs/completed/issue-001/ISSUE.md`
- `docs/completed/issue-002/DAILY_SCRUM.md`
- `docs/completed/issue-003/PLAN.md`
- `docs/completed/issue-003/daily-scrum-02/DAILY_SCRUM-02.md`
- `docs/completed/issue-003/daily-scrum-02/PROGRESS-02.md`
- `docs/completed/issue-003/daily-scrum-03/DAILY_SCRUM-03.md`
- `docs/completed/issue-003/daily-scrum-03/PROGRESS-03.md`
- `docs/completed/issue-003/daily-scrum-04/DAILY_SCRUM-04.md`
- `docs/completed/issue-003/daily-scrum-04/PROGRESS-04.md`
- `docs/completed/issue-003/daily-scrum-05/DAILY_SCRUM-05.md`
- `docs/completed/issue-003/daily-scrum-05/PROGRESS-05.md`
- `docs/completed/issue-004/daily-scrum-01/DAILY_SCRUM-01.md`
- `docs/completed/issue-004/daily-scrum-01/PROGRESS-01.md`
- `docs/completed/issue-005/daily-scrum-02/DAILY_SCRUM-02.md`
- `docs/completed/issue-005/daily-scrum-02/PROGRESS-02.md`
- `docs/completed/issue-005/daily-scrum-03/DAILY_SCRUM-03.md`
- `docs/completed/issue-008/PLAN.md`
- `docs/completed/issue-009/PULL_REQUEST.md`
- `docs/completed/issue-010/PLAN.md`
- `docs/completed/issue-010/daily-scrum-01/DAILY_SCRUM-01.md`
- `docs/completed/issue-011/PLAN.md`
- `docs/completed/issue-011/PULL_REQUEST.md`
- `docs/completed/issue-027/PULL_REQUEST.md`
- `docs/completed/issue-031/PULL_REQUEST.md`
- `docs/completed/issue-032/PULL_REQUEST.md`
- `docs/completed/issue-032/daily-scrum-01/DAILY_SCRUM-01.md`
- `docs/completed/issue-033/PULL_REQUEST.md`
- `docs/completed/issue-034/PULL_REQUEST.md`
- `docs/completed/issue-034/daily-scrum-01/DAILY_SCRUM-01.md`
- `docs/completed/issue-035/PULL_REQUEST.md`
- `docs/completed/issue-035/daily-scrum-01/DAILY_SCRUM-01.md`
- `docs/completed/issue-035/daily-scrum-02/DAILY_SCRUM-02.md`
- `docs/completed/issue-043/PULL_REQUEST.md`
- `docs/completed/issue-047/daily-scrum-02/PROGRESS-02.md`
- `docs/completed/issue-051/daily-scrum-02/DAILY_SCRUM-02.md`
- `docs/completed/issue-052/ISSUE.md`
- `docs/completed/issue-052/PLAN.md`
- `docs/completed/issue-052/PULL_REQUEST.md`
- `docs/completed/issue-052/daily-scrum-02/PROGRESS-02.md`
- `docs/completed/issue-052/daily-scrum-03/DAILY_SCRUM-03.md`
- `docs/completed/issue-052/daily-scrum-03/PROGRESS-03.md`
- `docs/completed/issue-052/daily-scrum-04/PROGRESS-04-01.md`
- `docs/completed/issue-052/daily-scrum-05/PROGRESS-05-01.md`
- `docs/completed/issue-052/daily-scrum-05/PROGRESS-05-02.md`
- `docs/completed/issue-052/daily-scrum-05/PROGRESS-05-05.md`
- `docs/completed/issue-052/daily-scrum-05/PROGRESS-05-06.md`
- `docs/completed/issue-059/daily-scrum-01/PROGRESS-01-01.md`
- `docs/completed/issue-059/daily-scrum-01/PROGRESS-01-06.md`
- `docs/completed/issue-059/daily-scrum-01/PROGRESS-01-07.md`
- `docs/completed/issue-059/daily-scrum-01/PROGRESS-01-08.md`
- `docs/completed/issue-059/daily-scrum-02/DAILY_SCRUM-02.md`
- `docs/completed/issue-060/PULL_REQUEST.md`
- `docs/completed/issue-060/daily-scrum-02/PROGRESS-02-02.md`
- `docs/completed/issue-061/PULL_REQUEST.md`
- `docs/completed/issue-065/PLAN.md`
- `docs/completed/issue-065/daily-scrum-02/PROGRESS-02-08.md`
- `docs/completed/issue-065/daily-scrum-02/PROGRESS-02-09.md`
- `docs/completed/issue-065/daily-scrum-02/PROGRESS-02-11.md`
- `docs/completed/issue-065/daily-scrum-02/PROGRESS-02-12.md`
- `docs/completed/issue-065/daily-scrum-02/PROGRESS-02-13.md`
- `docs/completed/issue-065/daily-scrum-02/PROGRESS-02-14.md`
- `docs/completed/issue-065/daily-scrum-02/PROGRESS-02-15.md`
- `docs/completed/issue-065/daily-scrum-03/PROGRESS-03-01.md`
- `docs/completed/issue-065/daily-scrum-03/PROGRESS-03-04.md`
- `docs/completed/issue-065/daily-scrum-03/PROGRESS-03-05.md`
- `docs/completed/issue-065/daily-scrum-03/PROGRESS-03-07.md`
- `docs/completed/issue-065/daily-scrum-03/PROGRESS-03-08.md`
- `docs/completed/issue-065/daily-scrum-04/DAILY_SCRUM-04.md`
- `docs/completed/issue-065/daily-scrum-04/PROGRESS-04-02.md`
- `docs/completed/issue-065/daily-scrum-04/PROGRESS-04-04.md`
- `docs/completed/issue-065/daily-scrum-04/PROGRESS-04-07.md`
- `docs/completed/issue-065/daily-scrum-04/PROGRESS-04-10.md`
- `docs/completed/issue-065/daily-scrum-05/PROGRESS-05-01.md`
- `docs/completed/issue-065/daily-scrum-05/PROGRESS-05-02.md`
- `docs/completed/issue-065/daily-scrum-05/PROGRESS-05-03.md`
- `docs/completed/issue-065/daily-scrum-10/PROGRESS-10-01.md`
- `docs/completed/issue-065/daily-scrum-10/PROGRESS-10-02.md`
- `docs/completed/issue-065/daily-scrum-10/PROGRESS-10-03.md`
- `docs/completed/issue-065/daily-scrum-11/PROGRESS-11-01.md`
- `docs/completed/issue-065/daily-scrum-11/PROGRESS-11-02.md`
- `docs/completed/issue-065/daily-scrum-11/PROGRESS-11-04.md`
- `docs/completed/issue-065/daily-scrum-11/PROGRESS-11-05.md`
- `docs/completed/issue-065/daily-scrum-11/PROGRESS-11-06.md`
- `docs/completed/issue-065/daily-scrum-11/PROGRESS-11-07.md`
- `docs/completed/issue-065/daily-scrum-11/PROGRESS-11-08.md`
- `docs/completed/issue-065/daily-scrum-11/PROGRESS-11-09.md`
- `docs/completed/issue-065/daily-scrum-12/DAILY_SCRUM-12.md`
- `docs/completed/issue-065/daily-scrum-12/PROGRESS-12-01.md`
- `docs/completed/issue-065/daily-scrum-12/PROGRESS-12-02.md`
- `docs/completed/issue-065/daily-scrum-12/PROGRESS-12-03.md`
- `docs/completed/issue-065/daily-scrum-12/PROGRESS-12-04.md`
- `docs/completed/issue-065/daily-scrum-12/PROGRESS-12-05.md`
- `docs/completed/issue-065/daily-scrum-12/PROGRESS-12-06.md`
- `docs/completed/issue-065/daily-scrum-12/PROGRESS-12-07.md`
- `docs/completed/issue-065/daily-scrum-12/PROGRESS-12-08.md`
- `docs/completed/issue-065/daily-scrum-12/PROGRESS-12-09.md`
- `docs/completed/issue-065/daily-scrum-14/PROGRESS-14-01.md`
- `docs/completed/issue-065/daily-scrum-15/PROGRESS-15-01.md`
- `docs/completed/issue-069/daily-scrum-01/PROGRESS-01-01.md`
- `docs/completed/issue-069/daily-scrum-01/PROGRESS-01-02.md`
- `docs/completed/issue-081/RETROSPECTIVE.md`
- `docs/completed/issue-081/daily-scrum-01/DAILY_SCRUM-01.md`
- `docs/completed/issue-081/daily-scrum-01/PROGRESS-01-01.md`
- `docs/completed/issue-081/daily-scrum-01/PROGRESS-01-02.md`
- `docs/completed/issue-081/daily-scrum-02/PROGRESS-02-01.md`
- `docs/completed/issue-081/daily-scrum-03/DAILY_SCRUM-03.md`
- `docs/completed/issue-081/daily-scrum-03/PROGRESS-03-01.md`
- `docs/completed/issue-081/daily-scrum-03/PROGRESS-03-02.md`
- `docs/completed/issue-081/daily-scrum-03/PROGRESS-03-03.md`
- `docs/completed/issue-081/daily-scrum-04/DAILY_SCRUM-04.md`
- `docs/completed/issue-081/daily-scrum-04/PROGRESS-04-01.md`
- `docs/completed/issue-081/daily-scrum-05/DAILY_SCRUM-05.md`
- `docs/completed/issue-081/daily-scrum-05/PROGRESS-05-01.md`
- `docs/completed/issue-081/daily-scrum-05/PROGRESS-05-02.md`
- `docs/completed/issue-081/daily-scrum-06/DAILY_SCRUM-06.md`
- `docs/completed/issue-081/daily-scrum-06/PROGRESS-06-01.md`
- `docs/completed/issue-082/daily-scrum-01/PROGRESS-01-01.md`
- `docs/completed/issue-082/daily-scrum-01/PROGRESS-01-02.md`
- `docs/completed/issue-082/daily-scrum-01/PROGRESS-01-03.md`
- `docs/completed/issue-082/daily-scrum-01/PROGRESS-01-04.md`
- `docs/completed/issue-082/daily-scrum-01/PROGRESS-01-05.md`
- `docs/issue-000/RETROSPECTIVE.md`
- `docs/issue-000/daily-scrum-00/DAILY_SCRUM-.md`
- `docs/issue-000/daily-scrum-00/PROGRESS-.md`
- `docs/issue-083/ISSUE.md`
- `docs/issue-083/PLAN.md`
- `docs/issue-083/RETROSPECTIVE.md`
- `docs/issue-083/daily-scrum-01/DAILY_SCRUM-01.md`
- `docs/issue-083/daily-scrum-01/PROGRESS-01-01.md`
- `docs/issue-083/daily-scrum-02/DAILY_SCRUM-02.md`
