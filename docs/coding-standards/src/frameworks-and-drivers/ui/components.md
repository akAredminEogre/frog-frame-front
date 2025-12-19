# UI コンポーネント コーディング規約

## 概要

Atomic Design に基づく UI コンポーネントの Props 型に関する規約。

## Props の型設計

### 原則: コンポーネント粒度に応じた型選択

| 粒度 | Props に使用する型 | 理由 |
|------|-------------------|------|
| Atoms | プリミティブ型のみ | 汎用性・再利用性の維持 |
| Molecules | プリミティブ型推奨 | 汎用性の維持 |
| Organisms | エンティティ型も可 | 特定コンテキストに依存してよい |
| Pages | エンティティ型も可 | 特定ユースケースに特化 |

### Atoms: プリミティブ型のみ

Atoms は最も基本的な UI 部品であり、**プリミティブ型のみ**を Props として受け取る。

- 汎用的で再利用可能な部品として設計する
- ドメイン層への依存を避ける
- 異なるコンテキストでも使用可能にする

### Pages/Organisms: エンティティ型も許容

Pages や Organisms は特定のユースケースに特化するため、エンティティ型を受け取ってもよい。

## データフロー

Presenter は View (Page) にエンティティを渡し、View はエンティティから必要な値のみを抽出して、Atom にはプリミティブ型として値を渡す。

## eslint-rule

`host-frontend-root/frontend-src-root/eslint-rules/clean-architecture/frameworks-and-drivers/ui/atoms.js`

Atoms内でのエンティティ/値オブジェクトのimportを禁止。プリミティブ型のみかどうかの完全な検証はPRレビューで確認。

## 関連ドキュメント

- [ADR-001: Clean Architecture with Presenter Pattern](../../../../adr/001-clean-architecture-with-presenter-pattern.md)
