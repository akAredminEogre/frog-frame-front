# CLAUDE.md 編集ガイドライン

## 目的

CLAUDE.mdとREADME.mdの重複を防ぎ、DRY（Don't Repeat Yourself）原則を維持する。

## 基本原則

CLAUDE.mdは**Claude Code専用の指示**を記載するファイルであり、一般的なセットアップ手順やコマンド一覧はREADME.mdに記載する。

## 編集前チェックリスト

CLAUDE.mdを編集する前に、以下を確認すること：

1. [ ] **README.mdとの重複確認**: 追加・編集しようとしている内容がREADME.mdに既に存在しないか確認
   ```bash
   # 例: make コマンドに関する記述を検索
   grep -n "make " README.md
   ```
2. [ ] **重複がある場合**: 詳細はREADME.mdに記載し、CLAUDE.mdからは参照リンクを使用
3. [ ] **CLAUDE.md固有の内容のみ記載**: Claude Codeに特有の指示（pre-commit hooks、TodoWrite使用ルール等）

## 重複を避けるべき内容

以下の内容はREADME.mdに記載し、CLAUDE.mdからは参照のみとすること：

| 内容 | 記載先 | CLAUDE.mdでの記載方法 |
|------|--------|----------------------|
| セットアップ手順 | README.md | `→ 詳細は [README.md](README.md) を参照` |
| 利用可能なコマンド一覧 | README.md | 必須コマンドのみ抜粋 |
| プロジェクト構造 | README.md | 参照のみ |
| トラブルシューティング | README.md / CLAUDE.md | 共通は README.md、Claude Code固有は CLAUDE.md |

## CLAUDE.md固有で記載すべき内容

以下の内容はCLAUDE.mdに記載する（README.mdには記載しない）：

- タスク別チェックリスト（実装前に確認すべき項目）
- `make init-hooks` （Claude Codeでのpre-commitフック設定）
- `make testlint` の必須実行ルール
- TodoWrite使用ルール
- アーキテクチャルール（レイヤー分離、DI等）
- Import Path Rules
- Testing Requirements（テスト戦略書作成ルール等）
- Claude Code Web専用ワークフロー

## 参照形式の書き方

```markdown
## セクション名

→ 詳細は [README.md](README.md) を参照

### Claude Code固有の追加設定

（ここにClaude Code固有の内容を記載）
```

## 違反例と修正例

### 違反例

```markdown
## Common Development Commands

### Initial Setup (First Time Only)

make init-config    # Apply Git configuration
make init-dev       # Build containers...
make init-hooks     # Install Git hooks...
```

↑ `make init-config` と `make init-dev` はREADME.mdと重複

### 修正例

```markdown
## Common Development Commands

→ セットアップ手順・利用可能なコマンド一覧は [README.md](README.md) を参照

### Claude Code固有の追加セットアップ

make init-hooks     # Install Git hooks (pre-commit: ESLint with import sorting, stylelint, markdownlint)
```

↑ README.mdへの参照 + Claude Code固有の `make init-hooks` のみ記載
