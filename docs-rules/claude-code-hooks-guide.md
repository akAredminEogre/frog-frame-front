# Claude Code Hooks ガイドライン

Claude Code hooksを設定する際のベストプラクティス。

## SessionStart Hook

### パフォーマンス考慮事項

SessionStart hookはセッション開始時に毎回実行されるため、起動時間に直接影響する。

#### 軽量チェックパターン（推奨）

重い処理を行うスクリプトを直接呼び出さず、軽量なチェックスクリプトを経由する。

**構成例:**

- `check-and-setup.sh`: 軽量チェック + 必要時のみフルセットアップ呼び出し
- `main.sh`: フルセットアップ処理

**チェックスクリプトの要件:**

1. ファイル存在確認など、高速に完了する検証のみ実行
2. 既にセットアップ済みの場合は即座に`exit 0`
3. 未セットアップの場合のみフルスクリプトを`exec`で呼び出す

参照実装: `scripts/ci/precommit-hook/check-and-setup.sh`

### パスのクォーティング

`$CLAUDE_PROJECT_DIR`などの環境変数を使用する場合、プロジェクトパスにスペースが含まれる可能性を考慮する。

**settings.json での記述:**

コマンド全体をダブルクォートで囲む（JSON内でエスケープが必要）。

参照: `.claude/settings.json`

### 設定ファイルの配置

| ファイル | スコープ | Git管理 |
|---------|--------|--------|
| `.claude/settings.json` | プロジェクト共有 | 対象 |
| `.claude/settings.local.json` | マシン固有 | 対象外 |
| `~/.claude/settings.json` | ユーザー全体 | - |

プロジェクト全体で共有すべき設定は`.claude/settings.json`に配置する。

## 関連ドキュメント

- [Claude Code Hooks公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/hooks)
