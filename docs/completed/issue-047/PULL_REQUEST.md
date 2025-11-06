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

- **Infrastructure層の包括的テスト実装**
  - Chrome Extension APIの適切なモック化対応
  - DAILY_SCRUM-01で変更されたinfrastructure層クラスの全テストコード作成
  - CODING_STYLE.mdに完全準拠したテストファイル構造の実現
  - メソッド単位でのテストファイル分割とディレクトリ階層化

### 作成されたテストファイル
- `tests/unit/infrastructure/browser/tabs/ChromeTabsService/sendMessage.test.ts`
- `tests/unit/infrastructure/browser/runtime/ChromeRuntimeService/sendApplyRewriteRuleMessage.test.ts`
- `tests/unit/infrastructure/di/SimpleContainer/register.test.ts`
- `tests/unit/infrastructure/di/SimpleContainer/resolve.test.ts`
- `tests/unit/infrastructure/browser/router/handlers/applyAllRules.test.ts`
- `tests/unit/infrastructure/browser/router/handlers/ping.test.ts`
- `tests/unit/infrastructure/browser/listeners/registerTabsOnUpdated/registerTabsOnUpdated.test.ts`

## テスト方法
動作確認の手順：
- [ ] `docker compose exec frontend npm run unused:safe` が成功すること
  - 既存自動テストとlinterを同時に確認
- [ ] Chrome拡張機能として正常に動作すること

## 補足
- 段階的リファクタリングアプローチにより安全に実施
- ユーザーとの技術的対話により設計改善を実現
- Single Responsibility Principle、Dependency Inversion Principle、Interface Segregation Principleの実践
- 包括的なテスト実行による品質保証完了
