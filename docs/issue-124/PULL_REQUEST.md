# ISSUE-124 PULL REQUEST

## タイトル
content.tsのリファクタリング: 関数分割・メッセージルーター導入・ディレクトリ構造改善

## 概要と理由
content.tsはaddListener内でif文が多く、可読性が低く、単一責任の原則に反していたため、background.tsと同様のパターンで関数分割とメッセージルーター導入を実施しました。さらに、PR指摘事項を踏まえてアーキテクチャ検討とディレクトリ構造改善も実施しています。

## 主な変更点

### スクラム01: core refactoring
- `src/entrypoints/content.ts`のリファクタリング
  - chrome.runtime.onMessage.addListenerのロジックを`content.runtime.onMessage.ts`に分割
  - メッセージルーターパターンを導入し、ハンドラーを分割
  - 依存性注入の最適化（リポジトリ生成責任をリスナー層に移動）

### スクラム02: ファイル配置検討・命名規則改善  
- content関連ファイルの配置検討
  - infrastructure/content配下への移動案とメリット・デメリット分析
  - Clean Architectureの依存性ルールとWXT規約を考慮し現在位置維持を決定
- 命名規則の強化実施
  - `content.`接頭辞から**ディレクトリ分離**への改善
  - `content.messageRouter.ts` → `content/messageRouter.ts`
  - `content.messageHandlers.ts` → `content/messageHandlers.ts`

### スクラム03: アーキテクチャ検討・ディレクトリ構造改善
- PR指摘事項：messageRouter統合可能性の検討
  - background/content messageRouterのコード重複分析
  - Clean Architecture・DDD観点からの統合可能性評価
  - **結論**: DDD境界コンテキスト原則により分離アーキテクチャを維持
- ディレクトリ構造の段階的改善
  - content関連: 接頭辞 → ディレクトリ分離を実施
  - background関連: 別issue対応として現状維持（ハイブリッドアプローチ）

### 最終的なファイル構成
- 新規ファイル作成:
  - `src/infrastructure/browser/listeners/content.runtime.onMessage.ts`
  - `src/infrastructure/browser/router/content/messageRouter.ts`
  - `src/infrastructure/browser/router/content/messageHandlers.ts`
  - `src/infrastructure/browser/handlers/content/applyAllRulesHandler.ts`
  - `src/infrastructure/browser/handlers/content/getElementSelectionHandler.ts`

## テスト方法
[動作確認の手順]
- [x] `make testcheck` で回帰テスト通過を確認
- [x] `make testlint` で回帰テスト通過とlintエラーなしを確認

## 補足

### アーキテクチャ原則の適用
- background.tsの実装パターンを参考にして一貫性のあるアーキテクチャを実現
- メッセージルーターパターンの導入により拡張性の高い設計に変更
- 依存性注入の最適化により、content.tsがインフラストラクチャ層から完全に分離
- JSDocによる呼び出し経路のドキュメント化でコードの理解を向上

### アーキテクチャ検討の成果
- messageRouter統合 vs 分離の詳細分析を実施
- DDD境界コンテキスト原則、Clean Architecture文脈分離、Chrome Extension セキュリティベストプラクティスに基づく設計判断
- 段階的改善アプローチによる影響範囲限定とリスク管理

### ディレクトリ構造改善
- content関連ファイルの一貫性向上（接頭辞 → ディレクトリ分離）
- ハイブリッドアプローチによる部分的改善実現
- 長期目標と現実的制約のバランスを考慮した実装

## 本スコープの対象外となったタスク
background関連ファイルのディレクトリ整理（別issueで実施予定）

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->