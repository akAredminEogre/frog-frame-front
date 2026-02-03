# 技術記事構成メモ

## 記事タイトル

Chrome拡張機能開発にClean Architectureを適用した話 〜WXT + TypeScript + Reactで実践〜

## 想定読者

- Chrome拡張機能を開発している/したいエンジニア
- Clean Architectureに興味があるが実践例を探している人
- フロントエンド開発でアーキテクチャを意識したい人

## 記事の目的

- Chrome拡張機能という特殊な環境でもClean Architectureが適用できることを示す
- 実際の設計判断（ADR）を元に、リアルな知見を共有する
- 「現場での妥協」という言い訳をせずにClean Architectureを実践する姿勢を伝える

## 構成

1. はじめに
   - 動機: なぜChrome拡張機能にClean Architectureを適用したのか
   - 技術スタック: WXT, TypeScript, React, tsyringe

2. Clean Architectureの4層構造
   - enterprise-business-rules（第1層）
   - application-business-rules（第2層）
   - interface-adapters（第3層）
   - frameworks-and-drivers（第4層）

3. Chrome拡張機能特有の課題と解決策
   - background / content script間のメッセージング
   - Chrome APIの依存性逆転
   - IndexedDBアクセスの統一

4. Presenter付きパターンの採用
   - 制御の流れ
   - エラーハンドリングの責務

5. UI/Container分離とAtomic Design
   - Frameworks & Drivers層内のUI設計
   - テスタビリティの向上

6. テスト戦略書ドリブン開発
   - テスト実装前にテスト戦略書を作成する理由
   - テスト戦略書のテンプレート

7. 得られた効果
   - ドメインロジックの分離
   - テスト容易性
   - AI駆動開発との相性

8. まとめ

## 参考資料（記事内で引用）

- 実践クリーンアーキテクチャ - nrslib
- Robert C. Martin「Clean Architecture」
- GLOBIS Tech Blog（UI/Container分離）

## タグ

- CleanArchitecture
- Chrome拡張機能
- TypeScript
- React
- WXT
