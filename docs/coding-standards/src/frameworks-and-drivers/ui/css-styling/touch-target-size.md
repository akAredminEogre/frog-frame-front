# タッチターゲットサイズのアクセシビリティ要件

## 原則

インタラクティブ要素は最小44x44ピクセルのタッチターゲットサイズを確保すること。

ボタン、リンク、アイコンなどのクリック/タップ可能な要素は、WCAG 2.1 Level AAAおよびモバイルベストプラクティスに準拠するため、最小44x44ピクセルのサイズを確保する。

## 必須プロパティ

| プロパティ | 値 | 目的 |
|-----------|-----|------|
| `min-width` | `44px` | 横方向のタッチ領域確保 |
| `min-height` | `44px` | 縦方向のタッチ領域確保 |

## 適用対象

- ボタン（`<button>`）
- アイコンボタン
- 閉じるボタン（×）
- リンク（主要なナビゲーション）
- トグルスイッチ

## 具体例

```css
/* ✅ 良い例: 44x44pxを確保 */
.iconButton {
  min-width: 44px;
  min-height: 44px;
}

/* ❌ 悪い例: サイズが小さい */
.iconButton {
  min-width: 32px;
  min-height: 32px;
}
```

## ESLint化について

ESLint化不可（CSSファイル内のサイズ値検証はstylelintの領域。stylelint未導入のためPRレビューで確認）

→ [User Story 009: stylelint導入](../../../../user-stories/user-story-009/README.md)
