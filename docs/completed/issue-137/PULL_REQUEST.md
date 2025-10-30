# ISSUE-137 PULL REQUEST テンプレート

## タイトル
Chromeストア公開用資料の格納場所整備

## 概要と理由
Chromeストアに拡張機能を公開するため、説明文やデモgifなどの公開資料を一元管理する場所が必要でした。既存の資料が分散していたため、今後の公開作業を効率的に進められるよう、専用のディレクトリ構造を整備しました。

## 主な変更点
- `docs/chrome-store/` ディレクトリを新規作成
- 既存のストア説明文 `docs/completed/issue-081/STORE_DESCRIPTION.md` を `docs/chrome-store/STORE_DESCRIPTION.md` に移動
- Chromeストア公開用資料の一元管理体制を構築

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認

## 補足
[追加の文脈や注意点]
なし

## 本スコープの対象外となったタスク
なし

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->