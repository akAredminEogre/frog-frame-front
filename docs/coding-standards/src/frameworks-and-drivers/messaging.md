# メッセージング層 コーディング規約

## 命名規約

### メッセージングサービスクラス

メッセージングサービスクラスの接尾辞は `MessagingService` とする。

| 種別 | 命名パターン | 例 |
|------|-------------|-----|
| メッセージングサービス | `{Entity}MessagingService` | `RewriteRuleMessagingService` |

**理由**: `Service` のみでは用途が不明瞭なため、`MessagingService` として明確化する。

## eslint-rule

`host-frontend-root/frontend-src-root/eslint-rules/clean-architecture/frameworks-and-drivers/messaging/service.js`
