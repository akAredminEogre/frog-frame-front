# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=01
実装が完了したらPROGRESS-01.mdを追記してコードレビューを依頼してください
## スクラム-01(05回目) の進捗

レビューコメントに基づき、Makeコマンド名からハイフンを除去する修正を完了しました。

### 実施内容

#### 1. Makeコマンド名の変更

**変更前 → 変更後:**
- `make test-check` → `make testcheck`
- `make test-lint` → `make testlint`

#### 2. 修正対象ファイル

以下のファイルを新しいコマンド名に合わせて更新:

- **Makefile**
  - Line 1: `.PHONY`宣言を更新 (`test-check test-lint` → `testcheck testlint`)
  - Line 13-14: `help`コマンドの出力を更新
  - Line 75-81: ターゲット名を変更 (`test-check:` → `testcheck:`, `test-lint:` → `testlint:`)

- **CLAUDE.md**
  - Line 36: ワークフロー名を`testcheck`に変更
  - Lines 75, 78: コマンド例を`make testlint`, `make testcheck`に更新
  - Line 77: コメント内の比較を更新 ("softer than `make testlint`")
  - Line 98: `make testlint`に更新
  - Line 242: `make testlint`に更新

- **README.md**
  - Line 54: セクションヘッダーを`testlint`に変更
  - Line 57: コマンド例を`make testlint`に更新
  - Lines 72-73: 利用可能なコマンド一覧を更新

- **.clinerules/05-project-specific-rules.md**
  - Line 42: `make testcheck`に更新

- **.clinerules/02-workflow-automation/02-daily-scrum-starts/test-and-check-before-complete.md**
  - Line 7: コマンドを`make testcheck`に更新

- **docs/issue-000/PULL_REQUEST.md**
  - Line 12: `make testcheck`に更新

#### 3. 設計の一貫性

今回の変更により、Makeコマンドの命名がよりシンプルになりました:

| レイヤー | 形式 | 例 |
|---------|------|-----|
| **Makeコマンド** | ハイフンなし | `make testcheck`, `make testlint`, `make test-all` |
| **npmスクリプト** | コロン区切り | `npm run test:check`, `npm run test:lint`, `npm run test:all` |

注: `test-all`のようにハイフンを含むコマンドは既存のまま維持されています。今回の変更は`testcheck`と`testlint`の2つのコマンドのみです。

### 修正したファイル

- `Makefile`
- `CLAUDE.md`
- `README.md`
- `.clinerules/05-project-specific-rules.md`
- `.clinerules/02-workflow-automation/02-daily-scrum-starts/test-and-check-before-complete.md`
- `docs/issue-000/PULL_REQUEST.md`

### 次回以降のスクラムに先送りする課題
<!-- 本issueで解決するが、本スクラムでは取り扱わない課題 -->

なし

### 本issueの対象外とする課題

なし

### スクラム-01(05回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow-see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow-daily-scrum-pass-review.md -->
make test-all も make testall に変更お願いします
---
