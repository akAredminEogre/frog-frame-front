# User Story 008: モックファイル配置規約への統一

## ストーリー

> モックファイルをソースディレクトリ構造に合わせた正しい場所に統一配置する

## 概要

[common-rule.md](../../coding-standards/tests/common-rule.md) の「モック作成前の確認手順（必須）」規約に準拠していない既存のモックファイルを正しい配置先に移動する。

## 対象ファイル

以下の重複モックが確認された:

| 重複モック | 正しい共有モック | ステータス |
|-----------|-----------------|-----------|
| `tests/unit/application-business-rules/interactors/ToggleRuleActiveInteractor/mocks/createMockTabsGateway.ts` | `tests/frameworks-and-drivers/browser/ChromeTabsGateway/mocks/createMockTabsGateway.ts` | ✅ 解消済み |

## タスク

- [x] 重複モックファイルの調査・特定
- [x] 影響を受けるテストファイルの特定
- [x] テストファイルのインポートパスを正しい共有モックに修正
  - `normal-cases.test.ts`
  - `error-cases.test.ts`
  - `partial-success-cases.test.ts`
- [x] 重複モックファイルの削除

## 受け入れ条件

- [x] 同一インターフェースのモックが複数箇所に存在しないこと
- [x] すべてのテストが正しい共有モックを参照していること
- [x] 重複モックファイルが削除されていること
