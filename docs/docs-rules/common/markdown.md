# Markdown記法のルール

## コードブロックの言語指定

Markdownのコードブロックに言語指定を行うこと:

- TypeScript/JavaScriptコード: `typescript`, `javascript`, `tsx`, `jsx`
- CSSコード: `css`, `scss`
- シェルコマンド: `bash`, `sh`
- ディレクトリ構造: `text`
- 設定ファイル: `json`, `yaml`
- Markdownテンプレート: `markdown`
- その他プレーンテキスト: `text`

## 見出しの記述ルール

### 見出し構文を使用する

見出しには見出し構文（`#`, `##`, `###` など）を使用すること。

- 太字強調（`**text**`）を見出しとして使用しない
- 見出し構文を使用することで、ドキュメント構造が明確になり、目次生成やアウトライン表示がサポートされる

### 見出しレベルの階層

見出しレベルは階層を飛ばさないこと:

- `##` (h2) の直後に `####` (h4) を使用しない（`###` (h3) を経由する）
- 正しい階層: `#` → `##` → `###` → `####`
- 並列の概念は同じ見出しレベルで記述する

### スコープの明示

同一ドキュメント内で類似の見出し名を使う場合、スコープを明示すること:

- 同じ名前や類似の名前（例: 「eslint-rule」）を複数箇所で使うと、どのセクションがどの規約に対応するか曖昧になる
- 見出し名にスコープを含める
- **実在する良い例**: [adr.md](../adr.md) の「## 悪い例（詳細を列挙）」「## 良い例（参照のみ）」のようにスコープを含める

## Lint化について

| 規約 | markdownlintルール | 備考 |
|-----|-------------------|------|
| コードブロックの言語指定必須 | MD040 (fenced-code-language) | ✅ 検証可能 |
| 許可する言語識別子の制限 | MD040 + `allowed_languages` | ✅ 設定で制限可能 |
| 見出しレベルの階層スキップ禁止 | MD001 (heading-increment) | ✅ 検証可能 |
| スコープの明示 | - | PRレビューで確認 |

### markdownlint設定例

```json
{
  "MD040": {
    "allowed_languages": [
      "typescript", "javascript", "tsx", "jsx",
      "css", "scss",
      "bash", "sh",
      "json", "yaml",
      "markdown", "text"
    ]
  }
}
```

→ [User Story 011: markdownlint導入](../../user-stories/user-story-011/README.md)
