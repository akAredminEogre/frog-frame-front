# CSS スタイリング コーディング規約

## 概要

UI コンポーネントの CSS スタイリングに関する規約。

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

## eslint-rule

ESLint 化不可（CSS ファイル内の色値検出は stylelint の領域。stylelint 未導入のため PR レビューで確認）

## 関連ドキュメント

- `src/components/tokens.module.css` - デザイントークン定義ファイル
