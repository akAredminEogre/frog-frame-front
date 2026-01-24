# User Story 006: ADRコード例ルールへの統一

## ストーリー

> ADRからコード例を削除し、ドキュメントとコードの乖離を防ぐ

## 概要

[docs/docs-rules/common.md](../../docs-rules/common.md) の「コード例の記載ルール」に準拠していない既存ADRを更新する。

## 対象ファイル

調査の結果、以下のADRがTypeScriptコード例を含んでいた(修正前):

| ADR | コード例の内容 | 行番号(修正前) |
|-----|--------------|----------------|
| [ADR-002](../../adr/002-messaging-with-webext-core.md) | proxy-service実装パターン | 100-139行目 |
| [ADR-004](../../adr/004-tabs-collection-layer-placement.md) | Tabsクラス実装 | 75-97行目 |
| [ADR-004](../../adr/004-tabs-collection-layer-placement.md) | アンチパターン例 | 119-145行目 |
| [ADR-004](../../adr/004-tabs-collection-layer-placement.md) | 正しいアプローチ例 | 210-225行目 |

**対応状況**: 上記のコード例はすべて図表形式に置き換え済み。

以下のADRはコード例を含んでいなかった(対応不要):
- ADR-001: アスキーアート図のみ
- ADR-005: アスキーアート図のみ
- ADR-008: ディレクトリ構造のみ
- ADR-009: ディレクトリ構造のみ

## タスク

1. ADR-002からTypeScriptコード例を削除
   - 実装注入パターンの説明をテキストベースに変更
   - 必要に応じて実装ファイルへの参照を追加
2. ADR-004からTypeScriptコード例を削除
   - Tabsクラスの実装例をテキストベースの説明に変更
   - アンチパターン/正しいアプローチの説明を図表形式に変更
   - 実装ファイルへの参照を追加

## 受け入れ条件

[acceptance-criteria.md](./acceptance-criteria.md) を参照
