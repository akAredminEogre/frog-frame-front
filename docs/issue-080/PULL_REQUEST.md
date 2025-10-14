# ISSUE-080 PULL REQUEST

## タイトル
モックサービス作成ロジックの共通化リファクタリング

## 概要と理由
テストコードにおけるモックサービスの初期化ロジックが各テストファイルで重複していたため、共通のモック作成関数を導入してコードの保守性と一貫性を向上させました。

## 主な変更点

### 1. モック作成関数の追加
以下の3つの共通モック作成関数を新規追加:
- `tests/unit/application/ports/IChromeTabsService/createMockTabsService.ts`
  - `IChromeTabsService`のモック作成関数
  - `sendMessage`, `queryTabs`, `sendApplyAllRulesMessage`, `openEditPage`のモックメソッドを提供
  
- `tests/unit/application/ports/IPopupService/createMockPopupService.ts`
  - `IPopupService`のモック作成関数
  - `openPopup`のモックメソッドを提供
  
- `tests/unit/application/ports/ISelectedPageTextService/createMockSelectedPageTextService.ts`
  - `ISelectedPageTextService`のモック作成関数
  - `setSelectedPageText`, `getSelectedPageText`のモックメソッドを提供

### 2. テストファイルのリファクタリング
既存のテストファイルでインライン定義されていたモック初期化を、共通関数を使用する形式に変更:
- `tests/unit/application/usecases/contextmenu/HandleContextMenuReplaceDomElement/execute/edge-cases.test.ts`
- `tests/unit/application/usecases/contextmenu/HandleContextMenuReplaceDomElement/execute/normal-cases.test.ts`

各テストファイルで約12-15行のコードが3行に簡潔化されました。

### 3. 設定ファイルの更新
テストコードからモック作成関数への参照を容易にするため、パスエイリアスを追加:
- `tsconfig.json`: `"tests/*"`エイリアスを追加
- `vitest.config.ts`: `tests`パスエイリアスを追加

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test:all` で回帰テスト通過を確認

## 補足
- モック作成ロジックの共通化により、今後新しいテストを追加する際の実装コストが削減されます
- モックの実装が変更された場合、共通関数のみを修正すればすべてのテストに反映されます

## 本スコープの対象外となったタスク
なし

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
