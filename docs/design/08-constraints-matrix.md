# Chrome拡張制約マトリックス

このドキュメントでは、Chrome拡張機能開発における実行コンテキスト別の制約を体系的に整理します。

**関連ドキュメント:**
- [プロジェクト概要](00-overview.md) - 全体像と方式設計
- [アーキテクチャ設計書](01-architecture.md) - Clean Architecture詳細

---

## 1. 実行コンテキスト別制約マトリックス

### 1.1 総合マトリックス

| 機能 | Background | Content Script | Popup/Options | 備考 |
|------|-----------|---------------|--------------|------|
| **DOMアクセス** | ❌ 不可 | ✅ 可能 | ✅ 可能（拡張自体のDOM） | Backgroundは`document`にアクセス不可 |
| **`window`オブジェクト** | ❌ 不可 | ✅ 可能（制限あり） | ✅ 可能 | Content Scriptは独立したコンテキスト |
| **全Chrome API** | ✅ 全て利用可 | ⚠️ 制限あり | ✅ 全て利用可 | Content Scriptは一部APIのみ |
| **`chrome.runtime`** | ✅ 可能 | ✅ 可能 | ✅ 可能 | メッセージング等 |
| **`chrome.tabs`** | ✅ 可能 | ❌ 不可 | ✅ 可能 | タブ操作 |
| **`chrome.storage`** | ✅ 可能 | ✅ 可能 | ✅ 可能 | ストレージAPI |
| **`chrome.scripting`** | ✅ 可能 | ❌ 不可 | ✅ 可能 | スクリプト注入 |
| **`chrome.contextMenus`** | ✅ 可能 | ❌ 不可 | ✅ 可能 | コンテキストメニュー |
| **IndexedDB** | ✅ 可能 | ✅ 可能 | ✅ 可能 | 大容量ストレージ |
| **永続性** | ✅ 常駐 | ⚠️ ページ単位 | ⚠️ 開いている間のみ | Service Worker (MV3) |

---

## 2. 実行コンテキスト詳細

### 2.1 Background (Service Worker - Manifest V3)

**特徴:**
- **常駐プロセス**: 拡張機能の中核として動作
- **DOMアクセス不可**: `document`, `window`オブジェクトは利用不可
- **全Chrome API利用可**: タブ操作、ストレージ、メッセージング等すべて利用可能

**主な用途:**
- データの永続化（IndexedDB）
- メッセージルーティング
- タブ管理
- コンテキストメニュー管理
- 拡張機能のライフサイクル管理

**制約:**
```typescript
// ❌ 不可
document.querySelector('.some-element');
window.location.href;

// ✅ 可能
chrome.tabs.query({ active: true });
chrome.storage.local.set({ key: 'value' });
chrome.runtime.sendMessage({ type: 'message' });
```

**実装パターン:**
```typescript
// entrypoints/background.ts
export default defineBackground({
  type: 'module',
  main() {
    // イベントリスナー登録のみ
    tabsOnUpdated();
    runtimeOnExtensionInstalled();
    runtimeOnMessageReceived();
    contextMenusOnClicked();
  },
});
```

---

### 2.2 Content Script

**特徴:**
- **Webページに注入**: ページのDOMにアクセス可能
- **独立したJavaScriptコンテキスト**: ページのJSとは分離
- **Chrome API制限**: 一部のAPIのみ利用可能

**主な用途:**
- DOM要素の読み取り・操作
- ページ内容の書き換え
- ユーザー操作の検知
- Backgroundとのメッセージング

**利用可能なChrome API:**
- `chrome.runtime` (メッセージング)
- `chrome.storage`
- 一部のプロパティ（`chrome.extension.getURL`等）

**利用不可なChrome API:**
- `chrome.tabs` ❌
- `chrome.scripting` ❌
- `chrome.contextMenus` ❌
- `chrome.windows` ❌

**制約:**
```typescript
// ✅ 可能
document.querySelector('.target-element');
window.getSelection();
chrome.runtime.sendMessage({ type: 'getData' });
chrome.storage.local.get('key');

// ❌ 不可
chrome.tabs.query({ active: true });  // TypeError
chrome.contextMenus.create({ ... });   // undefined
```

**実装パターン:**
```typescript
// entrypoints/content.ts
export default defineContentScript({
  matches: process.env.NODE_ENV === 'development'
    ? matchUrl  // 開発時は特定URLのみ
    : ['*://*/*'],  // 本番時は全URL対応

  main() {
    // メッセージ受信リスナーを登録
    runtimeOnMessageReceived();
  },
});
```

**DOM操作の実装例:**
```typescript
// infrastructure/browser/content/runtime/onMessageReceived.ts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'rewriteDOM') {
    // DOM操作: Content Scriptでのみ可能
    const elements = document.querySelectorAll(message.selector);
    elements.forEach(el => {
      el.textContent = message.newText;
    });
    sendResponse({ success: true });
  }
});
```

---

### 2.3 Popup / Options

**特徴:**
- **拡張機能のUI**: HTMLページとして動作
- **全Chrome API利用可**: Backgroundと同等
- **独自のDOM**: 拡張機能自体のDOMのみアクセス可能

**主な用途:**
- ユーザー設定UI
- データ入力フォーム
- 拡張機能の操作パネル

**制約:**
```typescript
// ✅ 可能
document.querySelector('.my-form');  // Popup自体のDOM
chrome.tabs.query({ active: true });
chrome.storage.local.set({ ... });
chrome.runtime.sendMessage({ ... });

// ❌ 不可（Webページの）
// Webページのdocumentには直接アクセス不可
// → Content Scriptを経由する必要がある
```

**実装パターン:**
```typescript
// entrypoints/popup/App.tsx
const App: React.FC = () => {
  const handleSave = async () => {
    // UseCaseを通じてChrome APIを間接的に呼び出す
    const useCase = container.resolve(SaveRewriteRuleAndApplyToCurrentTabUseCase);
    await useCase.execute({ ... });
  };

  return <RewriteRuleForm onSave={handleSave} />;
};
```

---

## 3. API別制約詳細

### 3.1 chrome.tabs API

**利用可能なコンテキスト:**
- ✅ Background
- ❌ Content Script
- ✅ Popup/Options

**主な機能:**
```typescript
// タブ情報の取得
chrome.tabs.query({ active: true, currentWindow: true });

// タブへのスクリプト注入
chrome.scripting.executeScript({
  target: { tabId: tab.id },
  func: () => { /* Content Scriptとして実行 */ }
});

// タブのURL変更検知
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    // ページ読み込み完了
  }
});
```

**必要なパーミッション:**
```json
{
  "permissions": ["tabs", "scripting"]
}
```

---

### 3.2 chrome.storage API

**利用可能なコンテキスト:**
- ✅ Background
- ✅ Content Script
- ✅ Popup/Options

**種類:**

| API | 用途 | 容量制限 | 同期 |
|-----|------|----------|------|
| `chrome.storage.local` | ローカルストレージ | 10MB | なし |
| `chrome.storage.sync` | 同期ストレージ | 100KB | デバイス間同期 |
| `chrome.storage.session` | セッションストレージ | 10MB | セッション単位 |

**使用例:**
```typescript
// 保存
await chrome.storage.local.set({ key: 'value' });

// 取得
const result = await chrome.storage.local.get('key');

// 削除
await chrome.storage.local.remove('key');
```

**本プロジェクトでの使用:**
- 現状: 一時的なデータ共有（contextMenuとpopup間）
- 将来: IndexedDB（Dexie）に移行予定

---

### 3.3 chrome.runtime API

**利用可能なコンテキスト:**
- ✅ Background
- ✅ Content Script
- ✅ Popup/Options

**メッセージング:**
```typescript
// 送信側（Content Script → Background）
chrome.runtime.sendMessage({ type: 'getData', id: 123 }, (response) => {
  console.log(response);
});

// 受信側（Background）
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getData') {
    // 処理
    sendResponse({ data: '...' });
    return true;  // 非同期レスポンス
  }
});
```

**ライフサイクルイベント:**
```typescript
// 拡張機能インストール時
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 初回インストール処理
  }
});
```

---

### 3.4 chrome.contextMenus API

**利用可能なコンテキスト:**
- ✅ Background
- ❌ Content Script
- ✅ Popup/Options

**使用例:**
```typescript
// メニュー作成（Background）
chrome.contextMenus.create({
  id: 'rewrite-selection',
  title: '選択範囲を書き換えルールに設定',
  contexts: ['selection']
});

// クリックイベント（Background）
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'rewrite-selection') {
    const selectedText = info.selectionText;
    // 処理
  }
});
```

---

## 4. セキュリティ制約

### 4.1 Content Security Policy (CSP)

**制約:**
- インラインスクリプト不可
- `eval()` 使用不可
- 外部リソースの読み込み制限

**manifest.json での設定:**
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

---

### 4.2 Host Permissions

**本プロジェクトの設定:**
```json
{
  "host_permissions": ["<all_urls>"]
}
```

**影響:**
- Content Scriptをすべてのページに注入可能
- ユーザーに許可を求める必要がある

---

## 5. ストレージ戦略

### 5.1 ストレージ選択基準

| ストレージ | 容量 | 用途 | 本プロジェクトでの使用 |
|----------|------|------|---------------------|
| **IndexedDB (Dexie)** | 無制限（実質的） | 大量データ、構造化データ | ✅ RewriteRule永続化 |
| **chrome.storage.local** | 10MB | 設定値、一時データ | ⚠️ 一時的な共有（将来廃止予定） |
| **chrome.storage.sync** | 100KB | ユーザー設定（同期） | ❌ 未使用 |

### 5.2 推奨事項

1. **大量データ**: IndexedDB (Dexie) を使用
2. **設定値**: chrome.storage.local（軽量な場合）
3. **デバイス間同期**: chrome.storage.sync

---

## 6. メッセージング制約

### 6.1 メッセージングフロー

```
Popup
  ↓ chrome.runtime.sendMessage()
Background (onMessage listener)
  ↓ chrome.tabs.sendMessage()
Content Script (onMessage listener)
  ↓ DOM操作
```

### 6.2 制約事項

1. **非同期通信**: `sendResponse()` は非同期の場合 `return true` が必要
2. **メッセージサイズ**: 大きなデータは分割送信を推奨
3. **タイムアウト**: 長時間処理は適切なエラーハンドリングが必要

---

## 7. 実装時のベストプラクティス

### 7.1 コンテキスト別の責務分離

| コンテキスト | 責務 |
|------------|------|
| **Background** | データ永続化、メッセージルーティング、タブ管理 |
| **Content Script** | DOM操作、ページ内容取得 |
| **Popup/Options** | ユーザーインターフェース |

### 7.2 Clean Architectureとの対応

```
Background      → Infrastructure層（Repository実装、Chrome APIラッパー）
Content Script  → Infrastructure層（DOM操作サービス）
Popup/Options   → Presentation層（Reactコンポーネント）
UseCase         → Application層（すべてのコンテキストから呼び出し可能）
```

---

## 8. トラブルシューティング

### 8.1 よくあるエラー

**エラー:** `Cannot read property 'query' of undefined`
```typescript
// Content Scriptで chrome.tabs を使おうとした場合
chrome.tabs.query({ active: true });  // ❌ undefined
```
**解決策:** Backgroundにメッセージを送信して間接的に取得

**エラー:** `document is not defined`
```typescript
// Backgroundで document を使おうとした場合
document.querySelector('.element');  // ❌ not defined
```
**解決策:** Content Scriptでの DOM操作に変更

---

**作成日:** 2025-11-08
**最終更新日:** 2025-11-08
**バージョン:** 1.0
