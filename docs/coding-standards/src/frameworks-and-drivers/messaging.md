# メッセージング層 コーディング規約

## 命名規約

- dto
  - メッセージ送信に使用するDTO
    - 接尾辞を`RequestDTO` とする。

### メッセージングサービスクラス

メッセージングサービスクラスの接尾辞は `MessagingService` とする。

| 種別 | 命名パターン | 例 |
|------|-------------|-----|
| メッセージングサービス | `{Entity}MessagingService` | `RewriteRuleMessagingService` |

**理由**: `Service` のみでは用途が不明瞭なため、`MessagingService` として明確化する。
