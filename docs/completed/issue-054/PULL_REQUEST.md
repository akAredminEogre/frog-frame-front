# ISSUE-054 PULL REQUEST

## タイトル
E2Eテストのリファクタリング

## 概要と理由
E2Eテストの構造とロジックの改善を実施し、テストの可読性と保守性の向上を図るためのリファクタリング作業を行いました。テストコードの品質向上により、今後の開発効率とメンテナンス性の向上を目的としています。

## 主な変更点
- **E2Eテストファイルの改修**
  - `host-frontend-root/frontend-src-root/tests/e2e/save-and-replace.spec.ts`
  - `host-frontend-root/frontend-src-root/tests/e2e/get-origin.spec.ts`
  - `host-frontend-root/frontend-src-root/tests/e2e/ignore-crlf-replace-with-regex.spec.ts`
  - `host-frontend-root/frontend-src-root/tests/e2e/ignore-crlf-replace.spec.ts`
- **Playwright設定ファイルの改修**
  - `host-frontend-root/frontend-src-root/playwright.config.ts`
- **テストの構造とロジックの改善**
- **可読性と保守性の向上**

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認

## 補足
[追加の文脈や注意点]
- E2Eテストのリファクタリング作業は計画通りに実施され、特に大きな問題は発生しませんでした
- 複数のテストファイルを体系的に改修することができました
- Playwright設定ファイルも含めて包括的な対応を実施しました

## 本スコープの対象外となったタスク
現時点で対象外となったタスクはありません。
