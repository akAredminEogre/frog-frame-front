# Chrome Web Store 自動公開セットアップガイド

このドキュメントでは、GitHub Actionsを使用してChrome拡張機能をChrome Web Storeに自動的に公開する方法を説明します。

## 概要

`main` ブランチへのマージをトリガーに、以下のプロセスが自動的に実行されます：

1. ビルドとテストの実行
2. 拡張機能のzipファイル作成
3. Chrome Web Storeへの自動アップロードと公開

## 前提条件

### 初回公開について

**重要**: Chrome Web Storeへの初回公開は手動で行う必要があります。これは、拡張機能IDと認証情報を取得するために必要です。

初回公開の手順：
1. `npm run build` で拡張機能をビルド
2. `npm run zip` でzipファイルを作成
3. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) から手動でアップロード
4. 拡張機能の詳細情報（説明、スクリーンショット等）を入力
5. 公開申請を提出

初回公開後、以下のセットアップを行うことで、以降の更新は自動化されます。

## セットアップ手順

### 1. Chrome Web Store API認証情報の取得

#### 1.1 Google Cloud Projectの作成

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成（または既存のプロジェクトを使用）

#### 1.2 Chrome Web Store APIの有効化

1. Google Cloud Consoleで「APIとサービス」→「ライブラリ」に移動
2. "Chrome Web Store API" を検索して有効化

#### 1.3 OAuth 2.0認証情報の作成

1. 「APIとサービス」→「認証情報」に移動
2. 「認証情報を作成」→「OAuth クライアント ID」を選択
3. アプリケーションの種類：「ウェブアプリケーション」を選択
4. 承認済みのリダイレクトURIに以下を追加：
   ```
   http://localhost
   ```
5. 作成後、**クライアントID** と **クライアントシークレット** をメモ

#### 1.4 リフレッシュトークンの取得

1. 以下のURLをブラウザで開く（`YOUR_CLIENT_ID` を実際のクライアントIDに置き換え）：

```
https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost
```

2. Googleアカウントでログイン（Chrome Web Store Developer Dashboard にアクセスできるアカウント）
3. アクセスを許可すると、URLに `code=...` というパラメータが含まれたページにリダイレクトされます
4. `code` の値をコピー

5. ターミナルで以下のコマンドを実行（`YOUR_CLIENT_ID`, `YOUR_CLIENT_SECRET`, `YOUR_CODE` を置き換え）：

```bash
curl "https://accounts.google.com/o/oauth2/token" -d \
"client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&code=YOUR_CODE&grant_type=authorization_code&redirect_uri=http://localhost"
```

6. レスポンスから `refresh_token` の値を取得してメモ

### 2. 拡張機能IDの取得

1. [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) にアクセス
2. あなたの拡張機能を選択
3. URLまたは拡張機能の詳細ページから32文字の拡張機能IDを取得（例: `abcdefghijklmnopqrstuvwxyz123456`）

### 3. GitHub Secretsの設定

GitHubリポジトリに以下のシークレットを追加します：

1. GitHubリポジトリの「Settings」→「Secrets and variables」→「Actions」に移動
2. 「New repository secret」をクリックして、以下の4つのシークレットを追加：

| シークレット名 | 値 | 説明 |
|---|---|---|
| `CHROME_EXTENSION_ID` | あなたの拡張機能ID | 32文字の拡張機能ID |
| `CHROME_CLIENT_ID` | OAuth クライアントID | Google Cloud Consoleで作成したクライアントID |
| `CHROME_CLIENT_SECRET` | OAuth クライアントシークレット | Google Cloud Consoleで作成したクライアントシークレット |
| `CHROME_REFRESH_TOKEN` | リフレッシュトークン | 取得したリフレッシュトークン |

## 使用方法

### 自動公開

`main` ブランチにマージされると、自動的にワークフローが実行され、Chrome Web Storeに公開されます：

```bash
# developブランチで作業
git checkout develop
git pull origin develop

# 変更をコミット
git add .
git commit -m "feat: 新機能を追加"
git push origin develop

# mainブランチにマージ（Pull Requestを作成してマージ）
# → 自動的にChrome Web Storeに公開される
```

### 手動実行

GitHub Actionsから手動でワークフローを実行することも可能です：

1. GitHubリポジトリの「Actions」タブに移動
2. 「Publish to Chrome Web Store」ワークフローを選択
3. 「Run workflow」ボタンをクリック

## トラブルシューティング

### 認証エラーが発生する場合

- シークレットの値が正しいか確認
- リフレッシュトークンの有効期限が切れている場合は、再取得が必要
- Chrome Web Store APIが有効化されているか確認

### ビルドが失敗する場合

- ローカルで `npm run build` が成功するか確認
- テストが通るか `npm run test:all` で確認

### アップロードは成功するが公開されない場合

ワークフローはアップロードと自動公開申請を行いますが、Chrome Web Storeのレビューには時間がかかる場合があります。Developer Dashboardで状態を確認してください。

### 手動でレビュー提出したい場合

自動レビュー提出をスキップしたい場合は、`.github/workflows/publish-chrome-store.yml` の最後のステップを以下のように変更：

```yaml
- name: Submit to Chrome Web Store
  run: npx wxt submit --chrome-zip=.output/chrome-mv3-*.zip --chrome-skip-submit-review
```

## 参考リンク

- [WXT Documentation - Publishing](https://wxt.dev/)
- [Chrome Web Store API - Google Developers](https://developer.chrome.com/docs/webstore/using_webstore_api/)
- [WXT Store Upload Discussion](https://github.com/wxt-dev/wxt/discussions/1545)

## セキュリティに関する注意

- **絶対に** シークレットの値をコードやドキュメントにコミットしないでください
- シークレットの値はGitHub Secretsにのみ保存してください
- リフレッシュトークンは定期的に更新することを推奨します
