# ISSUE 単位
## ISSUE開始時
```cline-instructions
nnn=011
cd ~/akAredminEogre-project/favorite-keyword-link-frog/ && \
cp -r docs/issue- docs/issue-nnn
を実行し、その後
issue-nnn-test-e2e-dom-replace
ブランチを作成してください
```

- ISSUE.mdの `# 概要` 、 `# 受け入れ条件` 、 `# タスク`(任意) を記載する
- ドキュメントをコミット
  - コミットメッセージ
    - docs: issue-開始時のドキュメント

## ISSUE 開始時の指示
```
nnn=(カレントブランチ名からissue番号を取得)
issue-nnnを開始します。PLANモードでdocs/issue-nnn/ISSUE.mdを参照して実装計画を立てPLAN.mdを作成してください。
```

- ドキュメントをコミット
  - コミットメッセージ
    - docs: issue-のPLAN.mdを作成

# DAILY SCRUM単位
## DAILY SCRUM 開始時の指示
```
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-ディレクトリの数+1)
スクラムkk回目の作業を計画を立ててもらいます。

- favorite-keyword-link-frog/docs/issue-/daily-scrum-をコピーして、docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kkディレクトリを作成
- docs/issue-nnnのドキュメントを読み込み、スクラムkk回目の作業を計画を立てデイリースクラムを実施。
- その内容に基づき、favorite-keyword-link-frog/docs/issue-/daily-scrum-/DAILY_SCRUM-kk.mdのフォーマットに従って、docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.mdを作成してください。
```

## DAILY_SCRUM-kk.md作成後の指示
- ドキュメントをコミット
  - コミットメッセージ
    - docs: デイリースクラムkk回目開始時のドキュメント
```
kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
ACTモードに切り替えて、DAILY_SCRUM-kk.mdの作業を開始してください。
実装が完了したらPROGRESS-kk.mdのフォーマットに従って、PROGRESS-kk.mdを追記してコードレビューを依頼してください
```

- コードレビューする
- ドキュメントをコミット
  - コミットメッセージ
    - docs: issue-のスクラムkk 回目のコードレビュー

## DAILY_SCRUM.md実装終了後

- 人間がコードをコミット
  - コミットメッセージ
    - docs: スクラムkk回目の進捗


### 指示
```
kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
ありがとうございました。今回の作業は終了にします。振り返りを行い、PLAN.md/RETROSPECTIVE.md/DAILY_SCRUM.mdを更新してください
- PLAN.md
  - チェックリストの更新
- RETROSPECTIVE.md
  - スクラムkkの振り返りを記載
- DAILY_SCRUM-kk.md
  - チェックリストを更新
```
- 人間がドキュメントをコミット
  - コミットメッセージ
    - docs: スクラムkk回目の終了、振り返り

## PR作成時の指示

```
nnn=(カレントブランチ名からissue番号を取得)
issue-nnnのプルリクエストの本文を作成してください。

反映すべき内容：
favorite-keyword-link-frog/docs/issue-nnn/
以下のドキュメント群

従うべきフォーマット：
favorite-keyword-link-frog/docs/issue-/PULL_REQUEST.md

保存先：
docs/issue-nnn/PULL_REQUEST.md
```

- ドキュメントをコミット
  - コミットメッセージ
    - docs: PULL_REQUEST.mdを作成

```
nnn=(カレントブランチ名からissue番号を取得)
docs/issue-nnn/PULL_REQUEST.mdをもとに、ghコマンドを使ってdevelopブランチにプルリクエストを作成してください。
- 現時点のブランチをpush
  - コミットされていない変更はそのまま
  - push先リポジトリ akAredminEogre/favorite-keyword-link-frog
- PRリクエスト作成
  - base branch: develop
  - title: `PULL REQUEST.md`の`## タイトル`を利用

コミットされていない変更はそのままで、プルリクエストを作成してください。
```
## PRクローズ準備
- WITH_CLINE.md
  - 変更整理


## PRクローズ時の指示
```
nnn=(カレントブランチ名からissue番号を取得)
pr_no=(カレントブランチが出しているプルリクエストの番号)
pr_noのプルリクエストをマージします。次の手順でマージしてください。
- 下記のファイルでコミットされていない物があればコミット
  - issues.md
    - コミットメッセージ
      - docs: 新規・追加・残タスク
  - WITH_CLINE.md
    - コミットメッセージ
      - docs: CLINEへの指示改善
- issue-nnnのディレクトリを、completed/issue-nnnに移動する
- 現在のブランチで残っている変更があればすべてコミットしてプッシュ
  - コミットメッセージは「issue-nnn: プルリクエストの内容を反映」
- プルリクエストを`create a merge commit`でマージする
```