# 概要

`docs/coding-standards/tests/e2e-rule/` ディレクトリを `docs/coding-standards/tests/e2e/` にリネームする。

現在のディレクトリ名 `e2e-rule` は、E2Eテストのコーディング規約であることを示しているが、同階層の他ディレクトリ（`tests/common-rule.md` 等）との命名一貫性や、`e2e/` という簡潔な名称で十分に意味が通じることから、リネームにより可読性・一貫性を改善する。

## 関連リンク

- 対象ディレクトリ: `docs/coding-standards/tests/e2e-rule/`

## 影響範囲

リネームに伴い、以下のファイルで `e2e-rule` への参照パスを `e2e` に更新する必要がある：

| ファイル | 行 | 内容 |
|---------|-----|------|
| `docs-rules/design/07-e2e-test-strategy/format-guideline.md` | 148 | E2Eテストルールのパス参照 |

# 受け入れ条件

- `docs/coding-standards/tests/e2e-rule/` が `docs/coding-standards/tests/e2e/` にリネームされている
- リネーム前のパスへの参照がリポジトリ内に残っていない
- ディレクトリ内のファイル構成・内容に変更がない（パス変更のみ）

# 心配事

- 未マージのブランチで `e2e-rule/` パスを参照している場合、マージ時にコンフリクトが発生する可能性がある

# 制限事項

- ディレクトリ内のファイル内容の変更は本issueのスコープ外

# タスク

- [ ] `docs/coding-standards/tests/e2e-rule/` を `docs/coding-standards/tests/e2e/` に `git mv` でリネーム
- [ ] `docs-rules/design/07-e2e-test-strategy/format-guideline.md` のパス参照を更新
- [ ] リポジトリ全体で `e2e-rule` の残存参照がないことを `grep -r` で確認
