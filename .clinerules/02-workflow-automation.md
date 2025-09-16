# ワークフロー自動化ルール

# ISSUE 単位

## ISSUE開始時

### Issue番号採番 & ブランチ作成ワークフロー

issue番号の採番からブランチ作成まで以下の手順で実行します：

#### 1. Issue番号採番

```bash
git checkout develop && git pull && \
git fetch --prune && git branch --list -a | grep 'origin/issue-*' | sort -r | head -n 1
```

上記で表示されたブランチ名からissue番号+1を計算してnnn（例：049）とします。

#### 2. ディレクトリ作成

```bash
# cdコマンドでリポジトリルートに移動（必要に応じて）
mkdir -p docs/issue-nnn/daily-scrum-00
```

#### 3. ブランチ作成

```bash
# issue-nnn-{機能名}でブランチを作成
git checkout -b issue-nnn-feat-your-feature-name
```

**機能名の例：**
- `feat-ts-syringe` - TypeScript DIライブラリ機能追加
- `fix-bug-login` - ログイン関連のバグ修正
- `feat-api-enhancement` - API機能拡張
- `refactor-database` - データベース構造のリファクタリング

#### 実行例

最新issueが048だった場合：

```bash
# 1. 最新issue番号確認
git checkout develop && git pull && \
git fetch --prune && git branch --list -a | grep 'origin/issue-*' | sort -r | head -n 1
# → origin/issue-048-xxx が表示される

# 2. ディレクトリ作成（次の番号049で）
mkdir -p docs/issue-049/daily-scrum-00

# 3. ブランチ作成（機能名を適切に設定）
git checkout -b issue-049-feat-authentication
```

## ISSUE 開始時の指示

（将来的に追加予定）

# DAILY SCRUM単位

## DAILY SCRUM 開始時の指示

（将来的に追加予定）

## DAILY_SCRUM-kk.md作成後の指示

（将来的に追加予定）



## DAILY_SCRUM.md実装終了後
### 最初にプラン作成を指示しなかった時





## プロジェクト固有の品質チェック

### タスク完了確認

「タスク完了確認」と入力された場合、以下のプロジェクト固有チェックを実行します：

```cline-instructions
タスクの最終確認を行います。まず、プロジェクト固有の未使用コードチェックを実行してください。

# プロジェクト固有の未使用コードチェック
(cd で絶対パスでfavorite-keyword-link-frogに移動) && \
docker compose exec frontend npm run unused:safe

エラーや未使用コードが検出された場合は、修正してから再度チェックを実行してください。
すべてのチェックが正常に完了したら、タスクが完了したことを報告してください。
```

#### 処理詳細

1. **未使用コードチェック実行**
   - `npm run unused:safe` コマンドを実行
   - エラーや未使用コードの検出

2. **エラー対応**
   - 検出された問題の修正
   - 修正後の再チェック

3. **完了確認**
   - すべてのチェックが正常に完了した場合のみタスク完了とする

#### 使用方法

タスク作業完了時に以下を入力：

```
タスク完了確認
```

この一言で自動的にプロジェクト固有の品質チェックが実行されます。

## デイリースクラムレビュー通過時の指示

### デイリースクラムレビュー通過

「デイリースクラムレビュー通過」と入力された場合、以下の自動化処理を実行します：

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
  - チェックリストの更新(なければスキップ)
- RETROSPECTIVE.md
  - スクラムkkの振り返りを記載
```

#### 処理詳細

1. **パラメータ自動取得**
   - `nnn`: カレントブランチ名からissue番号を自動取得
   - `kk`: docs/issue-nnn/daily-scrum-ディレクトリ内の最大番号を取得

2. **コミット処理**
   - 対象ファイル: `docs/issue-nnn/daily-scrum-kk/PROGRESS-kk.md`
   - ファイルが存在しない場合はコミットをスキップ
   - コミットメッセージ: `docs: スクラムkk回目の進捗`

3. **振り返り処理**
   - `docs/issue-nnn/daily-scrum-kk/DAILY_SCRUM-kk.md`の内容を参照
   - 以下のファイルを更新:
     - `PLAN.md`: チェックリストの更新（存在する場合のみ）
     - `RETROSPECTIVE.md`: スクラムkkの振り返りを記載
     - `DAILY_SCRUM.md`: 必要に応じて更新

#### 使用方法

デイリースクラム作業完了時に以下を入力：

```
デイリースクラムレビュー通過
```

この一言で自動的に全ての終了処理が実行されます。

## PR作成前の確認

### PR作成前確認

「PR作成前確認」と入力された場合、以下の自動化処理を実行します：

```cline-instructions
プルリクエスト作成前の最終確認を行います。

1. プロジェクト固有の未使用コードチェック：
   (cd で絶対パスでfavorite-keyword-link-frogに移動) && \
   docker compose exec frontend npm run unused:safe

2. その他の品質チェック：
   - コンパイルエラーの確認
   - テストの実行確認
   - 必要なドキュメントの更新確認

すべてのチェックが正常に完了したら、PR作成準備が完了したことを報告してください。
エラーがある場合は、修正してから再度確認を実行してください。
```

#### 使用方法

PR作成準備時に以下を入力：

```
PR作成前確認
```

## PR作成時の指示

### PULL_REQUEST.md作成

「PULL_REQUEST.md作成」と入力された場合、以下の自動化処理を実行します：

```cline-instructions
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

#### 処理詳細

1. **パラメータ自動取得**
   - `nnn`: カレントブランチ名からissue番号を自動取得

2. **内容収集と分析**
   - `docs/issue-nnn/` ディレクトリ内の全ドキュメントを確認
   - ドキュメントが存在しない場合は、developブランチとの比較で変更内容を分析
   - ISSUE.md、PLAN.md、DAILY_SCRUM-*.md、RETROSPECTIVE.md等を参照

3. **PULL_REQUEST.md作成**
   - `docs/issue-000/PULL_REQUEST.md` のテンプレート形式に従って作成
   - タイトル、概要、主な変更点、テスト方法等を自動生成
   - 保存先: `docs/issue-nnn/PULL_REQUEST.md`

#### 使用方法

PR作成準備時に以下を入力：

```
PULL_REQUEST.md作成
```

この一言で自動的にissue番号を取得し、関連ドキュメントを分析してPULL_REQUEST.mdを生成します。

#### 自動生成される内容

- **タイトル**: issue番号と機能名から自動生成
- **概要と理由**: ISSUE.mdやPLAN.mdの内容から抽出
- **主な変更点**: DAILY_SCRUM-*.mdやコード変更履歴から分析
- **テスト方法**: 標準テンプレートに加えて必要な確認手順を追加
- **補足**: RETROSPECTIVE.mdや重要な議論ポイントから抽出
- **対象外タスク**: 未完了や次回対応予定の内容をリストアップ

### PR作成

「workflow:PR作成」と入力された場合、以下の自動化処理を実行します：

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

#### 処理詳細

1. **パラメータ自動取得**
   - `nnn`: カレントブランチ名からissue番号を自動取得

2. **コミット処理**
   - 対象ファイル: `docs/issue-nnn/PULL_REQUEST.md`
   - コミットメッセージ: `docs: PULL_REQUEST.mdの作成、レビュー完了`

3. **ブランチpush**
   - 現在のブランチを `akAredminEogre/favorite-keyword-link-frog` にpush
   - コミットされていない変更は保持

4. **プルリクエスト作成**
   - `gh pr create` コマンドを使用
   - base branch: `develop`
   - title: `docs/issue-nnn/PULL_REQUEST.md` の `## タイトル` セクションから取得
   - body: `docs/issue-nnn/PULL_REQUEST.md` の内容を使用

#### 使用方法

PULL_REQUEST.mdのレビュー完了後に以下を入力：

```
workflow:PR作成
```

この一言で自動的にコミット、push、プルリクエスト作成が実行されます。

#### 前提条件

- `docs/issue-nnn/PULL_REQUEST.md` が存在すること
- GitHub CLIツール (`gh`) がインストール・認証済みであること
- 適切なリポジトリアクセス権限があること

## PR変更時の指示

（将来的に追加予定）

## PRクローズ準備

（将来的に追加予定）

## PRクローズ時の指示

### PRクローズ

「PRクローズ」と入力された場合、以下の自動化処理を実行します：

```cline-instructions
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

#### 処理詳細

1. **パラメータ自動取得**
   - `nnn`: カレントブランチ名からissue番号を自動取得
   - `pr_no`: カレントブランチが出しているプルリクエスト番号を自動取得

2. **テンプレートファイル削除**
   - 対象: `docs/issue-nnn/daily-scrum-00/` ディレクトリ
   - 番号付きディレクトリ（daily-scrum-01, daily-scrum-02等）は保持
   - コミットメッセージ: `docs: issue-nnnのテンプレートファイルを削除`

3. **ドキュメントファイルコミット**
   - `issues.md`: コミットされていない変更があればコミット
     - コミットメッセージ: `docs: 新規・追加・残タスク`
   - `WITH_CLINE.md`: コミットされていない変更があればコミット
     - コミットメッセージ: `docs: CLINEへの指示改善`

4. **issueディレクトリ移動**
   - `docs/issue-nnn/` → `docs/completed/issue-nnn/` に移動

5. **最終コミット・プッシュ**
   - 残っている変更をすべてコミット
   - コミットメッセージ: `issue-nnn: プルリクエストの内容を反映`
   - ブランチをプッシュ

6. **プルリクエストマージ**
   - `gh pr merge` コマンドを使用
   - `--merge` オプションで `create a merge commit` を指定

7. **develop切り替え**
   - `git checkout develop`
   - `git pull` でローカルを最新に更新

#### 使用方法

プルリクエストのマージ準備が完了した際に以下を入力：

```
PRクローズ
```

この一言で自動的に全てのクローズ処理が実行されます。

#### 前提条件

- カレントブランチからプルリクエストが作成済みであること
- GitHub CLIツール (`gh`) がインストール・認証済みであること
- 適切なリポジトリアクセス権限があること
- マージ権限があること

---

### 注意事項

- developブランチからの分岐を前提とします
- issue番号は3桁のゼロパディング形式（001, 002, 048など）を想定
- リモートリポジトリとの同期が前提です
- 機能名には英数字、ハイフン、アンダースコアの使用を推奨します
- 既存のブランチやディレクトリとの重複は事前に確認してください
