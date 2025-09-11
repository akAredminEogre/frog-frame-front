# Issueの計画

<!-- Clean Architecture改善作業: App.tsxで直接chrome.storage.local.setを呼び出している部分をRepository Patternに移行し、適切な層間分離を実現する -->

## Story-1: 開発者としてClean Architectureの原則に従いUI層からInfrastructure層への直接依存を排除することで保守性とテスト性を向上させる

App.tsxで直接chrome.storage.local.setを呼び出している箇所をRepository Patternに移行し、適切な抽象化レイヤーを通じてデータアクセスを行う。

### タスク

- [x] Application層にIRewriteRuleRepositoryインターフェースを作成
- [x] Infrastructure層にChromeStorageRewriteRuleRepository具象実装を作成
- [x] Repository実装にCRUD操作（save, findById, findAll, delete）を完全実装
- [x] App.tsxの依存関係をインターフェースに変更

## Story-2: 開発者としてファイル構造をClean Architectureの階層に合わせて整理することで責務分離を明確化する

各層の責務に応じた適切なディレクトリ構造でファイルを配置し、依存関係の方向性を正しく保つ。

### タスク

- [x] Application層のportsディレクトリにインターフェースを配置
- [x] Infrastructure層のpersistance/storageディレクトリにRepository実装を移動
- [x] 古い不適切な場所のファイルを削除
- [x] import文を新しい構造に合わせて更新

## Story-3: 開発者としてRepository Patternによる抽象化でChrome Storage APIの具体的実装を隠蔽することでテストしやすいコードを実現する

UI層がChrome Extension特有のAPIに直接依存することなく、抽象的なインターフェースを通じてデータ操作を行えるようにする。

### タスク

- [x] UI層（App.tsx）をIRewriteRuleRepositoryインターフェースに依存させる
- [x] Chrome Storage APIの呼び出しをInfrastructure層に完全に分離
- [x] 依存関係の注入を通じたテスト容易性の確保
- [x] Clean Architectureの依存関係ルール（内側の層への依存）の実現
