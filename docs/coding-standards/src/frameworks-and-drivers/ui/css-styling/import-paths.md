# CSSインポートパスのルール

## 規約

- `@import`では`tsconfig.json`で定義されているパスエイリアス（`src/*`）を使用すること
- 相対パス（`../`）は使用しないこと

## 禁止事項

- `@import '../../../../../components/tokens.module.css'` のような相対パス

## 許可事項

- `@import 'src/components/tokens.module.css'` のような絶対パス

## 具体例

```css
/* ❌ 悪い例: 相対パス */
@import '../../../../../components/tokens.module.css';

/* ✅ 良い例: 絶対パス */
@import 'src/components/tokens.module.css';
```

## ESLint化について

ESLint化不可（CSSファイル内のインポートパス検証はstylelintの領域。stylelint未導入のためPRレビューで確認）

→ [User Story 010: stylelint導入](../../../../user-stories/user-story-010/README.md)
