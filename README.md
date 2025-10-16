# frog-frame-front

このリポジトリは、フロントエンドプロジェクトのためのリポジトリです。

## セットアップ

### 1. clone
```bash
git clone git@github.com:akAredminEogre/frog-frame-front.git
cd frog-frame-front
```

### 2. git config
リポジトリをクローンした後、以下のコマンドを実行して Git 設定を適用してください。

```bash
make init-config
```

このコマンドにより、以下の設定が `.git/config` に適用されます：
- `core.repositoryformatversion = 0`
- `core.filemode = false`
- `core.bare = false`
- `core.logallrefupdates = true`

### 3. 初回コンテナ起動と開発サーバー起動（初回のみ）

初回セットアップでは、以下のコマンドを実行してください：

```bash
make init-dev
```

このコマンドは以下を自動的に実行します：
- `.env` ファイルの作成
- `matchUrl.ts` ファイルの作成
- Dockerコンテナのビルドと起動
- npm依存関係のインストール
- **`.wxt/tsconfig.json` の生成（`npx wxt prepare` コマンドで実行されます）**
- **開発サーバーの起動**

開発サーバーを停止するには、`Ctrl + C` を押してください。

### 4. 開発サーバーの起動（2回目以降）

2回目以降の開発では、以下のコマンドを実行してください：

```bash
make dev
```

開発サーバーを停止するには、`Ctrl + C` を押してください。

### test-and-lint
`make dev` で開発サーバーを起動した後、別のターミナルで以下のコマンドを実行してください。
```bash
docker compose exec frontend npm run test-and-lint
```

## 利用可能なコマンド

```bash
make help        # 利用可能なコマンドを表示
make init-config # Git設定を適用
make init-dev    # 初回開発環境セットアップ
make dev         # 開発サーバーを起動
```

## プロジェクト構造

```
frog-frame-front/
├── .gitconfig.template    # Git設定テンプレート
├── Makefile              # セットアップ・開発コマンド
├── docs/                 # ドキュメント
├── host-frontend-root/   # フロントエンドソースコード
└── README.md            # このファイル
```

## トラブルシューティング

### `.wxt/tsconfig.json` が見つからないエラー

`make init-dev` 実行時に `.wxt/tsconfig.json` が生成されます。もしエラーが発生した場合は、以下のコマンドで手動生成できます：

```bash
docker compose exec frontend npx wxt prepare
```

その後、`make dev` で開発サーバーを起動してください。

### レイヤーキャッシュについて

Dockerイメージのビルド時は、効率化のため `package.json` と `package-lock.json` のみを先にコピーして `npm install` を実行します。この時点では `postinstall` スクリプトで `wxt prepare` を実行せず、全ソースコードコピー後に実行する設計になっています。これによりレイヤーキャッシュが有効活用され、ビルド時間が短縮されます。

## 開発ワークフロー

1. リポジトリをクローン
2. `make init-config` を実行してGit設定を適用
3. `make init-dev` を実行して初回セットアップ（初回のみ）
4. `make dev` を実行して開発サーバーを起動（2回目以降）
5. 新しいissueブランチを作成する場合は、`.clinerules/02-workflow-automation/01-issue-launches/workflow:create-branch.md` を参照
