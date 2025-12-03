# Domain Layer - Entities 設計ガイドライン

## 概要

Domain層のEntitiesは、ビジネスロジックの中核を担うクラスです。Clean Architectureの原則に従い、外部依存を最小限に抑える必要があります。

## グローバルオブジェクトへの直接アクセス禁止

### 禁止事項

Domain層のEntitiesでは、以下のグローバルオブジェクトへの**直接アクセスを禁止**します：

- `document`
- `document.body`
- `window`
- その他のブラウザグローバルオブジェクト

### 理由

1. **依存性逆転の原則（DIP）違反**: グローバルオブジェクトへの直接アクセスは、Domain層が外部環境に依存することを意味します
2. **テスタビリティの低下**: グローバル状態に依存するコードは、単体テストが困難になります
3. **環境依存**: ブラウザ環境以外での実行が不可能になります

### 対処方法

グローバルオブジェクトへのアクセスが必要な場合は、**Port/Adapterパターン**を使用します：

1. Domain層にインターフェース（Port）を定義
2. Infrastructure層で実装（Adapter）を作成
3. 依存性注入（DI）でEntityに注入

#### 例: document/document.body へのアクセス

```typescript
// Domain層: src/domain/ports/IDomRootChecker.ts
export interface IDomRootChecker {
  isDocumentRoot(node: Node): boolean;
}

// Infrastructure層: src/infrastructure/document/DomRootChecker.ts
export class DomRootChecker implements IDomRootChecker {
  public isDocumentRoot(node: Node): boolean {
    return node === document || node === document.body;
  }
}

// Domain層: src/domain/entities/ElementSelector.ts
export class ElementSelector {
  private domRootChecker: IDomRootChecker;

  constructor(domRootChecker: IDomRootChecker) {
    this.domRootChecker = domRootChecker;
  }

  private isInvalidAncestor(container: Node): boolean {
    return this.domRootChecker.isDocumentRoot(container);
  }
}
```

## DOM型（Node, Element, Range等）の使用について

### 許容される使用

Chrome拡張機能ではDOM操作がビジネスロジックの本質であるため、以下のDOM型は**データ構造体として**Domain層での使用を許容します：

- `Node`
- `Element`
- `Range`
- `NodeList`
- `MutationRecord`

### 禁止される使用

ただし、これらの型を通じた**グローバルオブジェクトへの直接アクセス**は禁止です：

```typescript
// NG: グローバルオブジェクトへの直接アクセス
container === document
document.body.contains(element)
document.createElement('div')

// OK: 引数として受け取った値の操作
container.nodeType === Node.TEXT_NODE
element.outerHTML
range.startContainer
```

## 関連ドキュメント

- [Clean Architecture概要](../README.md)
- [Infrastructure層ガイドライン](../infrastructure/README.md)
