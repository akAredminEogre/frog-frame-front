# Issueの計画

# DAILY-SCRUM単位のタスク
- ISSUE.mdを元に、開発タスクをデイリースクラム単位に分解する
- [x] background.ts関連のinfrastructure層ファイルのディレクトリ構成をリファクタリング
  - [x] runtime関連のlistenerファイルを`listeners/runtime/background/`に移動・リネーム
    - [x] `runtime.onMessage.ts` → `listeners/runtime/background/onMessage.ts`
    - [x] `runtime.onInstalled.ts` → `listeners/runtime/background/onInstalled.ts`
  - [x] その他のlistenerファイルを`listeners/[category]/background/`に移動・リネーム
    - [x] `tabs.onUpdated.ts` → `listeners/tabs/background/onUpdated.ts`
    - [x] `contextMenus.onClicked.ts` → `listeners/contextMenus/background/onClicked.ts`
  - [x] import文の更新
    - [x] `background.ts`のimport文を新しいパスに更新
    - [x] その他関連ファイルがあれば同様に更新
  - [x] テストファイルの対応
    - [x] 既存のテストファイルがあれば同じディレクトリ構造に移動
    - [x] テスト内のimport文も更新

# ISSUEを通した相談事

# 残タスク
<!-- issueの進捗に応じて記入 -->

# 本issueの対象外とする課題
<!-- issueの進捗に応じて記入 -->