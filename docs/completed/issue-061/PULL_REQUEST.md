# ISSUE-061 PULL REQUEST

## タイトル
entrypointsディレクトリをsrc内に移動するリファクタリング

## 概要と理由
entrypointsディレクトリをルートディレクトリからsrc内に移動するリファクタリング作業を実施しました。
これにより、プロジェクト構造がより整理され、WXTフレームワークの標準的な構成に準拠するようになります。

## 主な変更点

### 1. ディレクトリ構造の変更
- `entrypoints/` → `src/entrypoints/` に移動
- 以下のファイルがsrc内の新しい場所に配置：
  - `src/entrypoints/background.ts`
  - `src/entrypoints/content.ts`
  - `src/entrypoints/popup/App.tsx`
  - `src/entrypoints/popup/App.css`
  - `src/entrypoints/popup/index.html`
  - `src/entrypoints/popup/main.tsx`
  - `src/entrypoints/popup/style.css`

### 2. 設定ファイルの修正
各種設定ファイルでentrypointsディレクトリのパス参照を更新：

- **wxt.config.ts**: srcDirを'src'に設定してWXTがsrc内のentrypointsを認識するよう修正
- **tsconfig.json**: paths設定で `"entrypoints/*"` を `"./src/entrypoints/*"` に修正
- **tsconfig.tsr.json**: includeパターンでentrypointsパスを修正
- **knip.json**: ignore, entry, projectセクションのentrypointsパスを全て更新
- **package.json**: WXT関連の設定を調整

### 3. import文の修正
- **src/entrypoints/popup/App.tsx**: 相対import文を修正
- **src/entrypoints/content.ts & background.ts**: WXTのdefineContentScript/defineBackgroundのimportを削除（グローバル関数として利用）

### 変更されたファイル一覧
```
host-frontend-root/frontend-src-root/knip.json
host-frontend-root/frontend-src-root/package.json
host-frontend-root/frontend-src-root/src/entrypoints/background.ts
host-frontend-root/frontend-src-root/src/entrypoints/content.ts
host-frontend-root/frontend-src-root/src/entrypoints/popup/App.css
host-frontend-root/frontend-src-root/src/entrypoints/popup/App.tsx
host-frontend-root/frontend-src-root/src/entrypoints/popup/index.html
host-frontend-root/frontend-src-root/src/entrypoints/popup/main.tsx
host-frontend-root/frontend-src-root/src/entrypoints/popup/style.css
host-frontend-root/frontend-src-root/tsconfig.json
host-frontend-root/frontend-src-root/tsconfig.tsr.json
host-frontend-root/frontend-src-root/wxt.config.ts
```

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認
- インフラ変更が完了したため、E2Eテストの実行による最終動作確認が推奨

## 補足
[追加の文脈や注意点]
- WXT 0.20.7では、defineContentScriptとdefineBackgroundがグローバル関数として提供されるため、明示的なimportは不要
- TypeScriptエラーは表示されますが、実際のビルド時には正常に動作する仕様
  - 再ビルドでエラーが解消されることを確認

## 本スコープの対象外となったタスク
特になし。計画されたリファクタリング作業は全て完了。

## プルリクエスト情報
- **プルリクエスト番号**: #106
- **URL**: https://github.com/akAredminEogre/frog-frame-front/pull/106

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
