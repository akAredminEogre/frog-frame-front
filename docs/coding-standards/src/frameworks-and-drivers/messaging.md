# メッセージング層 コーディング規約

## 命名規約

### メッセージングクラス

メッセージングクラスの命名は、使用するライブラリと役割に応じて以下のパターンを使用する。

| 種別 | 命名パターン | 例 | 用途 |
|------|-------------|-----|------|
| proxy-service | `{Entity}ProxyService` | `RewriteRuleProxyService` | Background へのデータ取得・更新 |
| messaging 送信側 | `{Context}MessageSender` | `BackgroundScriptMessageSender` | Background → Content Script への送信 |
| messaging 受信側 | `{Context}MessageReceiver` | `ContentScriptMessageReceiver` | Content Script での受信 |

**理由**:
- `ProxyService`: `@webext-core/proxy-service` を使用していることが明確
- `MessageSender` / `MessageReceiver`: 送受信の役割が一目瞭然

## eslint-rule

`host-frontend-root/frontend-src-root/eslint-rules/clean-architecture/frameworks-and-drivers/messaging/service.js`
