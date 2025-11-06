# ISSUE-125 PULL REQUEST

## タイトル
refactor: background関連のinfrastructure層ファイルのディレクトリ構成をリファクタリング

## 概要と理由
issue-124で、content.ts関連のinfrastructure層ファイルのディレクトリ構成を変更しました。
この構成を参考に、background.ts関連のinfrastructure層ファイルのディレクトリ構成、リネームを行い、
content.ts関連とbackground.ts関連で一貫したディレクトリ構造を実現しました。

## 主な変更点

### リスナーファイルの移動・リネーム
- `src/infrastructure/browser/listeners/runtime.onMessage.ts` → `src/infrastructure/browser/listeners/runtime/background/onMessage.ts`
- `src/infrastructure/browser/listeners/runtime.onInstalled.ts` → `src/infrastructure/browser/listeners/runtime/background/onInstalled.ts`
- `src/infrastructure/browser/listeners/tabs.onUpdated.ts` → `src/infrastructure/browser/listeners/tabs/background/onUpdated.ts`
- `src/infrastructure/browser/listeners/contextMenus.onClicked.ts` → `src/infrastructure/browser/listeners/contextMenus/background/onClicked.ts`

### ルーターファイルの統一
- `src/infrastructure/browser/router/background/messageHandlers.ts` → `src/infrastructure/browser/router/background.ts`
- `src/infrastructure/browser/router/content/messageHandlers.ts` → `src/infrastructure/browser/router/content.ts`

### ハンドラーファイルの移動・リネーム
- `src/infrastructure/browser/router/background/handlers/pingHandler.ts` → `src/infrastructure/browser/handlers/background/pingHandler.ts`
- `src/infrastructure/browser/router/background/handlers/getAllRewriteRulesHandler.ts` → `src/infrastructure/browser/handlers/background/getAllRewriteRulesHandler.ts`
- `src/infrastructure/browser/router/background/handlers/applyAllRulesHandler.ts` → `src/infrastructure/browser/handlers/background/applyAllRulesHandler.ts`

### import文の更新
- `src/entrypoints/background.ts`の新しいパスへのimport文更新
- `src/entrypoints/content.ts`の新しいパスへのimport文更新
- `src/infrastructure/browser/router/background.ts`の新しいパスへのimport文更新

### 最終的な統一されたディレクトリ構造
```
src/infrastructure/browser/
├── handlers/
│   ├── background/  # background.ts関連
│   └── content/     # content.ts関連
├── listeners/
│   ├── contextMenus/background/
│   ├── runtime/background/
│   └── tabs/background/
└── router/
    ├── background.ts
    └── content.ts
```

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- 移動・リネーム後も全てのテストが正常に動作することを確認済み

## 補足
- 段階的なリファクタリング（listeners移動 → router整理 → handlers移動）により、各段階でテストを実行して動作確認を実施
- レビューコメントを受けて、content.ts関連と完全に一致するディレクトリ構造に修正
- 移動中に失われたファイルを迅速に特定・再作成し、テストが正常に動作する状態を維持

## 本スコープの対象外となったタスク
なし


<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->