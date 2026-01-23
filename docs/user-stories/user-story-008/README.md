# User Story 008: モックファイル配置規約への統一

## ストーリー

> モックファイルをソースディレクトリ構造に合わせた正しい場所に統一配置する

## 概要

[common-rule.md](../../coding-standards/tests/common-rule.md) の「モック作成前の確認手順（必須）」規約に準拠していない既存のモックファイルを正しい配置先に移動する。

## 対象ファイル

以下の重複モックが確認されている:

| 重複モック | 正しい共有モック |
|-----------|-----------------|
| `tests/unit/application-business-rules/interactors/ToggleRuleActiveInteractor/mocks/createMockTabsGateway.ts` | `tests/frameworks-and-drivers/browser/ChromeTabsGateway/createMockTabsGateway.ts` |

その他の対象ファイルは別途調査が必要。

## タスク

（別途策定）

## 受け入れ条件

（別途策定）
