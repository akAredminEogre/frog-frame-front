# ISSUE-101 PULL REQUEST

## タイトル
refactor: App.tsxのchrome.storage.local直接呼び出しをClean ArchitectureのUseCaseパターンで抽象化

## 概要と理由
App.tsxのuseEffect内でchrome.storage.localが直接呼び出されていたため、Clean Architectureの観点からUseCaseパターンを使用した適切な層間分離を実現しました。

**問題点**:
- Presentation層（App.tsx）でInfrastructure層（chrome.storage.local）を直接呼び出し
- Clean Architectureの依存関係ルール違反
- テスタビリティとメンテナンス性の低下

**解決策**:
- GetSelectedPageTextUseCaseを作成し、ビジネスロジックをApplication層に移動
- ISelectedPageTextRepositoryインターフェースでInfrastructure層を抽象化
- DIコンテナによる依存関係注入を実装

## 主な変更点

### 新規作成ファイル
- `src/domain/value-objects/SelectedPageText.ts` - 選択されたページテキストの値オブジェクト
- `src/application/ports/ISelectedPageTextRepository.ts` - ストレージアクセスの抽象化インターフェース
- `src/application/usecases/selectedPageText/GetSelectedPageTextUseCase.ts` - 選択テキスト取得のユースケース
- `src/infrastructure/storage/SelectedPageTextRepository.ts` - Chrome storageの具体実装
- `tests/unit/application/usecases/selectedPageText/GetSelectedPageTextUseCase/execute/normal-cases.test.ts` - UseCaseのユニットテスト
- `tests/unit/domain/value-objects/SelectedPageText/constructor/normal-cases.test.ts` - 値オブジェクトのユニットテスト

### 修正ファイル
- `src/infrastructure/di/container.ts` - DIコンテナに新しい依存関係を登録
- `src/entrypoints/popup/App.tsx` - chrome.storage.local直接呼び出しをUseCaseパターンに変更
- `tests/unit/infrastructure/di/container/interface-registration-completeness.test.ts` - DIテストの更新
- `tests/unit/infrastructure/di/container/concrete-class-registration-completeness.test.ts` - DIテストの更新

### 設計改善
**レビューフィードバックによる継続的改善**:
1. **第1段階**: 基本的なClean Architecture実装
2. **第2段階**: nullチェック排除と三項演算子の簡素化
3. **第3段階**: UseCaseの戻り値をstring（プリミティブ型）に変更し、適切な層間データ転送を実現

## テスト方法
[動作確認の手順]
- `make test-and-check` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- 新規作成したUseCaseとRepositoryのユニットテストが正常に動作することを確認
- App.tsxでの選択テキスト取得機能が従来通り動作することを確認

## 補足
[追加の文脈や注意点]
- Clean Architectureの「値オブジェクト vs プリミティブ型」の使い分けについて、レビューを通じて適切な設計判断を学習
- 段階的なリファクタリングにより、コードの品質を継続的に向上
- IndexedDBのテスト失敗は既存のfake-indexeddbパッケージの問題で、今回の修正とは無関係

## 本スコープの対象外となったタスク
- 他のchrome API直接呼び出し箇所のリファクタリング（今回は選択テキスト取得のみに限定）
- IndexedDBテストの修正（別途対応が必要）

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->