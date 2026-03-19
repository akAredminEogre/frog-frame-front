# user-stories ドキュメントルール

## ディレクトリ構造

```text
docs/user-stories/
├── user-story-{番号}/           # 作業中のユーザーストーリー
│   ├── README.md                 # 必須: ストーリー概要
│   ├── acceptance-criteria.md    # 必須: 受け入れ条件（※テンプレートの場合は省略可）
│   └── 04-network-diagram.puml   # 必須: アローダイアグラム（タスク依存ネットワーク図）
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
| 04-network-diagram.puml | [network-diagram-guide.md](./user-stories/network-diagram-guide.md) | ○ |

## 関連ドキュメント

- **共通ルール（必読）**: [common/index.md](./common/index.md) - マークダウン記法、文体など全ドキュメント共通のルール
- 設計ドキュメント: `docs/design/pages/{画面名}/features/{機能名}/`
- ADR: `docs/adr/`

---

## 新規ユーザーストーリー（YAML形式）

2026-03-20以降に新規作成するユーザーストーリーは全てYAML形式とする。
既存のMD形式ドキュメントは変換不要・永久維持。

### ファイル命名規則

- ファイル名: `user-story-{連番3桁}.yaml`（例: `user-story-023.yaml`）
- 格納先: `docs/user-stories/`
- 完了後: `docs/user-stories/completed/` に移動

### 連番確認コマンド（MD/YAML両方チェック）

```bash
ls docs/user-stories/ | grep -E 'user-story-[0-9]+' | sort
```

### 必須フィールド（YAMLスキーマ）

```yaml
id: user-story-023
type: feature             # feature | bugfix | refactor | scope-out | template
title: "ユーザーストーリータイトル"
created_at: "2026-03-20"
status: pending           # pending | in-progress | done | deferred | wont-fix
story: |
  ストーリー本文
acceptance_criteria:
  - "受け入れ条件1"
  - "受け入れ条件2"
related_prs:
  source_pr: null         # スコープ外指摘の場合: 指摘元PR番号
  implementation_pr: null # 実装PR番号（未定はnull）
```

### type別最小フィールド

| type | 最小必須フィールド |
|------|-----------------|
| feature | id, type, title, created_at, status, story, acceptance_criteria |
| scope-out | id, type, title, created_at, status, story, related_prs.source_pr |
| bugfix | id, type, title, created_at, status, story, acceptance_criteria |

### スコープ外指摘フロー

1. PRレビューでスコープ外指摘受信
2. `docs/user-stories/user-story-{次番号}.yaml` を作成（type: scope-out）
3. レビュアーへ返信: 「user-story-NNN.yamlで追跡します。別PRで対応します。」
4. 対応PR完了後 → `completed/` に移動
