# ルール管理

本ディレクトリでは、規約やガイドラインの管理方法について定義する。

## 目次

| ファイル | 説明 |
|---------|------|
| [new-rule-procedure.md](./new-rule-procedure.md) | 新規ルール追加時の原則と手順 |
| [pending-application.md](./pending-application.md) | 適用待ちの箇所の記録方法 |
| [user-story-linkage.md](./user-story-linkage.md) | ガイドライン更新時のユーザーストーリー連携 |

## 概要

### 新規ルール追加時

新しいルールを追加する際は、既存の違反箇所を検索し、可能であれば同一PRで修正する。詳細は[new-rule-procedure.md](./new-rule-procedure.md)を参照。

### 既存コードとの不整合への対応

既存のコードやドキュメントが新規約に適合していない場合、以下の2つのパターンで管理する:

| パターン | 使用場面 | 詳細 |
|---------|---------|------|
| 適用待ちの箇所 | 対象が少数・明確な場合 | [pending-application.md](./pending-application.md) |
| ユーザーストーリー連携 | 対象が多数・調査が必要な場合 | [user-story-linkage.md](./user-story-linkage.md) |

どちらのパターンを使用しても、**新規作成時は必ず新しい規約に従う**点は共通である。
