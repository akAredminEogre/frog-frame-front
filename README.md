# frog-frame-front

このリポジトリは、フロントエンドプロジェクトのためのリポジトリです。

## セットアップ

### clone
```bash
git clone git@github.com:akAredminEogre/frog-frame-front.git
```

### git config
リポジトリをクローンした後、以下のコマンドを実行して Git 設定を適用してください。

```bash
git config core.repositoryformatversion 0
git config core.filemode false
git config core.bare false
git config core.logallrefupdates true
```

### コンテナ起動
cd コマンドで `frog-frame-front` ディレクトリに移動し、以下のコマンドを実行してください。
```
docker compose up -d --build && docker compose ps && \
docker compose exec frontend npm install && \
docker compose up -d && docker compose ps && \
docker compose exec frontend npm run dev 
```

### test-and-lint
`npm run dev ` で開発サーバーを起動した後、別のターミナルで以下のコマンドを実行してください。
```
docker compose exec frontend npm run test-and-lint
```
