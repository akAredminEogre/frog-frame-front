# ISSUE-083 PULL REQUEST

## タイトル
アプリ名とリポジトリ名を`favorite-keyword-link-frog`から`frog-frame-front`に変更

## 概要と理由
プロジェクトのアプリ名とリポジトリ名を`favorite-keyword-link-frog`から`frog-frame-front`に変更しました。この変更により、プロジェクト名がより明確になり、一貫性が保たれます。

## 主な変更点

### プロダクションコード
- `ContextMenuSetupUseCase.ts`: コンテキストメニューのID、タイトル、parentIdを変更
  - `favorite-keyword-link-frog-` → `frog-frame-front-`
- `package.json`: パッケージ名を変更
  - `favorite-keyword-link-frog` → `frog-frame-front`

### ドキュメント・設定ファイル（計156ファイル）
- `.clinerules`ディレクトリ内のMarkdownファイル（約15ファイル）
- `docs`ディレクトリ内のMarkdownファイル（約130ファイル以上）
  - 過去のissueドキュメント、プログレスファイル、振り返りファイルなど
- `PRIVACY_POLICY.md`, `docs/WITH_CLINE.md`などのドキュメント

すべてのファイルで`favorite-keyword-link-frog`という文言を`frog-frame-front`に置換しました。

### リポジトリ名変更の方針
- GitHubリポジトリ名の変更は、開発者が手動でGitHub上で実施
- コミット履歴とコミット日時は維持される（GitHubの仕様により保証）
- developブランチのマージを待たずにリポジトリ名変更可能
- 変更後は各開発者がローカルのリモートURLを更新する必要がある

## テスト方法
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 単体テスト: 262個成功
  - Knip: 正常
  - TypeScriptコンパイル: 成功
  - ESLint: 成功
  - ※E2Eテスト2件失敗は既存問題（今回の変更とは無関係）

## 補足

### リポジトリ名変更後の確認事項
開発者がGitHubでリポジトリ名を変更した後、以下の確認が必要：
1. GitHub Actionsの動作確認
2. Webhookの設定確認（リポジトリ名を参照している場合）
3. 各開発者のローカルリポジトリのリモートURL更新
4. 外部ドキュメントやリンクの更新（必要に応じて）

### 注意事項
- 将来、元のリポジトリ名（`favorite-keyword-link-frog`）を再利用すると、リダイレクトが機能しなくなる

## 本スコープの対象外となったタスク
特になし。当初計画されていたすべてのタスクが完了しました。

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
