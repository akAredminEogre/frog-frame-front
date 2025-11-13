# Chrome拡張機能固有要件

## Manifest V3要件

### 必須設定
```json
{
  "manifest_version": 3,
  "name": "DOM Element Manipulator",
  "version": "1.0.0",
  "description": "Advanced DOM element manipulation tool for developers and designers",
  "permissions": [
    "storage",
    "scripting"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "action": {
    "default_popup": "popup/index.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "commands": {
    "toggle-extension": {
      "suggested_key": {
        "default": "Ctrl+Shift+F",
        "mac": "Command+Shift+F"
      },
      "description": "Toggle extension on/off"
    },
    "select-element": {
      "suggested_key": {
        "default": "Ctrl+Shift+S",
        "mac": "Command+Shift+S"
      },
      "description": "Enter element selection mode"
    }
  },
  "web_accessible_resources": [
    {
      "resources": ["css/*.css", "js/injected.js"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

## 権限要求の正当化

### storage
**目的:** 操作履歴、設定、一時データの永続化  
**使用箇所:**
- ユーザー設定の保存（テーマ、ショートカット等）
- 操作履歴の保存（UNDO/REDO用）
- 一時的な選択状態の保存
- ワークスペース状態の保存

**代替手段の検討:** なし（オフライン動作必須）  
**ユーザーへの説明:** 「設定と操作履歴を保存し、ブラウザ再起動後も状態を復元します」

**データ種別と保存先:**
| データ種別 | 保存先 | サイズ上限 | 理由 |
|-----------|--------|----------|------|
| ユーザー設定 | chrome.storage.sync | 8KB | 複数デバイス間で同期 |
| 操作履歴 | chrome.storage.local | 5MB | 大量データのため |
| 一時選択状態 | chrome.storage.session | 1MB | セッション間での保持不要 |

### scripting
**目的:** DOM操作、要素選択、リアルタイムプレビューの実現  
**使用箇所:**
- Content Scriptの動的注入
- ページのDOM要素への直接アクセス
- CSS変更の適用
- 要素情報の取得

**代替手段の検討:** なし（機能の核心部分）  
**ユーザーへの説明:** 「ページのDOM要素を操作し、リアルタイムでスタイル変更を適用します」

**セキュリティ対策:**
- 最小権限の原則に従った実装
- ユーザー入力のサニタイゼーション
- XSS攻撃の防止
- CSP（Content Security Policy）の厳格な適用

### host_permissions: <all_urls>
**目的:** 全Webサイトでの動作を可能にする  
**正当性:**
- DOM操作ツールとして、特定サイトに限定する理由がない
- 開発者は様々なサイトで作業するため
- URLパターンを事前に特定することは不可能

**プライバシー保護:**
- データは一切外部送信しない
- ページコンテンツは分析・操作のみで保存しない
- ユーザーの同意なしには動作しない（手動起動）

## 実行コンテキスト別の制約と設計

### Background Service Worker

**制約:**
- 30秒間非アクティブで終了（Manifest V3）
- DOM/windowオブジェクトアクセス不可
- localStorage使用不可
- 永続的なタイマー不可

**設計への影響:**
```typescript
// ✅ 適切な実装
chrome.storage.local.set({ operationHistory: history });

// ❌ 使用不可
localStorage.setItem('history', JSON.stringify(history));
window.addEventListener('load', handler); // window未定義

// ✅ 永続タイマーの代替
chrome.alarms.create('cleanup', { periodInMinutes: 60 });

// ❌ 長時間タイマー
setTimeout(cleanupOldData, 3600000); // 30秒で終了するため無効
```

**実装方針:**
- データ永続化はchrome.storage使用
- 長時間タイマーはchrome.alarms使用
- DOM操作はContent Script経由
- 状態管理は最小限に留める

### Content Scripts

**制約:**
- Isolated worldで実行（ページJavaScriptとは分離）
- 制限されたChrome API（storageなど一部のみ）
- ページコンテキストの変数に直接アクセス不可
- セキュリティポリシーの厳格な適用

**設計への影響:**
```typescript
// ✅ DOM操作は可能
document.querySelector('.target-element').style.color = 'red';

// ✅ Background通信は可能
chrome.runtime.sendMessage({ action: 'saveOperation' });

// ❌ ページのJavaScript関数は直接呼び出せない
window.somePageFunction(); // 動作しない

// ✅ PostMessage経由での通信
window.postMessage({ type: 'FROM_EXTENSION', data: {} }, '*');
```

**実装方針:**
- DOM操作の主要実行環境
- Background Service Workerとの通信ハブ
- ページとはpostMessage経由で通信
- セキュリティを最優先に実装

### Popup

**制約:**
- ポップアップを閉じると状態がリセット
- 短命なライフサイクル（ユーザーがクリック等で閉じる）
- サイズ制限（最大800x600px推奨）
- レンダリング後の即座のフォーカス

**設計への影響:**
```typescript
// ✅ 状態の永続化
useEffect(() => {
  chrome.storage.local.get(['selectedElements']).then(setElements);
}, []);

// ✅ 状態変更の即座保存
useEffect(() => {
  chrome.storage.local.set({ selectedElements: elements });
}, [elements]);

// ❌ メモリ内状態に依存
const [elements, setElements] = useState([]); // ポップアップ閉じで消失
```

**実装方針:**
- 状態はchrome.storageで永続化
- 軽量で高速なUI実装
- Background/Content Scriptとの効率的な通信
- キーボード操作の完全サポート

## セキュリティポリシー

### Content Security Policy
```
script-src 'self'; 
object-src 'self'; 
connect-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
```

**影響と対応:**

| 制限 | 影響 | 対応策 |
|-----|------|--------|
| インラインスクリプト禁止 | HTMLにJavaScript記述不可 | 全て外部ファイル化 |
| eval()禁止 | 動的コード実行不可 | 静的な実装のみ |
| 外部スクリプト禁止 | CDN使用不可 | 必要ライブラリを同梱 |
| unsafe-inline (CSS) | 限定的に許可 | 動的スタイル適用に必要 |

### XSS対策
```typescript
// ✅ 安全な実装
function setElementText(element: Element, text: string) {
  element.textContent = text; // HTMLエスケープ自動
}

function setElementHTML(element: Element, html: string) {
  element.innerHTML = DOMPurify.sanitize(html); // サニタイゼーション
}

// ❌ 危険な実装
function dangerousSetHTML(element: Element, html: string) {
  element.innerHTML = html; // XSS脆弱性
}
```

### データ検証
```typescript
// CSS値の検証
function validateCSSValue(property: string, value: string): boolean {
  const tempElement = document.createElement('div');
  tempElement.style.setProperty(property, value);
  return tempElement.style.getPropertyValue(property) === value;
}

// セレクターの検証
function validateSelector(selector: string): boolean {
  try {
    document.querySelector(selector);
    return true;
  } catch {
    return false;
  }
}
```

## プライバシー要件

### データ収集ポリシー
**収集するデータ:** なし  
**外部送信:** 一切なし  
**ローカルデータ:**
- ユーザー設定
- 操作履歴
- 一時的な選択状態

### 透明性の確保
```markdown
# プライバシーポリシー（Chrome Web Store掲載用）

## データの取り扱い
- ユーザーデータは一切収集しません
- すべてのデータはローカル（ブラウザ内）に保存されます
- データの外部送信は行いません

## 権限の使用目的
- storage: 設定と操作履歴の保存
- scripting: DOM要素の操作とスタイル適用
- host_permissions: 全サイトでの動作（開発者ツールとして）

## 第三者への情報提供
- 一切行いません
```

## パフォーマンス最適化

### リソース使用量制限
| リソース | 目標値 | 制限値 | 監視方法 |
|---------|-------|-------|---------|
| メモリ使用量 | 50MB | 100MB | chrome.processes API |
| CPU使用率（アイドル） | 0% | 1% | Performance API |
| ストレージ使用量 | 5MB | 10MB | chrome.storage.getBytesInUse |
| DOM操作頻度 | 10回/秒 | 100回/秒 | カスタムカウンター |

### 最適化戦略
```typescript
// Debounced DOM操作
const debouncedStyleUpdate = debounce((element, property, value) => {
  element.style.setProperty(property, value);
}, 100);

// バッチ処理
function applyMultipleStyles(element: Element, styles: CSSStyleDeclaration) {
  element.style.cssText = Object.entries(styles)
    .map(([property, value]) => `${property}: ${value}`)
    .join('; ');
}

// メモリ効率的な要素参照
const elementRefs = new WeakMap<Element, ElementInfo>();
```

### 起動時間最適化
- **初回起動:** 500ms以内
- **ポップアップ表示:** 200ms以内
- **Content Script注入:** 100ms以内

## 配布要件

### Chrome Web Store

**必須アセット:**
```
icons/
├── icon16.png    # 16x16px（ツールバー）
├── icon48.png    # 48x48px（管理ページ）
└── icon128.png   # 128x128px（Chrome Web Store）

screenshots/
├── main-interface.png      # 1280x800px（メイン画面）
├── element-selection.png   # 1280x800px（選択機能）
├── style-editing.png      # 1280x800px（編集機能）
├── operation-history.png  # 1280x800px（履歴機能）
└── settings-panel.png     # 1280x800px（設定画面）

promotional/
├── tile-440x280.png       # プロモーションタイル（任意）
└── marquee-1400x560.png   # マーキー（任意）
```

**ストア説明文:**
```
# DOM Element Manipulator

Professional DOM element manipulation tool for front-end developers and designers.

## Key Features
- Intuitive element selection with hover and click
- Real-time CSS style editing with live preview
- Comprehensive operation history with undo/redo
- Advanced element analysis and debugging
- Operation save/load for reusable workflows

## Perfect for:
- Frontend developers debugging layouts
- UI/UX designers tweaking styles
- QA engineers testing responsive designs
- Web development students learning CSS

## Privacy-First Design
- All data stored locally in your browser
- No data collection or external transmission
- No ads or tracking
- Open source and transparent

## Technical Excellence
- Built with Clean Architecture principles
- TypeScript for reliability
- Comprehensive testing
- Modern Chrome extension standards (Manifest V3)
```

### バージョニング
**Semantic Versioning準拠:**
- **Major (X.0.0):** Breaking changes
- **Minor (X.Y.0):** New features
- **Patch (X.Y.Z):** Bug fixes

**自動更新対応:**
```json
{
  "version": "1.2.3",
  "version_name": "1.2.3 - Enhanced Element Selection"
}
```

## 互換性マトリクス

### ブラウザサポート
| ブラウザ | 最小バージョン | 制限事項 |
|---------|-------------|---------|
| Chrome | 120 | フルサポート |
| Edge | 120 | フルサポート |
| Brave | 1.60 | フルサポート |
| Opera | 106 | 一部API制限あり |

**非サポート:**
- Firefox（Manifest V3対応不完全）
- Safari（Web Extensions API制限）
- 古いChromium（セキュリティリスク）

### Web標準対応
- **CSS:** CSS3準拠
- **DOM:** DOM Level 3準拠
- **JavaScript:** ES2022準拠
- **Web APIs:** Manifest V3対応API

## 運用監視

### エラートラッキング
```typescript
// エラーレポート（ローカル保存のみ）
interface ErrorReport {
  timestamp: number;
  error: {
    message: string;
    stack: string;
    context: string;
  };
  browser: string;
  extensionVersion: string;
}

// エラーハンドリング
chrome.runtime.onError.addListener((error) => {
  const report: ErrorReport = {
    timestamp: Date.now(),
    error: {
      message: error.message,
      stack: error.stack,
      context: 'background'
    },
    browser: navigator.userAgent,
    extensionVersion: chrome.runtime.getManifest().version
  };
  
  // ローカル保存（外部送信なし）
  chrome.storage.local.set({ 
    [`error_${Date.now()}`]: report 
  });
});
```

### パフォーマンス監視
```typescript
// Performance metrics
interface PerformanceMetrics {
  operationResponseTime: number;
  memoryUsage: number;
  domOperationCount: number;
  errorCount: number;
}

// 週次でのメトリクス集計
function aggregateWeeklyMetrics(): Promise<PerformanceMetrics> {
  // ローカルデータから集計
}
```

## 法的要件

### オープンソースライセンス
**MITライセンス:**
```
MIT License

Copyright (c) 2024 frog-frame-front

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

**依存ライブラリライセンス確認:**
| ライブラリ | バージョン | ライセンス | 互換性 |
|-----------|----------|-----------|--------|
| React | 18.x | MIT | ✅ |
| TypeScript | 5.x | Apache 2.0 | ✅ |
| DOMPurify | 3.x | Apache 2.0/MPL 2.0 | ✅ |

### 商標・知的財産
- 第三者の商標使用なし
- オリジナルアイコンデザイン
- パブリックドメインまたは自作アセット使用

## 今後の拡張計画

### Chrome API活用
```typescript
// 将来的に利用予定のAPI
interface FutureAPIs {
  sidePanel: '画面端固定パネル';
  offscreen: 'DOM処理の高速化';
  declarativeNetRequest: '特定サイトでの動作制御';
  contextMenus: '右クリックメニュー統合';
}
```

### 実験的機能
- **Chrome Origin Trials:** 新しいWeb Platform APIのテスト
- **Developer Preview:** 開発者向けプレビュー機能
- **A/B Testing:** ユーザー体験の最適化（プライバシー配慮）