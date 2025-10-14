# ISSUE-079 PULL REQUEST

## タイトル
ルール一覧に編集ボタンを追加

## 概要と理由
ルール一覧画面からルールを直接編集できるようにするため、各ルール行に「編集」ボタンを追加しました。これにより、ユーザーは一覧画面から素早くルール編集ページに遷移できるようになります。

## 主な変更点

### 1. 新規ユースケースの追加
- `OpenRuleEditPageUseCase.ts`を新規作成
  - ルール編集ページを開く責務を持つユースケース
  - `IChromeTabsService`を利用して編集ページを新しいタブで開く

### 2. UIの変更
- `RulesApp.tsx`
  - 「編集」ボタンを各ルール行に追加
  - `handleEdit`関数を実装し、`OpenRuleEditPageUseCase`を呼び出し
  - DIコンテナから`IChromeTabsService`を解決

- `style.css`
  - 編集ボタンのスタイルを追加
  - テーブルレイアウトに「操作」列を追加

### 3. インフラストラクチャ層の拡張
- `IChromeTabsService.ts`
  - `openEditPage(ruleId: string)`メソッドをインターフェースに追加

- `ChromeTabsService.ts`
  - `openEditPage`メソッドの実装を追加
  - Chrome拡張機能APIを使用して編集ページを新しいタブで開く

### 4. テストの更新
- `edge-cases.test.ts`と`normal-cases.test.ts`
  - `IChromeTabsService`のモックに`openEditPage`メソッドを追加
  - 既存テストとの整合性を維持

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認

## 補足
- 編集ボタンは各ルール行の右端に配置
- ボタンクリック時、ルールIDを使用して編集ページを新しいタブで開く
- エラーハンドリングを`OpenRuleEditPageUseCase`内で実装

## 本スコープの対象外となったタスク
- 編集ページそのものの実装（別issueで対応済みと想定）
- ルール削除機能
- インライン編集機能


<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
