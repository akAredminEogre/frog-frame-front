# 振り返り

このファイルでデイリースクラムの振り返りを行います。追記専用です。過去の内容を修正しないでください。
追記のときは最後尾に追加してください。

## スクラム01 の振り返り
<!-- KPT法で振り返りを行なってください -->

### Keep
<!-- うまく行ったこと、続けていきたいこと -->

- Dexie.jsライブラリのセットアップがスムーズに完了した
- スキーマ設計をシンプルに保ち、RewriteRulesテーブルのみに焦点を当てた
- レビューフィードバックを迅速に反映し、3回のイテレーションで完了した
- データベース名の命名規則を統一できた（FrogFrameFrontDatabase）
- 全テストがパスし、コード品質を維持できた

### Problem
<!-- 問題点、苦労したこと、レビューで指摘を受けたこと -->

- 最初のスキーマ設計でSelectedPageTextテーブルを含めていたが、chrome.storageを使用する設計に変更となった
  - レビュー01: SelectedPageTextテーブルの削除が必要
  - これにより、DAILY-SCRUM-03が不要となった
- データベース名が「FrogFrameDatabase」となっていたが、プロジェクト名に合わせて「FrogFrameFrontDatabase」に修正が必要だった
  - レビュー02: データベース名の修正が必要

### Try
<!-- 次回やってみたいこと -->
<!-- タスクベースではなく、行動ルールとして記載してください。 -->

- スキーマ設計時に、各データの保存先（IndexedDB vs chrome.storage）を事前に確認する
- 命名規則についてプロジェクト全体で統一されているか確認してから実装を開始する
- レビュー前に既存コードの命名パターンを確認し、一貫性を保つ

---

## スクラム02 の振り返り

### Keep

- 13回のイテレーションを通じて、レビューフィードバックに丁寧に対応できた
- Dexie.js APIを直接活用した効率的な実装（`each()`による最適化など）を実現できた
- Clean ArchitectureとDDDの原則について深く議論し、設計の妥当性を確認できた
  - Infrastructure層がDomain層に依存することの正当性を理解
  - Repositoryパターンの責務（ドメインオブジェクトで返す）を遵守
- Primary Keyの自動採番対応を適切に実装できた
  - DB層で`number`型、Domain層で`string`型を維持する過渡期設計
- テストコードのリファクタリングで一貫性のあるコードに改善できた
- Dexie.jsのマイグレーション機能について調査し、知識を獲得できた
- 異常系テストケースを追加し、データベース制約の動作を検証できた
- 全テスト（277個のユニットテスト、9個のE2Eテスト）がパスした

### Problem

- 設計方針の変更が複数回発生し、イテレーション回数が多くなった
  - レビュー01-02: `IRewriteRuleRepository`を`create()`/`update()`に分割したが、既存実装への影響を考慮して`set()`に戻す
  - レビュー03-05: ChromeStorageRewriteRuleRepositoryへの影響を最小化するため、DexieRewriteRuleRepositoryを独立したクラスとして実装
- レビュー04で、ユーザーが手動で修正した内容を正として理解できず、逆方向の修正を実施してしまった
  - コミュニケーションの改善が必要
- テストコードで`toObject()`の不要な使用が複数箇所に残っていた
  - レビュー09-11: `toArray()`や`getById()`に段階的に置き換え

### Try

- 設計変更の影響範囲を事前に確認し、段階的なアプローチを提案する
  - 今回のように既存実装への影響を最小化したい場合は、最初から独立したクラスとして実装する選択肢を検討
- ユーザーが手動で修正した内容がある場合は、その意図を明確に確認してから作業を進める
- テストコード作成時に、既存のヘルパーメソッド（`toArray()`, `getById()`など）を活用する習慣をつける
- アーキテクチャ設計の議論では、参考資料や原典（Eric EvansのDDD本など）を引用して説明する

---
<!-- ユーザーが使うコマンド workflow:commit-daily-scrum -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow:commit-daily-scrum-then-start-next-daily-scrum.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow:commit-daily-scrum-then-create-pr.md -->
