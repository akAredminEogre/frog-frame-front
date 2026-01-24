# CSS スタイリング コーディング規約

## 概要

UI コンポーネントの CSS スタイリングに関する規約。

## CSSインポートパスのルール

### 規約

- `@import`では`tsconfig.json`で定義されているパスエイリアス（`src/*`）を使用すること
- 相対パス（`../`）は使用しないこと

### 禁止事項

- `@import '../../../../../components/tokens.module.css'` のような相対パス

### 許可事項

- `@import 'src/components/tokens.module.css'` のような絶対パス

### 具体例

```css
/* ❌ 悪い例: 相対パス */
@import '../../../../../components/tokens.module.css';

/* ✅ 良い例: 絶対パス */
@import 'src/components/tokens.module.css';
```

### ESLint化について

ESLint化不可（CSSファイル内のインポートパス検証はstylelintの領域。stylelint未導入のためPRレビューで確認）

---

## デザイントークンの使用

### 規約

- カラー値は必ず CSS 変数（デザイントークン）を使用する
- ハードコードされた色値（`#xxxxxx`、`rgb()`、`rgba()`）は原則禁止
- 新しい色が必要な場合は `tokens.module.css` にトークンを追加する

### 禁止事項

- コンポーネント CSS 内での直接的な色値指定

### 許可事項

- `rgba(0, 0, 0, X)` 形式の透明度指定（オーバーレイ背景など、色相を持たない場合）
- `transparent` キーワードの使用

### トークンファイルの場所

`src/components/tokens.module.css`

### トークンの命名規則

| カテゴリ | プレフィックス | 例 |
|---------|---------------|-----|
| 色 | `--color-` | `--color-primary`, `--color-danger` |
| ホバー色 | `--color-*-hover` | `--color-primary-hover`, `--color-danger-hover` |
| コントラスト色 | `--color-*-contrast` | `--color-primary-contrast` |
| サイズ | `--size-` | `--size-sm`, `--size-md` |
| 間隔 | `--spacing-` | `--spacing-md`, `--spacing-lg` |
| フォント | `--font-` | `--font-size-md`, `--font-weight-bold` |
| ボーダー | `--border-` | `--border-radius`, `--border-width` |
| シャドウ | `--shadow-` | `--shadow-sm` |

### 新規トークン追加時のルール

1. 既存トークンで代用できないか確認する
2. トークン名は用途ではなく意味で命名する（例: `--color-delete-button` ではなく `--color-danger`）
3. ホバー状態がある場合は対応する `-hover` トークンも追加する
4. コントラスト色を定義する場合はWCAG AA基準を満たすことを確認する

### 具体例

**例1: 削除ボタン用の色が必要な場合**

1. 既存トークン確認: `--color-danger` が既に存在するか確認
2. 命名: `--color-delete-button` ではなく `--color-danger` を使用（意味で命名）
3. ホバー色: `--color-danger-hover` も追加
4. コントラスト検証: `--color-danger` (#c53030) + `--color-danger-contrast` (#fff) = 約5.14:1 (基準4.5:1以上をクリア)

**例2: WCAG AA基準を満たすための色修正**

当初 `--color-danger: #dc3545` を使用していたが、白文字とのコントラスト比が約4.48:1でWCAG AA基準(4.5:1)を下回っていた。`#c53030` に変更することで約5.14:1となり基準をクリア。

---

## 色コントラストのアクセシビリティ要件

### 原則: 背景色とテキスト色のコントラスト比はWCAG AA基準を満たすこと

新しいカラートークンを追加する際、背景色と前景色（テキスト色）の組み合わせがWCAG AA基準を満たすことを確認する。

### WCAG AA基準

| 用途 | 最小コントラスト比 |
|------|-------------------|
| 通常テキスト（18px未満） | 4.5:1 |
| 大きなテキスト（18px以上、または14px太字） | 3:1 |
| UIコンポーネント・グラフィック | 3:1 |

### 検証方法

- オンラインツール（WebAIM Contrast Checker等）でコントラスト比を確認
- 新しい `--color-*` と `--color-*-contrast` の組み合わせを追加する際は必ず検証

### コントラスト比検証のESLint化について

ESLint化不可（色のコントラスト比は静的解析で検証困難。PRレビューで確認）

---

## タッチターゲットサイズのアクセシビリティ要件

### 原則: インタラクティブ要素は最小44x44ピクセルのタッチターゲットサイズを確保すること

ボタン、リンク、アイコンなどのクリック/タップ可能な要素は、WCAG 2.1 Level AAAおよびモバイルベストプラクティスに準拠するため、最小44x44ピクセルのサイズを確保する。

### 必須プロパティ

| プロパティ | 値 | 目的 |
|-----------|-----|------|
| `min-width` | `44px` | 横方向のタッチ領域確保 |
| `min-height` | `44px` | 縦方向のタッチ領域確保 |

### 適用対象

- ボタン（`<button>`）
- アイコンボタン
- 閉じるボタン（×）
- リンク（主要なナビゲーション）
- トグルスイッチ

### 具体例

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

### ESLint化について

ESLint化不可（CSSファイル内のサイズ値検証はstylelintの領域。stylelint未導入のためPRレビューで確認）

---

## デザイントークン使用のESLint化について

ESLint 化不可（CSS ファイル内の色値検出は stylelint の領域。stylelint 未導入のため PR レビューで確認）

## 関連ドキュメント

- `src/components/tokens.module.css` - デザイントークン定義ファイル
