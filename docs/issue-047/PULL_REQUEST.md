# ISSUE-047 PULL REQUEST

## タイトル
App.tsxのClean Architectureリファクタリング - Chrome API直接呼び出しをApplication層に移管

## 概要と理由
App.tsxでChrome APIを直接呼び出していた設計をClean Architectureの原則に従い、Application層に移管するリファクタリングを実施しました。当初の単純な移管作業から、システム全体のアーキテクチャ改善に発展し、依存関係の逆転原則を完全実現しました。

## 主な変更点
- **Clean Architectureの理想的実装**
  - Presentation層でのChrome API直接呼び出しを削除
  - Application層での適切な責務分離を実現
  - 依存関係の逆転原則の完全実現

- **システム最適化（6段階実施）**
  - 冗長な中間層削除
  - 通信効率改善（2段階→1段階）
  - Infrastructure層の適切分離
  - 責任最適化とコードクリーンアップ
  - Presentation層責務改善

- **新規ポートとサービスの実装**
  - `IChromeRuntimeService`, `IChromeTabsService`, `ICurrentTabService`の追加
  - 対応するInfrastructure層の実装
  - DIコンテナでの依存性注入設定

- **Value Objectsの整理**
  - `CurrentTab`, `TabId`の統合と最適化
  - 型安全性の向上

## テスト方法
動作確認の手順：
- [ ] `docker compose exec frontend npm run unused:safe` が成功すること
  - 既存自動テストとlinterを同時に確認
- [ ] ビルドが成功すること（Total size 170.67 kB程度）
- [ ] TypeScriptエラーがないこと
- [ ] Knipテストがすべてパスすること
- [ ] Chrome拡張機能として正常に動作すること

## 補足
- 段階的リファクタリングアプローチにより安全に実施
- ユーザーとの技術的対話により設計改善を実現
- Single Responsibility Principle、Dependency Inversion Principle、Interface Segregation Principleの実践
- 包括的なテスト実行による品質保証完了
