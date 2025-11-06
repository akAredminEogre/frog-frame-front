# ISSUE-130 PULL REQUEST

## タイトル
Infrastructure層ディレクトリ名修正: persistance → persistence

## 概要と理由
Infrastructure層のディレクトリ名に含まれていたスペルミス「persistance」を正しい英語表記「persistence」に修正しました。

**背景:**
- `src/infrastructure/persistance` ディレクトリ名が英語として間違っていた
- テストディレクトリも同様のスペルミスがあった
- プロジェクト全体の一貫性と正確性の向上が必要

## 主な変更点

### ディレクトリリネーム
- `src/infrastructure/persistance/` → `src/infrastructure/persistence/`
- `tests/unit/infrastructure/persistance/` → `tests/unit/infrastructure/persistence/`

### インポートパス修正
- `src/infrastructure/di/container.ts` - DIコンテナの登録パス修正
- `src/infrastructure/persistence/indexeddb/DexieRewriteRuleRepository.ts` - 内部インポート修正
- `tests/unit/infrastructure/di/container/concrete-class-registration-completeness.test.ts` - テスト内インポート修正
- 全ての`tests/unit/infrastructure/persistence/`配下のテストファイル - インポートパス修正

### 品質保証
- 全てのユニットテスト(52個)が正常通過
- 全てのE2Eテスト(12個)が正常通過
- lintエラーなし
- TypeScriptコンパイルエラーなし

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認

## 補足
[追加の文脈や注意点]
- 単純なスペルミス修正のため、機能への影響は一切なし
- ディレクトリ構造とインポートパスの整合性を完全に保持
- 全ての関連ファイルを網羅的に修正済み

## 本スコープの対象外となったタスク
なし

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->