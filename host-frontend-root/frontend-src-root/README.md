# Favorite Keyword Link Frog

ウェブページ内の特定のキーワードにリンクを付与するChrome拡張機能です。

## 概要

Favorite Keyword Link Frogは、ブラウザに表示したDOMを操作し、要素の書き換え、文字列のリンク化を行う拡張機能です。正規表現を利用し、自由なDOM操作が可能です。

## 主な機能
- 正規表現によりDOMを指定し、要素の書き換えが可能
- 書き換えルールの保存と管理

## スクリーンショット

<!-- スクリーンショットは別途追加予定 -->

## 技術スタック

- **フレームワーク**: React 18.3
- **ビルドツール**: WXT 0.20
- **言語**: TypeScript 5.6
- **テスト**: 
  - Vitest (単体テスト)
  - Playwright (E2Eテスト)
- **UI開発**: Storybook
- **DI**: tsyringe
- **アーキテクチャ**: Clean Architecture

## プロジェクト構造

```
src/
├── application/     # ユースケース層
├── components/      # UIコンポーネント
├── domain/          # ドメイン層（ビジネスロジック）
├── entrypoints/     # 拡張機能のエントリーポイント
├── infrastructure/  # インフラ層（Chrome API等）
└── utils/           # ユーティリティ
```

### アーキテクチャ原則

このプロジェクトはClean Architectureに基づいて設計されています：

- **ドメイン層**: ビジネスロジックを含み、他の層に依存しません
- **アプリケーション層**: ユースケースを実装し、ドメイン層とインフラ層を調整します
- **インフラ層**: Chrome APIやブラウザAPIなどの外部依存を扱います
- **コンポーネント層**: UI表示を担当します

## コーディング規約

- オブジェクト指向の9つのルール（ThoughtWorksアンソロジー）に準拠
- Clean Architectureの原則を遵守
- 絶対パスでのimport (`src/` から始まる)
- 単体テストの徹底（メソッド単位でのテスト）

## ライセンス

MIT License

Copyright (c) 2025 [Your Name]

詳細は [LICENSE](../../LICENSE) ファイルを参照してください。
