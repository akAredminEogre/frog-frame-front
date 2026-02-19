# WXTフレームワーク詳細

## 設定

- 設定ファイル: `host-frontend-root/frontend-src-root/wxt.config.ts`
- **必須**: 設定に `srcDir: 'src'` を指定すること
- 開発サーバー: `WXT_DEV_HOST` および `WXT_DEV_PORT` 環境変数で設定可能（デフォルト: localhost:3000）

## エントリーポイント

全エントリーポイントは `src/entrypoints/` に配置:

- `background.ts` - バックグラウンドサービスワーカー
- `content.ts` - コンテントスクリプト
- `popup/` - ポップアップUIディレクトリ
- `rules/` - ルールページディレクトリ
- `edit/` - 編集ページディレクトリ

## 特殊ファイル

- `.wxt/tsconfig.json` - `npx wxt prepare` によって自動生成（手動作成禁止）
- `matchUrl.ts` - セットアップ時に `matchUrl.ts.example` から作成すること
