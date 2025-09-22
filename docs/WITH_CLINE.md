# ISSUE 単位
## ISSUE開始時
favorite-keyword-link-frog/.clinerules/02-workflow-automation/01-issue-launches/01-create-branch.mdに移管
workflow:create-branch

- ISSUE.mdの `# 概要` 、 `# 受け入れ条件` 、 `# タスク`(任意) を記載する

## ISSUE 開始時の指示
```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
issue-nnnを開始します。
まず、下記の内容でコミットしてください。
- 対象
  - docs/issue-nnn/ISSUE.md
- コミットメッセージ
  - docs: issue-nnnの開始時のドキュメント
次に、docs/issue-nnn/ISSUE.mdを参照して実装計画を立てPLAN.mdを作成してください。
```

```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
PLAN.mdのレビューが完了しました。
まず、下記の内容でコミットしてください。
- 対象：docs/issue-nnn/PLAN.md
- コミットメッセージ
  - docs: issue-nnnのPLAN.mdの作成、レビュー完了
```

# DAILY SCRUM単位
## DAILY SCRUM 開始時の指示
workflow:create-daily-scrumに移管

## DAILY_SCRUM-kk.md作成後の指示


```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
デイリースクラムの計画をレビューしました。
まず、下記の内容でコミットしてください。
- 対象
  - docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md
- コミットメッセージ
  - docs: デイリースクラムkk回目開始時のドキュメント

次に、DAILY_SCRUM-kk.mdの作業を開始してください。
実装が完了したら `favorite-keyword-link-frog/docs/issue-nnn/daily-scrum-00/PROGRESS-.md` のフォーマットに従って、favorite-keyword-link-frog/docs/issue-nnn/daily-scrum-kk/PROGRESS-kk.mdを追記してコードレビューを依頼してください
```

- コードレビューする
- ドキュメントをコミット
  - コミットメッセージ
    - docs: スクラムkk ii回目のコードレビュー

```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
ii=01
favorite-keyword-link-frog/docs/issue-nnn/daily-scrum-kk/PROGRESS-kk.md
に、
### スクラムkk-(ii回目) のレビューコメント
としてレビューコメントを記載しました。

その内容に沿って、修正を行ってください。
実装が完了したら `favorite-keyword-link-frog/docs/issue-nnn/daily-scrum-00/PROGRESS-.md` のフォーマットに従って、favorite-keyword-link-frog/docs/issue-nnn/daily-scrum-kk/PROGRESS-kk.mdに、ii=ii+1として、進捗を追記してコードレビューを依頼してください
```

## DAILY_SCRUM.md実装終了後

### 最初にプラン作成を指示しなかった時

favorite-keyword-link-frog/.clinerules/02-workflow-automation/03-daily-scrum-finishes/01-create-daily-scrum-doc-after-coding.mdに移管
workflow:create-daily-scrum-doc-after-coding

### 振り返り指示
favorite-keyword-link-frog/.clinerules/02-workflow-automation/03-daily-scrum-finishes/02-daily-scrum-pass-review-scrum.mdに移管
workflow:daily-scrum-pass-review

### コミット指示
favorite-keyword-link-frog/.clinerules/02-workflow-automation/03-daily-scrum-finishes/03-commit-daily-scrum.mdに移管
workflow:commit-daily-scrum


## PR作成前の確認
```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
docs/issue-nnn/ 以下のドキュメント群から変更されたファイルを取得し、それらが、.clinerules に従っていることを確認してください。
合致しない部分には、`TODO:` のコメントを入れてください
```

## PR作成時の指示

### PRテンプレートの作成
favorite-keyword-link-frog/.clinerules/02-workflow-automation/04-pull-request/01-create-pr-md.mdに移管
workflow:create-pr-md

### PR作成

`workflow:PR作成`

```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
PULL_REQUEST.mdのレビューが完了しました。
まず、下記の内容でコミットしてください。
- favorite-keyword-link-frog/docs/issue-nnn/PULL_REQUEST.md
  - コミットメッセージ
    - docs: PULL_REQUEST.mdの作成、レビュー完了
次に、docs/issue-nnn/PULL_REQUEST.mdをもとに、ghコマンドを使ってdevelopブランチにプルリクエストを作成してください。
- 現時点のブランチをpush
  - コミットされていない変更はそのまま
  - push先リポジトリ akAredminEogre/favorite-keyword-link-frog
- PRリクエスト作成
  - base branch: develop
  - title: `PULL REQUEST.md`の`## タイトル`を利用

コミットされていない変更はそのままで、プルリクエストを作成してください。
```
## PR変更時の指示

```
nnn=(カレントブランチ名からissue番号を取得)
issue-nnnのプルリクエストの本文を変更してください。

反映すべき内容：
favorite-keyword-link-frog/docs/issue-nnn/
以下のドキュメント群(ない場合はdevelopとの比較で変更があるもの)

従うべきフォーマット：
favorite-keyword-link-frog/docs/issue-000/PULL_REQUEST.md

保存先：
docs/issue-nnn/PULL_REQUEST.md
```

```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
変更後のPULL_REQUEST.mdのレビューが完了しました。
まず、下記の内容でコミットしてください。
- favorite-keyword-link-frog/docs/issue-nnn/PULL_REQUEST.md
  - コミットメッセージ
    - docs: PULL_REQUEST.mdの変更、レビュー完了
次に、docs/issue-nnn/PULL_REQUEST.mdをもとに、ghコマンドを使ってプルリクエストを変更してください。
- 現時点のブランチをpush
  - コミットされていない変更はそのまま
  - push先リポジトリ akAredminEogre/favorite-keyword-link-frog
- PRリクエスト変更
  - 変更後のPULL_REQUEST.mdの記述を、当該PRの説明文に上書き
```

## PRクローズ準備
- WITH_CLINE.md
  - 変更整理


## PRクローズ時の指示

`PRクローズ`

```
nnn=(カレントブランチ名からissue番号を取得)
pr_no=(カレントブランチが出しているプルリクエストの番号)
pr_noのプルリクエストをマージします。次の手順でマージしてください。
- ドキュメントテンプレートの削除
  - docs/issue-nnn/daily-scrum-00/ (本issue内のテンプレートのディレクトリ、番号がついているものは残す)を削除
    - コミットメッセージ
      - docs: issue-nnnのテンプレートファイルを削除
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
- developにチェックアウトし、pullする
```