# シェルスクリプト コーディングガイドライン

## エラー出力の規約

すべてのエラーメッセージは stdout ではなく stderr（`>&2`）に出力すること。

### ルール

```bash
# 正しい: エラーメッセージを stderr に出力
echo "Error: Something went wrong" >&2

# 誤り: エラーメッセージを stdout に出力
echo "Error: Something went wrong"
```

### 理由

1. **関心の分離**: stdout は通常出力、stderr はエラー用
2. **パイプラインの安全性**: エラーがパイプラインを汚染しない（`cmd1 | cmd2`）
3. **ログ取得**: stderr を別途リダイレクトしてエラーログを取得可能
4. **スクリプト合成**: 呼び出し元が成功出力とエラーを区別できる

### 例

```bash
# ファイル存在確認
if [ ! -f "${CONFIG_FILE}" ]; then
    echo "Error: Config file not found at ${CONFIG_FILE}" >&2
    exit 1
fi

# コマンド実行失敗
if ! some_command; then
    echo "Error: some_command failed" >&2
    exit 1
fi

# 複数行のエラーメッセージ
if [ ! -d "${REQUIRED_DIR}" ]; then
    echo "Error: Required directory not found: ${REQUIRED_DIR}" >&2
    echo "Please run setup script first." >&2
    exit 1
fi
```

### 警告メッセージ

警告メッセージ（致命的でない）も stderr に出力する:

```bash
echo "Warning: Optional dependency not found. Some features disabled." >&2
```

### 情報メッセージ

通常動作の一部である情報メッセージは stdout に出力する:

```bash
echo "Installing dependencies..."
echo "Setup complete!"
```

## npm チェックロジックの一貫性

Node.js ツールの利用可否をチェックする際は、以下の一貫性を確保すること:

- npx の利用可否
- npm の利用可否
- Node.js のバージョン要件

### ルール

スクリプトが npm 操作（`npm install` など）を必要とする場合、`npx` と `npm` の両方をチェックする:

```bash
# npx が利用可能か確認
if ! command -v npx >/dev/null 2>&1; then
    echo "Warning: npx command not found. Skipping setup." >&2
    exit 0
fi

# npm が利用可能か確認（npm install に必要）
if ! command -v npm >/dev/null 2>&1; then
    echo "Warning: npm command not found. Skipping setup." >&2
    exit 0
fi
```

### 理由

- npx と npm は通常一緒にインストールされるが、保証されていない
- 一部の環境では npm なしで npx のみが存在する場合がある（カスタムツーリングなど）
- `npm install` を実行するスクリプトは、npm が存在しない場合に不明確なエラーで失敗する

## 終了コードの規約

| 終了コード | 意味 |
|-----------|------|
| 0 | 成功、または正常スキップ（オプション依存が満たされない場合） |
| 1 | エラー（stderr メッセージ付き） |

**注**: 正常スキップは成功と同じ終了コード `0` を使用する。これはオプション機能の欠如がエラーではないことを示す。

### 正常スキップの例

```bash
# Git がインストールされていない場合 - 正常にスキップ
if ! command -v git >/dev/null 2>&1; then
    echo "Warning: git not found. Skipping pre-commit hook setup." >&2
    exit 0  # エラーではなく、単にスキップ
fi
```
