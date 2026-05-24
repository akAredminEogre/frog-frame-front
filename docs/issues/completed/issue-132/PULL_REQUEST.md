# ISSUE-132 PULL REQUEST

## タイトル
refactor: background.tsのリスナー構造をClean Architecture・DDDの観点から再組織化

## 概要と理由
background.tsでimportされているリスナーがシーケンス図作成時にわかりにくい問題を解決するため、Clean Architecture・DDDの観点からディレクトリ構造を再組織化しました。

従来の`listeners/`ディレクトリ配下でのChrome API別組織化から、実行コンテキスト別（background/content）の組織化に変更し、background.tsに含まれることを明示的にしました。

## 主な変更点

### ディレクトリ構造の変更
- **旧構造**: `src/infrastructure/browser/listeners/[chromeAPI]/background/`
- **新構造**: `src/infrastructure/browser/background/[chromeAPI]/`

### 移動されたファイル
- `listeners/contextMenus/background/onClicked.ts` → `background/contextMenus/onClicked.ts`
- `listeners/runtime/background/onInstalled.ts` → `background/runtime/onExtensionInstalled.ts`
- `listeners/runtime/background/onMessage.ts` → `background/runtime/onMessageReceived.ts`
- `listeners/tabs/background/onUpdated.ts` → `background/tabs/onUpdated.ts`

### エクスポート名の変更
register〜形式から直接的な関数名に変更：
- `registerContextMenusOnClicked` → `contextMenusOnClicked`
- `registerRuntimeOnInstalled` → `runtimeOnExtensionInstalled`
- `registerRuntimeOnMessage` → `runtimeOnMessageReceived`
- `registerTabsOnUpdated` → `tabsOnUpdated`

### Clean Architecture・DDD原則の適用
- **Bounded Context**: backgroundとcontentでコンテキストを分離
- **Aggregate Root**: 各Chrome APIのイベントをAggregate Rootとして扱う
- **依存関係の明確化**: background.tsからの依存関係を明示

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
  - ユニットテスト217件すべて通過
  - E2Eテスト11件通過（1件リトライ成功）
  - TypeScriptコンパイル、リント、静的解析すべて成功

## 補足
[追加の文脈や注意点]
- リファクタリング実行時にコンパイルエラーゼロを維持
- 段階的なアプローチにより安全性を確保
- 詳細な分析文書（background-listener-analysis.md）により設計指針を明確化

## 本スコープの対象外となったタスク
- content.ts関連の修正（content scriptのリスナー移動）
  - 理由: レビューコメントに応じてスコープを調整し、backgroundリスナーに集中

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->