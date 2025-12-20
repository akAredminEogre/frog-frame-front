workflow-ccw-merge-pull-request

Claude Code Web版のプルリクエストマージワークフローです。
ghコマンドが使用できないため、一部の作業は手動で行う必要があります。

```cline-instructions
## Claude Code Web PRマージワークフロー

### 1. Issue番号の取得
- nnn=$(scripts/.clinerules/get-issue-number.sh)
  - 取得できない場合は、ブランチ名からissue番号を推測してください

### 2. マージ前定型作業（自動実行可能）

#### 2.1 ドキュメントテンプレートの削除
- docs/issue-nnn/daily-scrum-00/ を削除（番号がついているものは残す）
- コミットメッセージ: `docs: issue-nnnのテンプレートファイルを削除`

#### 2.2 残ファイルコミット
- issues.md がコミットされていなければコミット
  - コミットメッセージ: `docs: 新規・追加・残タスク`

#### 2.3 issue-nnnのディレクトリ移動
- docs/issue-nnn/ を docs/completed/issue-nnn/ に移動

#### 2.4 残っている変更のコミット＆プッシュ
- すべての変更をコミット
  - コミットメッセージ: `issue-nnn: プルリクエストの内容を反映`
- git push origin <ブランチ名>

### 3. PRのマージ（手動操作が必要）

**重要**: ghコマンドが使用できないため、以下の手順でブラウザからマージしてください。

チャットセッションに以下を表示してください：

```
## PRマージ手順（手動操作が必要）

以下のリンクからPRページを開いてマージしてください：

https://github.com/akAredminEogre/frog-frame-front/pulls

### マージ方法
1. 上記リンクから該当のPRを開く
2. "Merge pull request" ボタンをクリック
3. **"Create a merge commit"** を選択（Squashではなく）
4. "Confirm merge" をクリック

マージが完了したら、このチャットに「マージ完了」と入力してください。
```

### 4. マージ後作業（マージ完了報告後に実行）

ユーザーから「マージ完了」の報告を受けたら、以下を実行：

- git checkout develop
- git pull origin develop

### 完了時の表示

```
## ワークフロー完了

### 自動実行した作業
- ドキュメントテンプレート削除
- 残ファイルコミット
- issue-nnnディレクトリの移動
- 変更のコミット＆プッシュ

### 手動で実行が必要だった作業
- PRのマージ（ブラウザから実行）

### 注意
- ターミナル版Claude Codeでは `/workflow-merge-pull-request` を使用してください
```
```
