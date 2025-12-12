# ADR-002: DB アクセスを messaging 経由に統一

## ステータス

採用

## コンテキスト

Chrome 拡張機能では、複数のコンテキスト（Background Script、Rules Page、Content Script）が存在し、それぞれ IndexedDB へのアクセス可否が異なる：

| コンテキスト | IndexedDB 直接アクセス | messaging 経由 |
|-------------|----------------------|----------------|
| Background Script | ✅ 可能 | - |
| Rules Page (別タブ) | ✅ 可能 | ✅ 可能 |
| Popup | ✅ 可能 | ✅ 可能 |
| Content Script | ❌ 不可 | ✅ 必須 |

Rules Page や Popup は技術的には IndexedDB に直接アクセスできるが、Content Script は chrome.runtime.sendMessage を使用して Background Script 経由でのみ DB にアクセスできる。

## 決定

**すべてのコンテキストから DB アクセスは messaging 経由で Background Script に集約する。**

```
Rules Page  ─┐
Popup       ─┼─→ chrome.runtime.sendMessage ─→ Background ─→ DexieRewriteRuleRepository
Content.ts  ─┘
```

技術的に直接アクセス可能な場合でも、messaging を使用する。

## 理由

### 採用理由

1. **一貫性**: すべてのコンテキストで同じパターンを使用
2. **単一責任**: DB アクセスロジックが Background Script に集約
3. **データ整合性**: 単一の DB アクセスポイントにより競合を回避
4. **拡張性**: chrome.tabs API 等の Background 限定 API との連携が容易
5. **テスト容易性**: messaging をモックすることで各コンテキストを独立してテスト可能

### トレードオフ

- Rules Page / Popup は直接アクセスより若干のオーバーヘッドが発生
- messaging のシリアライズ/デシリアライズコスト

## 関連ドキュメント

- [ADR-001: Clean Architecture with Presenter Pattern](./001-clean-architecture-with-presenter-pattern.md)
- [Toggle Rule Active 設計](../design/pages/rule-list/features/toggle-rule-active/)
