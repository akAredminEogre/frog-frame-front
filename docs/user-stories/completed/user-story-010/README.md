# User Story 010: stylelint導入

## ストーリー

> CSSファイルのコーディング規約をstylelintで自動検証できる

## 概要

現在手動でPRレビュー時に確認しているCSSコーディング規約を、stylelintにより自動検証可能にする。これにより規約違反を早期に検出し、レビュー負荷を軽減する。

## 背景

[css-styling/](../../coding-standards/src/frameworks-and-drivers/ui/css-styling/index.md) で定義されている以下の規約は、現在ESLint化不可としてPRレビューで確認している:

- CSSインポートパスのルール（絶対パス使用）
- デザイントークンの使用（ハードコード色値の禁止）
- タッチターゲットサイズ（最小44x44px）
- 色コントラスト比（WCAG AA基準）

stylelintを導入することで、これらの一部または全部を自動検証可能にする。

## 完了状況

**ステータス: 基本導入完了**

### 導入済み機能

- [x] stylelint v16.26.1 インストール
- [x] stylelint-config-standard v38.0.0 インストール
- [x] stylelint.config.js 作成
- [x] npm scripts 追加（`stylelint`, `stylelint:fix`）
- [x] pre-commit フック（lefthook）に stylelint 追加
- [x] stylelint-rules/ ディレクトリでのルール分割
- [x] CSS コーディング規約ドキュメントとの紐づけ
- [x] CI（GitHub Actions）に stylelint チェック追加

### 自動検証の対応状況

| 規約 | 自動検証 | 備考 |
|------|----------|------|
| CSS Modules 構文 | ✅ 対応 | `:global`, `:local`, `composes` を許可 |
| 標準 CSS 構文チェック | ✅ 対応 | stylelint-config-standard による |
| インポートパス（絶対パス） | ❌ 未対応 | 標準ルールなし、PRレビューで確認 |
| デザイントークン使用 | ❌ 未対応 | 例外が多いため、PRレビューで確認 |
| タッチターゲットサイズ | ❌ 未対応 | CSS値の検証は困難、PRレビューで確認 |
| 色コントラスト比 | ❌ 未対応 | 計算が必要、PRレビューで確認 |

## ファイル構成

```
host-frontend-root/frontend-src-root/
├── stylelint.config.js          # メイン設定ファイル
├── stylelint-rules/
│   ├── base.js                  # 基本設定
│   ├── css-modules.js           # CSS Modules 対応ルール
│   └── import-paths.js          # インポートパスルール（ドキュメント紐づけ）
└── package.json                 # npm scripts, #stylelint-rules/* エイリアス
```

## 使用方法

```bash
# CSS ファイルの lint 実行
docker compose exec frontend npm run stylelint

# 自動修正付き lint 実行
docker compose exec frontend npm run stylelint:fix
```

## 関連ドキュメント

- [CSS スタイリング コーディング規約](../../coding-standards/src/frameworks-and-drivers/ui/css-styling/index.md)
- [CLAUDE.md](../../../CLAUDE.md) - Inside Container Commands セクション
