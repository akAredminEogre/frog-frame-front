# CSS スタイリング コーディング規約

## 概要

UI コンポーネントの CSS スタイリングに関する規約。

## 規約一覧

| 規約 | 概要 |
|------|------|
| [インポートパス](./import-paths.md) | `@import`で絶対パス（`src/*`）を使用 |
| [デザイントークン](./design-tokens.md) | CSS変数を使用し、ハードコード色値を禁止 |
| [色コントラスト](./color-contrast.md) | WCAG AA基準を満たすコントラスト比 |
| [タッチターゲットサイズ](./touch-target-size.md) | 最小44x44pxのタッチ領域確保 |

## 関連ドキュメント

- `src/components/tokens.module.css` - デザイントークン定義ファイル
- [User Story 009: stylelint導入](../../../../user-stories/user-story-009/README.md) - stylelintによる自動検証
