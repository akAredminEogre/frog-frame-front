# User Story 012: e2e-ruleディレクトリのリネーム

## ストーリー

> E2Eテストのコーディング規約ディレクトリ名が簡潔で一貫性がある

## 概要

`docs/coding-standards/tests/e2e-rule/` ディレクトリを `docs/coding-standards/tests/e2e/` にリネームする。

現在のディレクトリ名 `e2e-rule` は冗長であり、`e2e/` という簡潔な名称で十分に意味が通じる。リネームにより可読性と命名の一貫性を改善する。

## 設計ドキュメント

なし（ディレクトリリネームのみのため設計不要）

## 現状分析

### 差分分類

| 対象 | 変更内容 | 分類 |
|------|---------|------|
| `docs/coding-standards/tests/e2e-rule/` | `e2e/` にリネーム | ディレクトリ移動 |
| `docs-rules/design/07-e2e-test-strategy/format-guideline.md` | パス参照を更新 | パス参照修正 |

### 影響範囲

`e2e-rule` への参照を持つファイル：

| ファイル | 行 | 内容 |
|---------|-----|------|
| `docs-rules/design/07-e2e-test-strategy/format-guideline.md` | 148 | E2Eテストルールのパス参照 |

## 開発戦略

単一PRで完結する小規模タスク。

- [ ] `docs/coding-standards/tests/e2e-rule/` を `docs/coding-standards/tests/e2e/` に `git mv` でリネーム
- [ ] `docs-rules/design/07-e2e-test-strategy/format-guideline.md` のパス参照を更新
- [ ] リポジトリ全体で `e2e-rule` の残存参照がないことを確認

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
