# ISSUE-069 PULL REQUEST

## タイトル
feat: RewriteRulesにgetByIdメソッドとsetメソッドを実装

## 概要と理由
RewriteRulesクラスとリポジトリ層に、ID指定によるルール取得機能（getById）と、ルール保存機能のメソッド名統一（save→set）を実施しました。これにより、今後実装予定の編集機能での個別ルール取得が可能になり、命名の一貫性も向上します。

## 主な変更点

### ドメイン層・インフラ層
1. **IRewriteRuleRepository.ts** - save→set名前変更、getByIdメソッド追加
2. **RewriteRuleNotFoundError.ts** (新規) - ID指定のルール取得時のエラークラス
3. **RewriteRules.ts** - add→set名前変更、getByIdメソッド追加
4. **ChromeStorageRewriteRuleRepository.ts** - save→set名前変更、getByIdメソッド実装
5. **SaveRewriteRuleAndApplyToCurrentTabUseCase.ts** - save→setメソッド名変更

### テストコード（ドメイン層）
6. **tests/unit/domain/value-objects/RewriteRules/getById/Abend/error-cases.test.ts** (新規)
7. **tests/unit/domain/value-objects/RewriteRules/getById/normal-cases.test.ts** (新規)
8. **tests/unit/domain/value-objects/RewriteRules/set/normal-cases.test.ts** (add/から移動)

### テストコード（インフラ層）
9. **tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getAll/normal-cases.test.ts** - JSDoc修正
10. **tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getById/normal-cases.test.ts** (新規) - JSDoc追加
11. **tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/getById/Abend/error-cases.test.ts** (新規) - JSDoc追加
12. **tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/set/normal-cases.test.ts** (save/から移動) - JSDoc修正

### テストコード規約整備
13. **.clinerules/03-test-coding-standards.md** - テストコード規約の整備
14. **.clinerules/03-test-coding-standards/01-common-rule/01-02-array-based-test.md** - 配列ベーステスト規約
15. **.clinerules/03-test-coding-standards/01-common-rule/02-JSDoc-rule.md** - JSDoc規約

## テスト方法
[動作確認の手順]
- `docker compose exec frontend npm run test-and-lint` で回帰テスト通過・未使用コードがないことを確認
  - 既存自動テストとlinterを同時に確認
  - 246ユニットテスト成功
  - 7 E2Eテスト成功

## 補足
### レビューフィードバックへの対応
- 1回目レビュー: テストコード規約準拠（異常系テストをAbend/ディレクトリに分離）
- 2回目レビュー: JSDoc規約準拠（各テストケースの具体的な動作を記述）
- 3回目レビュー: レビュー通過

### 実装の段階的な進行
スクラム01では、3回の段階的な修正を経て完了しました:
1. 基本実装とテストコード作成
2. テストコード規約準拠対応（Abend/ディレクトリ分離）
3. JSDoc規約準拠対応（詳細なテストケース説明）

## 本スコープの対象外となったタスク

なし

<!-- ユーザーが使うコマンド workflow:submit-pull-request -->
