# インタラクションルール

E2Eテストにおけるユーザー操作シミュレーションのルール。

## click() vs dispatchEvent('click')

Playwrightの`click()`と`dispatchEvent('click')`は異なる挙動をする。用途に応じて使い分けること。

### click() - 通常のクリック操作

```typescript
await button.click();
```

**特徴**:
- Actionabilityチェック（要素が表示・有効・クリック可能になるまで待機）
- オーバーレイやモーダルによるブロックを検知
- 実際のユーザー操作に近い挙動

**用途**: 通常のクリック操作

### dispatchEvent('click') - 即時イベント発火

```typescript
await button.dispatchEvent('click');
```

**特徴**:
- Actionabilityチェックなし（即座にイベント発火）
- オーバーレイやモーダルの影響を受けない
- 要素が存在すれば即座にクリックイベントを発火

**用途**: 素早い連続クリック、オーバーレイ表示前のクリックシミュレーション

## 素早い連続クリックのテスト

重複防止機能（例：ダイアログの多重表示防止）をテストする場合、`dispatchEvent`を使用する。

### NG例：click()を使用

```typescript
// ❌ 最初のクリックでダイアログが開くと、
// オーバーレイが2回目のクリックをブロックしてタイムアウトする
const deleteButton = page.locator('[data-testid="delete-button"]');
await deleteButton.click();
await deleteButton.click();  // タイムアウト
```

### OK例：dispatchEvent()を使用

```typescript
// ✅ Actionabilityチェックをバイパスし、
// オーバーレイ表示前に複数クリックをシミュレート
const deleteButton = page.locator('[data-testid="delete-button"]');
await deleteButton.dispatchEvent('click');
await deleteButton.dispatchEvent('click');
```

## 使い分けの判断基準

| シナリオ | 推奨メソッド | 理由 |
|---------|------------|------|
| 通常のボタンクリック | `click()` | Actionabilityチェックで安定性確保 |
| フォーム送信 | `click()` | 実際のユーザー操作を模倣 |
| 連続クリック防止テスト | `dispatchEvent('click')` | オーバーレイ前のクリックをシミュレート |
| ダブルクリック | `dblclick()` | Playwright組み込みメソッド |
| 素早い操作のレースコンディションテスト | `dispatchEvent('click')` | タイミング制御が必要 |
