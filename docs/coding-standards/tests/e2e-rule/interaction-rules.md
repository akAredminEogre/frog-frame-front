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

### OK例：dispatchEvent()を使用（前提条件検証あり）

```typescript
// ✅ 前提条件を検証してから、Actionabilityチェックをバイパス
const deleteButton = page.locator('[data-testid="delete-button"]');
await expect(deleteButton).toBeVisible();  // 前提条件検証
await deleteButton.dispatchEvent('click');
await deleteButton.dispatchEvent('click');
```

## dispatchEvent使用時の前提条件検証

**重要**: `dispatchEvent`はActionabilityチェックを行わないため、要素が存在しない場合に分かりにくいエラーが発生する。**必ず事前に要素の存在を検証すること**。

### NG例：前提条件検証なし

```typescript
// ❌ 要素が存在しない場合、分かりにくいエラーになる
const deleteButton = page.locator('[data-testid="delete-button"]').first();
await deleteButton.dispatchEvent('click');  // 要素がなければ謎のエラー
```

### OK例：前提条件検証あり

```typescript
// ✅ 要素の存在を明示的に検証してからdispatchEvent
const deleteButton = page.locator('[data-testid="delete-button"]').first();
await expect(deleteButton).toBeVisible();  // 前提条件検証
await deleteButton.dispatchEvent('click');
```

**理由**:
- `click()`は要素が表示されるまで自動で待機するが、`dispatchEvent`は待機しない
- 要素が存在しない場合のエラーメッセージが不明瞭になる
- 前提条件を明示することでデバッグが容易になる

## 非明示的要素のクリック前検証

オーバーレイや動的に生成される要素をクリックする場合、`click()`の前に`toBeVisible()`で明示的に可視性を検証すること。

### 理由

- `click()`はActionabilityチェックを行うが、失敗時のエラーメッセージが「要素が見つからない」か「セレクタが間違っている」かの区別がつきにくい
- 明示的な可視性検証により、「要素が描画されていない」と「セレクタ不一致」を切り分けやすくなる

### 対象となる要素

| 要素タイプ | 例 |
|-----------|-----|
| オーバーレイ | `[data-testid="confirm-dialog-overlay"]` |
| 動的生成要素 | トースト通知、ドロップダウンメニュー |
| 条件付き表示要素 | ローディング完了後に表示されるボタン |

### 例

```typescript
// ❌ 悪い例：オーバーレイクリック時に可視性検証なし
const overlay = page.locator('[data-testid="confirm-dialog-overlay"]');
await overlay.click({ position: { x: 10, y: 10 } });  // 失敗時に原因不明

// ✅ 良い例：可視性を明示的に検証
const overlay = page.locator('[data-testid="confirm-dialog-overlay"]');
await expect(overlay).toBeVisible();  // セレクタ/描画の問題を切り分け
await overlay.click({ position: { x: 10, y: 10 } });
```

## 使い分けの判断基準

| シナリオ | 推奨メソッド | 理由 |
|---------|------------|------|
| 通常のボタンクリック | `click()` | Actionabilityチェックで安定性確保 |
| フォーム送信 | `click()` | 実際のユーザー操作を模倣 |
| 連続クリック防止テスト | `dispatchEvent('click')` | オーバーレイ前のクリックをシミュレート |
| ダブルクリック | `dblclick()` | Playwright組み込みメソッド |
| 素早い操作のレースコンディションテスト | `dispatchEvent('click')` | タイミング制御が必要 |
| オーバーレイ/動的要素クリック | `toBeVisible()` + `click()` | デバッグ容易性向上 |
