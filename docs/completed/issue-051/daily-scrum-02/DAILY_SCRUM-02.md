# DAILY SCRUM-02回目

## 本スクラムの作業予定
ChromeTabsService sendMessageエラーとbackground applyAllRulesエラーを検知するE2Eテストアサートの追加

## 修正予定のファイル
- favorite-keyword-link-frog/host-frontend-root/frontend-src-root/tests/e2e/save-and-replace.spec.ts
- favorite-keyword-link-frog/host-frontend-root/frontend-src-root/tests/e2e/get-origin.spec.ts
- favorite-keyword-link-frog/host-frontend-root/frontend-src-root/tests/e2e/ignore-crlf-replace-with-regex.spec.ts
- favorite-keyword-link-frog/host-frontend-root/frontend-src-root/tests/e2e/ignore-crlf-replace.spec.ts
- favorite-keyword-link-frog/host-frontend-root/frontend-src-root/tests/e2e/popup.spec.ts

## 相談事項
事後作成のためなし

## 一言コメント
全てのE2Eテストファイルにエラー検知機能を統一的に追加できて、テストの品質向上に貢献できた感じがして嬉しいです。特にユーザーフィードバックを受けて実際のWebページエラーを除外する仕組みを実装できたのが良かったです。
