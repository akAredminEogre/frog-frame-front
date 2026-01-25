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

## タスク

（別途策定）

## 受け入れ条件

（別途策定）
