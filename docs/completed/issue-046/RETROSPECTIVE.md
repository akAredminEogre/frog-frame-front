# 振り返り

このファイルでデイリースクラムの振り返りを行います。追記専用です。過去の内容を修正しないでください。

## スクラム01 の振り返り
<!-- KPT法で振り返りを行なってください -->

### Keep
<!-- うまく行ったこと、続けていきたいこと -->

- **Clean Architectureの原則に従った適切な層間分離**: UI層からInfrastructure層への直接依存を排除し、Application層のインターフェースを通じた抽象化ができた
- **Repository Patternによる完全な実装**: save, findById, findAll, deleteの全てのCRUD操作を実装し、データアクセス層を完成させることができた
- **Chrome Extension特有APIの適切な分離**: chrome.storage.local APIの呼び出しをInfrastructure層に完全に隠蔽し、UI層からの直接依存を解消できた
- **テストしやすい構造の実現**: 抽象的なインターフェースに依存することで、モックを使ったテストが容易になる構造を作ることができた
- **適切なディレクトリ構造**: Ports & Adaptersパターンに従い、application/portsとinfrastructure/persistance/storageという明確な構造を確立できた

### Problem
<!-- 問題点、苦労したこと、レビューで指摘を受けたこと -->

- **初期ファイル配置の不適切さ**: 最初にdomain/repositoriesに配置したインターフェースを、後でapplication/portsに移動する必要があった
- **ファイル構造の複数回調整**: ChromeStorageRewriteRuleRepositoryの配置場所についても、infrastructure/storageからinfrastructure/persistance/storageへの移動が必要になった
- **importパスの複数回修正**: ファイル移動に伴い、App.tsxのimport文を複数回修正する必要があった

### Try
<!-- 次回やってみたいこと -->
<!-- タスクベースではなく、行動ルールとして記載してください。 -->

- **Clean Architecture設計の事前検討**: ファイル作成前にClean Architectureの各層の責務と適切な配置場所を明確に設計してから実装を開始する
- **インターフェースと実装の配置ルール明文化**: Ports & Adaptersパターンにおけるインターフェースと具象クラスの配置ルールを明確に定義し、迷いなく適切な場所に配置する
- **依存関係の可視化**: 各層間の依存関係を図やドキュメントで可視化してから実装を進める

---
