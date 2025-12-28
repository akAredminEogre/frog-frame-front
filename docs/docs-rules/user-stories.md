# user-stories ドキュメントルール

## ディレクトリ構造

```text
docs/user-stories/
├── user-story-{番号}/           # 作業中のユーザーストーリー
│   ├── README.md                 # 必須: ストーリー概要
│   ├── acceptance-criteria.md    # 必須: 受け入れ条件
│   └── network-diagram.puml      # 任意: タスク依存ネットワーク図
└── completed/                    # 完了したユーザーストーリー
    └── user-story-{番号}/
```

## 命名規則

### ディレクトリ名

- 形式: `user-story-{3桁番号}`
- 番号: 001から連番
- 例: `user-story-001`, `user-story-002`

## ファイル別ガイドライン

各ファイルの詳細なガイドラインは以下を参照:

| ファイル | ガイドライン | 必須 |
|---------|-------------|------|
| README.md | [readme-guide.md](./user-stories/readme-guide.md) | ○ |
| acceptance-criteria.md | [acceptance-criteria-guide.md](./user-stories/acceptance-criteria-guide.md) | ○ |
| network-diagram.puml | [network-diagram-guide.md](./user-stories/network-diagram-guide.md) | - |

## 関連ドキュメント

- **共通ルール（必読）**: [common.md](./common.md) - マークダウン記法、文体など全ドキュメント共通のルール
- 設計ドキュメント: `docs/design/pages/{画面名}/features/{機能名}/`
- ADR: `docs/adr/`
- 基本ルール: [docs-rules.md](../docs-rules.md)
