# ISSUE 単位
## ISSUE開始時：人間
- issue-nnnディレクトリを作成する
- ISSUE.mdの `# 概要` 、 `# 受け入れ条件` 、 `# タスク`(任意) を記載する

## ISSUE 開始時の指示
```
nnn=
issue-nnnを開始します。PLANモードでdocs/issue-nnn/ISSUE.mdを参照して実装計画を立てPLAN.mdを作成してください。
``` 

# DAILY SCRUM単位
## DAILY SCRUM 開始時の指示
```
nnn=
kk=
スクラムkk回目の作業を計画を立ててもらいます。

- favorite-keyword-link-frog/docs/issue-/daily-scrum-をコピーして、docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kkディレクトリを作成
- docs/issue-nnnのドキュメントを読み込み、スクラムkk回目の作業を計画を立てデイリースクラムを実施。
- その内容に基づき、favorite-keyword-link-frog/docs/issue-/daily-scrum-/DAILY_SCRUM-kk.mdのフォーマットに従って、docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.mdを作成してください。
```

## DAILY_SCRUM-kk.md作成後の指示
- ドキュメントをコミット
```
kk=05
ACTモードに切り替えて作業を開始してください。実装が完了したらPROGRESS-kk.mdを追記してコードレビューを依頼してください
```

- コードレビューする

## DAILY_SCRUM.md実装終了後

- 人間がコードをコミット

### 指示
```
kk=05
ありがとうございました。今回の作業は終了にします。振り返りを行い、PLAN.md/RETROSPECTIVE.md/DAILY_SCRUM.mdを更新してください
- PLAN.md
  - チェックリストの更新
- RETROSPECTIVE.md
  - スクラムkkの振り返りを記載
- DAILY_SCRUM-kk.md
  - チェックリストを更新
```
- 人間がドキュメントをコミット

## PR作成時の指示

```
nnn=
issue-nnnのプルリクエストの本文を作成し、docs/issue-nnn/PULL_REQUEST.mdに保存してください。
```

```
nnn=003
docs/issue-nnn/PULL_REQUEST.mdをもとに、ghコマンドを使ってdevelopブランチにプルリクエストを作成してください。

コミットされていない変更はそのままで、プルリクエストを作成してください。
```

## PRクローズ時の指示
```
nnn=
pr_no=
pr_noのプルリクエストをマージします。次の手順でマージしてください。
- issue-nnnのディレクトリを、completed/issue-nnnに移動する
- 現在のブランチで残っている変更をすべてコミットしてプッシュ
  - コミットメッセージは「issue-nnn: プルリクエストの内容を反映」
- プルリクエストを`create a merge commit`でマージする
```