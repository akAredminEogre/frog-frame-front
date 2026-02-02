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

### クロスプラットフォーム互換性

実行権限が保持されない環境（ZIP展開、Windows等）を考慮する。

**推奨パターン:**

1. **settings.jsonでのスクリプト実行**: `bash` 経由で実行する
   - 直接実行: `"$CLAUDE_PROJECT_DIR/script.sh"` → 権限エラーの可能性
   - bash経由: `bash "$CLAUDE_PROJECT_DIR/script.sh"` → 安全

2. **フルセットアップスクリプトの呼び出し**: `exec bash` を使用する

3. **fast-checkでの実行権限確認**: `-x` フラグでhookが実行可能かも確認する
   - `-f` のみ: ファイル存在のみ確認（不十分）
   - `-x`: 存在 + 実行権限を確認（推奨）

### エラーハンドリング

`set -e` 使用時は、ファイル欠如で曖昧なエラーが発生する。明示的なチェックで原因を明確化する。

**推奨パターン:**

1. **sourceする前に存在確認**: 共有定数ファイル等をsourceする前に`-f`で確認
2. **明確なエラーメッセージ**: ファイルパスと対処方法を含める
3. **早期リターン**: 致命的なエラーは即座に`exit 1`

### 必須コマンドの一貫したチェック

SessionStart hookでは、必須コマンドの欠如時に一貫した動作を保つ。

**推奨パターン:**

1. **graceful skip**: 環境依存のコマンド（git, npx等）が無い場合は警告して`exit 0`
2. **一貫性**: 全ての必須コマンドで同じスキップパターンを使用
3. **ユーザーガイダンス**: 対処方法（例: "Install Node.js to enable..."）を表示

**悪い例**: gitは`exit 0`でスキップ、npxは`exit 1`で失敗 → 不一致

### 設定ファイルの配置

| ファイル | スコープ | Git管理 |
|---------|--------|--------|
| `.claude/settings.json` | プロジェクト共有 | 対象 |
| `.claude/settings.local.json` | マシン固有 | 対象外 |
| `~/.claude/settings.json` | ユーザー全体 | - |

プロジェクト全体で共有すべき設定は`.claude/settings.json`に配置する。

## 関連ドキュメント

- [Claude Code Hooks公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/hooks)
