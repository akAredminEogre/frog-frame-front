# Tabs.reloadAll() テスト戦略

## 目的

保持している全タブに対してchrome.tabs.reload()を呼び出し、
全てのリロードが完了するまで待機する。

## テスト分類

### 1. 正常系（リロード実行）

全タブのリロードが正しく呼び出されることを確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 複数タブ | 複数タブを順次リロード | 基本パターン |
| 単一タブ | 1件のみリロード | 境界値 |

**対応テスト**: `normal-cases.test.ts`

### 2. エッジケース

特殊な状態での動作を確認。

| 分類 | テストケース | 根拠 |
|------|-------------|------|
| 空のTabs | タブ0件でreloadAll | 境界値（エラーなし） |

**対応テスト**: `edge-cases.test.ts`

### 3. 非同期処理

Promise.all()による並列実行を確認。

| 確認事項 | 根拠 |
|---------|------|
| 全reload完了後にresolve | 非同期処理の正確性 |
| 各タブのIDでreloadが呼ばれる | 正しい引数 |

**対応テスト**: `normal-cases.test.ts` 内で確認

## 網羅性チェック

- [x] 複数タブのリロード
- [x] 単一タブのリロード
- [x] 空Tabsでの実行（エラーなし）
- [x] chrome.tabs.reloadが正しいIDで呼ばれる
- [x] Promise.allで全完了を待機
- [ ] 異常系 → chrome API側のエラーは本クラスの責務外

## テストファイル構成

```
tests/unit/frameworks-and-drivers/browser/Tabs/reloadAll/
├── normal-cases.test.ts   # リロード実行（2ケース）
└── edge-cases.test.ts     # エッジケース（1ケース）
```

## モック戦略

chrome.tabs.reloadをグローバルモックで置換。

```typescript
const mockReload = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  vi.stubGlobal('chrome', {
    tabs: {
      reload: mockReload,
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});
```

### 検証ポイント

```typescript
// 呼び出し回数の確認
expect(mockReload).toHaveBeenCalledTimes(expectedCount);

// 各タブIDでの呼び出し確認
expect(mockReload).toHaveBeenCalledWith(tabId1);
expect(mockReload).toHaveBeenCalledWith(tabId2);
```
