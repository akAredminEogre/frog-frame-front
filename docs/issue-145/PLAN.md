# Issueの計画

# DAILY-SCRUM単位のタスク

本ISSUEでは、`docs/Chrome拡張機能開発ドキュメント完全ガイド v2.0 .md`のPhase 2: 方式設計・基本設計を実行し、プロジェクトの設計ドキュメントを作成します。

## タスク分解の方針

Phase 2では以下のドキュメントを作成する必要があります:

### 必須ドキュメント
1. `docs/design/00-overview.md` - プロジェクト概要・方式設計書（方式設計統合）
2. `docs/design/01-architecture.md` - アーキテクチャ詳細設計書
3. `docs/design/08-constraints-matrix.md` - Chrome拡張制約マトリックス

### 任意/段階的ドキュメント（既存実装から抽出）
4. `docs/design/02-domain-layer.md` - Domain層詳細設計
5. `docs/design/03-application-layer.md` - Application層詳細設計（UseCase定義）
6. `docs/design/07-data-schema.md` - データスキーマ定義（IndexedDB）

### ADR（Architecture Decision Record）
7. `docs/design/adr/001-use-wxt-framework.md` - WXT採用理由
8. `docs/design/adr/002-listener-separation-pattern.md` - リスナー分離パターン
9. `docs/design/adr/003-use-webext-core-messaging.md` - メッセージングライブラリ選定
10. その他必要なADR

### 画面仕様（必要に応じて）
11. `docs/design/screens/popup/` - Popup画面仕様
12. `docs/design/screens/edit/` - Edit画面仕様

## デイリースクラム単位のタスク

- [x] **Day 1**: 既存実装の調査と00-overview.md作成
  - 既存のsrcディレクトリ構造を調査
  - 既存の実装されたUseCaseを調査
  - プロジェクト概要・方式設計書（00-overview.md）を作成
  - 技術スタック、採用理由、アーキテクチャ方針を記述
  - PlantUML図作成（architecture-layers.puml）
  - Git Flowリリースブランチの記述追加

- [ ] **Day 2**: アーキテクチャ詳細設計と制約マトリックス作成
  - 01-architecture.mdを作成（Clean Architecture層別詳細）
  - 08-constraints-matrix.mdを作成（Chrome拡張特有の制約）
  - 既存のentrypoints/background.ts, content.tsの実装パターンを文書化

- [ ] **Day 3**: ADRドキュメント作成
  - ADRディレクトリ構造作成
  - 001-use-wxt-framework.md作成
  - 002-listener-separation-pattern.md作成
  - 003-use-webext-core-messaging.md作成
  - 必要に応じて追加ADRを作成

- [ ] **Day 4**: Domain層とApplication層詳細設計
  - 既存のEntityクラスを調査・文書化
  - 02-domain-layer.md作成
  - 既存のUseCaseを調査・文書化
  - 03-application-layer.md作成

- [ ] **Day 5**: データスキーマと画面仕様の文書化
  - 既存のIndexedDB実装（Dexie）を調査
  - 07-data-schema.md作成
  - 既存のPopup, Edit画面の仕様を文書化
  - 画面仕様ドキュメント作成（screens/popup/, screens/edit/）

- [ ] **Day 6**: レビュー・修正・統合
  - 全ドキュメントの整合性確認
  - クロスリファレンス確認
  - 不足箇所の補完
  - 開発者レビュー対応

- [ ] **Day 7**: 行ったタスクのガイドラインの整理
  - [ ] docs/Chrome拡張機能開発ドキュメント完全ガイド v2.0 .md のうち、このISSUEで行ったタスクに関連する部分は、その成果物へのパスを明記して、詳細な記述は削除する。(どういった方針で行う、注意すべきこと等は残しておく)

## 注意事項

1. **既存実装との整合性**: このプロジェクトは既に実装が進んでいるため、Phase 2のドキュメントは既存のコードベースから情報を抽出して作成する
2. **小規模プロジェクトの方針**: ガイドでは小規模プロジェクトの場合、方式設計を00-overview.mdに統合することを推奨している
3. **段階的作成**: すべてのドキュメントを一度に完璧に作成するのではなく、必須ドキュメントから順に作成し、必要に応じて詳細化する
4. **PlantUML図**: 可能であればアーキテクチャ図やデータフロー図をPlantUMLで作成する

# ISSUEを通した相談事項

本ISSUEはドキュメント作成タスクのため、PLAN.md作成時点で開発者レビューが必要です。

以下の点について確認をお願いします:

1. **タスク分解の妥当性**: 上記のDaily Scrum単位のタスク分解は適切でしょうか？
  - 適切です。
2. **優先順位**: 6日間のスケジュールで進める優先順位は適切でしょうか？一部のドキュメントを省略すべきでしょうか？
  - 今のところ適切です。
3. **ADRの範囲**: 提案した3つのADR以外に、プロジェクトで重要な技術判断があれば教えてください → 問題ありません
4. **既存ドキュメントとの関係**: `docs/Chrome拡張機能開発ドキュメント完全ガイド v2.0 .md`との重複をどの程度許容するか？それとも完全に新規作成すべきか？
  - いい質問です。docs/Chrome拡張機能開発ドキュメント完全ガイド v2.0 .md はドキュメント整理フェーズでのガイドラインであり、終わったら不要となるものです。そして設計ドキュメントとは別物です。ガイドラインとの重複は気にする必要はありません。完全に新規作成してください。
  - むしろ、今回の成果物に該当する箇所は部分的に削除してほしいので、そのスクラムをDAY 7として追加しました。
5. **画面仕様の詳細度**: Popup、Edit画面の仕様はどの程度詳細に記述すべきでしょうか？
  - ユーザーが見るもの触るものの仕様を記述してください。
    - 言い換えればどのモジュールを使っている、等の技術的な詳細は不要です。

# 残タスク
<!-- issueの進捗に応じて記入 -->

# 本issueの対象外とする課題
<!-- issueの進捗に応じて記入 -->
