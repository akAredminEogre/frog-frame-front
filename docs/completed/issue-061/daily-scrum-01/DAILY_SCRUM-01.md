# DAILY SCRUM-01回目

## 1. 本日の目標
entrypointsディレクトリをルートディレクトリからsrc内に移動するリファクタリング作業を完了する。

## 2. タスク
- [x] entrypointsディレクトリをsrc内に移動
- [x] WXT設定ファイル（wxt.config.ts）の修正
- [x] TypeScript設定ファイル（tsconfig.json, tsconfig.tsr.json）の修正
- [x] Knip設定ファイル（knip.json）の修正
- [x] package.json設定の調整
- [x] import文の修正
- [x] ビルド・動作確認

## 3. 主要な変更内容

### ディレクトリ構造の変更
- `entrypoints/` → `src/entrypoints/` に移動
- 以下のファイルがsrc内の新しい場所に配置：
  - `src/entrypoints/background.ts`
  - `src/entrypoints/content.ts`
  - `src/entrypoints/popup/App.tsx`
  - `src/entrypoints/popup/App.css`
  - `src/entrypoints/popup/index.html`
  - `src/entrypoints/popup/main.tsx`
  - `src/entrypoints/popup/style.css`

### 設定ファイルの修正
- **wxt.config.ts**: srcDirを'src'に設定
- **tsconfig.json**: paths設定で `"entrypoints/*"` を `"./src/entrypoints/*"` に修正
- **tsconfig.tsr.json**: includeパターンのentrypointsパスを修正
- **knip.json**: ignore, entry, projectセクションのentrypointsパスを全て更新
- **package.json**: WXT関連の設定を調整

### import文の修正
- **src/entrypoints/popup/App.tsx**: 相対import文を修正
- **src/entrypoints/content.ts & background.ts**: WXTのdefineContentScript/defineBackgroundのimportを削除

## 4. 修正したファイル
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

## 5. 次回への引き継ぎ事項
インフラ変更が完了したため、E2Eテストの実行による最終動作確認が推奨されます。
