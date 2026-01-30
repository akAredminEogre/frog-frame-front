# user-stories ドキュメントルール

## ディレクトリ構造

```text
docs/user-stories/
├── user-story-{番号}/           # 作業中のユーザーストーリー
│   ├── README.md                 # 必須: ストーリー概要
│   ├── acceptance-criteria.md    # 必須: 受け入れ条件（※テンプレートの場合は省略可）
│   └── network-diagram.puml      # 任意: タスク依存ネットワーク図
└── completed/                    # 完了したユーザーストーリー
    └── user-story-{番号}/
```

※テンプレートユーザーストーリーについては「[テンプレートユーザーストーリー](#テンプレートユーザーストーリー)」セクションを参照

## 命名規則

### ディレクトリ名

- 形式: `user-story-{3桁番号}`
- 番号: 001から連番
- 例: `user-story-001`, `user-story-002`

### 新規ユーザーストーリー作成時のルール

新しいユーザーストーリーを作成する際は、以下を確認すること:

1. **既存番号の確認（必須）**: 使用予定の番号が既に存在しないか確認する
   ```bash
   ls docs/user-stories/ | grep user-story-
   ```
2. **次の連番を使用**: 既存の最大番号 + 1 を使用する
3. **既存ストーリーの上書き禁止**: 別の目的のユーザーストーリーで既存番号を再利用しない

**よくある間違い**:

| 間違い | 正しい対応 |
|-------|-----------|
| 既存のuser-story-009を別目的で上書き | 新しい番号（user-story-010）を採番 |
| 完了済みストーリーと同じ番号を使用 | `completed/`配下も含めて番号を確認 |

## テンプレートユーザーストーリー

ガイドライン更新PRで作成するユーザーストーリーは、以下の条件で「テンプレート」として作成できる:

- タスク・受け入れ条件は「（別途策定）」と記載
- `acceptance-criteria.md`は未作成でよい
- 詳細策定は別途PRで対応

詳細は[ガイドライン更新時のユーザーストーリー連携](./common/rule-management/user-story-linkage.md)を参照。

## ファイル別ガイドライン

各ファイルの詳細なガイドラインは以下を参照:

| ファイル | ガイドライン | 必須 |
|---------|-------------|------|
| README.md | [readme-guide.md](./user-stories/readme-guide.md) | ○ |
| acceptance-criteria.md | [acceptance-criteria-guide.md](./user-stories/acceptance-criteria-guide.md) | ○ |
| network-diagram.puml | [network-diagram-guide.md](./user-stories/network-diagram-guide.md) | - |

## 関連ドキュメント

- **共通ルール（必読）**: [common/index.md](./common/index.md) - マークダウン記法、文体など全ドキュメント共通のルール
- 設計ドキュメント: `docs/design/pages/{画面名}/features/{機能名}/`
- ADR: `docs/adr/`
- 基本ルール: [ドキュメント共通ルール](./common/index.md)
