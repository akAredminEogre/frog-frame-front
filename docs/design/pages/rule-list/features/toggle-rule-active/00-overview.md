# ルールトグル機能 設計概要

## 機能概要

ルール一覧画面において、各ルールの有効/無効をトグルボタンで切り替えられる機能を追加する。

## ユーザーストーリー

> ルール一覧でルールの有効/無効を切り替えられる

## トリガー

| アクター | 画面 | トリガー |
|---------|------|---------|
| ユーザー | ルール一覧（rules） | トグルスイッチをクリック |

※ システムイベント（タブリロード等）による自動トリガーはなし

## 機能要件

### 有効/無効トグル

- ルール一覧の各行にトグルスイッチを表示
- トグル操作でルールの有効/無効を切り替える
- 変更をDBに保存する
- 該当するタブをリロードする

## 関連ドキュメント

- [ユーザーストーリー](../../../../../user-stories/user-story-001/)
- [ADR-001: Clean Architecture with Presenter Pattern](../../../../adr/001-clean-architecture-with-presenter-pattern.md)
- [ADR-002: メッセージングに @webext-core/proxy-service を採用](../../../../adr/002-messaging-with-proxy-service.md)
- [ADR-003: DB アクセスを messaging 経由に統一し DTO を使用](../../../../adr/003-unified-db-access-via-messaging.md)
