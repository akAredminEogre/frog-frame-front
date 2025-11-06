# ISSUE-142 PULL REQUEST

## タイトル
Chrome Web StoreのURL変更に対応

## 概要と理由
Chrome Web StoreのURLが`https://chrome.google.com/webstore/`から`https://chromewebstore.google.com/`に変更されたため、拡張機能のTabUrl値オブジェクトの制限URL設定を更新する必要がある。

## 主な変更点
- `TabUrl.ts`: RESTRICTED_URLsの設定を新しいChrome Web Store URLに更新
  - 変更前: `https://chrome.google.com/webstore/`  
  - 変更後: `https://chromewebstore.google.com/`
- 関連するテストケースを新しいURLに対応するよう更新

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- TabUrlクラスの`canInjectContentScript()`メソッドが新しいChrome Web Store URLで正しく`false`を返すことを確認

## 補足
この変更により、Chrome Web Storeページでのコンテンツスクリプト注入制限が適切に機能し、エラーの発生を防ぐ。

## 本スコープの対象外となったタスク
なし

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->