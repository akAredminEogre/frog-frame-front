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

```typescript
// ✅ Good: プリミティブ型のみ
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

// ❌ Bad: エンティティ型を直接受け取る
interface ToggleSwitchProps {
  rule: RewriteRule;  // Atom がエンティティに依存してしまう
  onToggle: (rule: RewriteRule) => void;
}
```

**理由**:
- 汎用的で再利用可能な部品として設計する
- ドメイン層への依存を避ける
- 異なるコンテキストでも使用可能にする

### Pages/Organisms: エンティティ型も許容

Pages や Organisms は特定のユースケースに特化するため、エンティティ型を受け取ってもよい。

```typescript
// ✅ View (Page) がエンティティを受け取り、Atom に必要な値のみを渡す
const RulesApp: React.FC = () => {
  const handleRuleUpdate = (rule: RewriteRule) => {
    // rule から必要な値を抽出して Atom に渡す
  };

  return (
    <ToggleSwitch
      checked={rule.isActive}  // プリミティブ型に変換
      onChange={handleToggle}
    />
  );
};
```

## データフロー

```
┌─────────────────────────────────────────────────────────────┐
│ Presenter                                                    │
│   → View (Page) に エンティティ を渡す                        │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ View (Page/Organism)                                         │
│   → エンティティから必要な値を抽出                            │
│   → Atom に プリミティブ型 を渡す                             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ Atom                                                         │
│   → プリミティブ型のみを受け取る                              │
│   → ドメイン知識を持たない                                    │
└─────────────────────────────────────────────────────────────┘
```

## 関連ドキュメント

- [ADR-001: Clean Architecture with Presenter Pattern](../../../../adr/001-clean-architecture-with-presenter-pattern.md)
