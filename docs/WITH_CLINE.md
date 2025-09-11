# ISSUE 単位
## ISSUE開始時
```cline-instructions
issue番号の採番：
```
git checkout develop && git pull && \
git fetch --prune && git branch --list -a | grep 'origin/issue-*' | sort -r | head -n 1
```
nnn=(上記で表示されたブランチ名からissue番号+1を取得)
(cdコマンドでリポジトリルートに移動)
mkdir docs/issue-nnn/daily-scrum-00
を実行し、その後
issue-nnn-refactor-background
ブランチを作成してください
```

- ISSUE.mdの `# 概要` 、 `# 受け入れ条件` 、 `# タスク`(任意) を記載する

## ISSUE 開始時の指示
```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
issue-nnnを開始します。
まず、下記の内容でコミットしてください。
- 対象：変更中のファイルで、`WITH_CLINE.md`、`issues.md`を除くすべてのファイル
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
```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-mm(mは任意の数字)のディレクトリナンバーの最大数+1)
スクラムkk回目の作業を計画を立ててもらいます。
- 下記コマンドを実行
```bash
cd ~/akAredminEogre-project/favorite-keyword-link-frog/ && \
mkdir -p docs/issue-nnn/daily-scrum-kk/
```

- docs/issue-nnnのドキュメントを読み込み、スクラムkk回目の作業を計画を立てデイリースクラムを実施。
- その内容に基づき、favorite-keyword-link-frog/docs/issue-000/daily-scrum-00/DAILY_SCRUM-.mdのフォーマットに従って、docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.mdを作成してください。
- `## 相談事項` のセクションに記入があった場合は、その旨をチャットにも記入してください
```

## DAILY_SCRUM-kk.md作成後の指示

```cline-instructions
kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
デイリースクラムの計画をレビューしました。
まず、下記の内容でコミットしてください。
- 対象：変更中のファイルで、`WITH_CLINE.md`、`issues.md`を除くすべてのファイル
- コミットメッセージ
  - docs: デイリースクラムkk回目開始時のドキュメント
```

```cline-instructions
kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
DAILY_SCRUM-kk.mdの作業を開始してください。
実装が完了したら `favorite-keyword-link-frog/docs/issue-nnn/daily-scrum-00/PROGRESS-.md` のフォーマットに従って、favorite-keyword-link-frog/docs/issue-nnn/daily-scrum-kk/PROGRESS-kk.mdを追記してコードレビューを依頼してください
```

- コードレビューする
- ドキュメントをコミット
  - コミットメッセージ
    - docs: スクラムkk ii回目のコードレビュー

## DAILY_SCRUM.md実装終了後

### 最初にプラン作成を指示しなかった時
```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-mm(mは任意の数字)のディレクトリナンバーの最大数+1)
作業ありがとうございました。今回の作業を
スクラムkk回目として記録します。
まずディレクトリの作成とドキュメントテンプレートのコピー
を行います
- 下記コマンドを実行
```bash
cd ~/akAredminEogre-project/favorite-keyword-link-frog/ && \
mkdir -p docs/issue-nnn/daily-scrum-kk/
cp docs/issue-000/daily-scrum-00/DAILY_SCRUM-.md docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md
```

- 今回の作業内容に基づき、favorite-keyword-link-frog/docs/issue-000/daily-scrum-00/DAILY_SCRUM-.mdのフォーマットに従って、先ほどコピーしたdocs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.mdに記入してください。

```
```

- 人間がコードをコミット


### 指示
```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)
kk=(docs/issue-nnn/daily-scrum-ディレクトリの最大の番号)
ありがとうございました。今回の作業は終了にします。
下記の内容でコミットしてください。
- 対象：docs/issue-nnn/daily-scrum-kk/PROGRESS-kk.md
  - 存在しなければコミットはスキップ
- コミットメッセージ
  - docs: スクラムkk回目の進捗

次に、
docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md
をみながら振り返りを行い、PLAN.md/RETROSPECTIVE.md/DAILY_SCRUM.mdを更新してください
- PLAN.md
  - チェックリストの更新
- RETROSPECTIVE.md
  - スクラムkkの振り返りを記載
```
- 人間がドキュメントをコミット
  - コミットメッセージ
    - docs: スクラムkk回目の終了、振り返り


## PR作成前の確認
```cline-instructions
nnn=(カレントブランチ名からissue番号を取得)

現在のブランチと、現在のdevelopを比較し、変更内容が、CODING_STYLE.mdの `# オブジェクト指向ルール` に従っていることを確認してください。
合致しない部分には、`TODO:` のコメントを入れてください
```

## PR作成時の指示

```
nnn=(カレントブランチ名からissue番号を取得)
issue-nnnのプルリクエストの本文を作成してください。

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
## PRクローズ準備
- WITH_CLINE.md
  - 変更整理


## PRクローズ時の指示
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