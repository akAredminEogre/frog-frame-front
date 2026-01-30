# ISSUE-114 PULL REQUEST テンプレート

## タイトル
fix: dotenvのランタイムログを抑制

## 概要と理由
開発環境でWXTのコマンド実行時に表示されていたdotenvの警告メッセージを解消しました。

警告メッセージ:
```
[dotenv@17.2.3] injecting env (0) from .env.development.chrome.local,...,.env
```

この警告はWXT@0.20.11が内部で使用するdotenv@17.2.3において、v17からデフォルトでランタイムログが出力される仕様に変更されたことが原因でした。開発環境のコンソールログをクリーンに保つため、この警告を抑制する対応を実施しました。

## 主な変更点

### docker-compose.yml
- frontendサービスのenvironmentセクションに`DOTENV_CONFIG_QUIET=true`を追加 (docker-compose.yml:21)
  - この環境変数はdotenvがロードされる前にDockerコンテナレベルで設定する必要があるため、docker-compose.ymlで定義
  - WXTが内部で使用するdotenvのログ出力を抑制

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- Docker再起動後、`npx wxt prepare`コマンドでdotenv警告が表示されないことを確認
- コンパイルチェック: 成功
- ユニットテスト: 全283テスト成功
- 既存機能への影響なし

## 補足
[追加の文脈や注意点]
- dotenvのquietオプションをDocker環境変数として設定することで、dotenvのロード前に設定が適用されます
- この変更は開発環境のログ表示のみに影響し、機能的な変更はありません
- WXTのバージョンアップによりdotenvのバージョンが変更された場合も、この設定により引き続きログが抑制されます

## 本スコープの対象外となったタスク

なし

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->
