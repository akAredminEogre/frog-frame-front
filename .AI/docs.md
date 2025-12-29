# docs/ 配下のドキュメント作成・編集ガイドライン

## 基本原則

`docs/` 配下のドキュメントを作成・編集する際は、対応する `docs/docs-rules/` 配下のガイドラインに従うこと。

### ガイドラインの階層

ガイドラインは階層構造になっており、**該当レベルのガイドラインとすべての上位ガイドライン**に準拠する必要がある。

例: `docs/design/pages/rule-list/features/delete-rule/integration-test-strategy.md` を作成する場合

1. `docs/docs-rules/common.md` （共通ルール）
2. `docs/docs-rules/design/` 配下の該当ガイドライン（例: `06-integration-test-strategy.md`）

## チェックリスト

1. [ ] **該当するガイドラインを確認**: `docs/docs-rules/` 配下で対応するガイドラインを探す
2. [ ] **必須セクションを確認**: 各ガイドラインの「必須セクション」表を参照
3. [ ] **配置ルールを確認**: ファイルの配置場所がガイドラインに準拠していることを確認
4. [ ] ドキュメントを作成・編集
