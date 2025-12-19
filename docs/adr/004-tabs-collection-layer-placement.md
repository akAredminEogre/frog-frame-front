# ADR-004: Tabs ファーストクラスコレクションの層配置

## ステータス

採用

## コンテキスト

ルールトグル機能の実装において、URLパターンにマッチするタブをリロードする機能が必要となった。この実装では `chrome.tabs.Tab[]` をファーストクラスコレクションとしてラップする `Tabs` クラスを導入することになった。

ここで設計上の疑問が生じた：

1. **Tabs は Value Object か？**
   - Value Object であれば `enterprise-business-rules/value-objects/` に配置すべき
   - 例: `RewriteRules` は `enterprise-business-rules/value-objects/` に配置されている

2. **Clean Architecture のどの層に配置すべきか？**
   - `enterprise-business-rules` 層（第1層）
   - `frameworks-and-drivers` 層（第4層）

## 決定

**`Tabs` クラスは `frameworks-and-drivers/browser/` に配置する。**

### 理由: Tabs は Value Object ではない

Value Object の特徴:
- ドメイン概念を表現する
- ビジネス上の意味を持つ

`Tabs` の特徴:
- `chrome.tabs.Tab` は Chrome API 固有の型であり、**ドメイン概念ではない**
- タブの取得・リロードは**技術的な入出力**である

### ADR-001 との整合性

ADR-001「ドメインロジックの配置原則」に従う:

> **ドメインエンティティの値を用いた判定・計算・変換は、その結果がビジネス上の意味を持つ場合、`enterprise-business-rules` 層で実装する。**
>
> **`frameworks-and-drivers` 層は、ドメインロジックの呼び出しと技術的な入出力のみを担当する。**

| ロジック | 配置先 | 理由 |
|---------|--------|------|
| URLパターンマッチング判定 | `enterprise-business-rules` | ドメイン知識（`RewriteRule.matchesUrl()`） |
| タブ一覧の取得 | `frameworks-and-drivers` | 技術的入出力（Chrome API） |
| タブのリロード実行 | `frameworks-and-drivers` | 技術的入出力（Chrome API） |
| **タブコレクションの管理** | **`frameworks-and-drivers`** | **技術的ヘルパー** |

### 依存関係

```
┌─────────────────────────────────────────────────────────┐
│ enterprise-business-rules (第1層)                       │
│   RewriteRule.matchesUrl(url: string): boolean         │
└─────────────────────────────────────────────────────────┘
                         ▲
                         │ 依存（OK: 上位層 → 下位層）
                         │
┌─────────────────────────────────────────────────────────┐
│ frameworks-and-drivers (第4層)                          │
│   Tabs (ファーストクラスコレクション)                    │
│     - filterByRule(rule: RewriteRule): Tabs            │
│     - reloadAll(): Promise<void>                       │
│                                                         │
│   ChromeTabsGateway                                     │
│     - reloadMatchingTabs(rule): Tabs経由で処理          │
└─────────────────────────────────────────────────────────┘
```

- `Tabs`（第4層）→ `RewriteRule`（第1層）への依存は、**上位層から下位層への依存**なので許可される
- ドメインロジック（`matchesUrl()`）は `RewriteRule` に残り、`Tabs` は**呼び出し**のみを行う

### Tabs クラスの責務

```typescript
// src/frameworks-and-drivers/browser/Tabs.ts
export class Tabs {
  private readonly tabs: chrome.tabs.Tab[];

  constructor(chromeTabs: chrome.tabs.Tab[]) {
    // URLが存在するタブのみを保持（技術的フィルタリング）
    this.tabs = chromeTabs.filter((tab) => tab.url !== undefined);
  }

  filterByRule(rule: RewriteRule): Tabs {
    // ドメインロジック（matchesUrl）の呼び出し
    const filtered = tabsArray.filter((tab) => rule.matchesUrl(tab.url!));
    return new Tabs(filtered);
  }

  async reloadAll(): Promise<void> {
    // 技術的出力（Chrome API）
    // ...
  }
}
```

| 責務 | 種別 |
|------|------|
| URLが存在するタブのみを保持 | 技術的フィルタリング |
| `rule.matchesUrl()` の呼び出し | ドメインロジックの**呼び出し** |
| `chrome.tabs.reload()` の実行 | 技術的出力 |

## 比較: Value Object との違い

| 観点 | RewriteRules (Value Object) | Tabs (技術的ヘルパー) |
|------|----------------------------|----------------------|
| 配置 | `enterprise-business-rules/value-objects/` | `frameworks-and-drivers/browser/` |
| 内包する型 | `RewriteRule`（ドメインエンティティ） | `chrome.tabs.Tab`（Chrome API 型） |
| 表現するもの | ドメイン概念（ルールの集合） | 技術的詳細（ブラウザタブの集合） |
| 外部依存 | なし | Chrome API |

## 理由

### 採用理由

1. **ADR-001 準拠**: ドメインロジック配置原則に従う
2. **責務分離**: ドメインロジックは `RewriteRule` に、技術的操作は `Tabs` に
3. **テスト容易性**: `RewriteRule.matchesUrl()` を Chrome API モックなしで単体テスト可能
4. **移植性**: ブラウザ変更時（Firefox 対応等）も `RewriteRule` は変更不要

### オブジェクト指向9ルールとの関係

`Tabs` はオブジェクト指向9ルールの**ルール8「ファーストクラスコレクションを使用すること」**を満たすが、これは Clean Architecture の層配置とは独立した概念である。

ファーストクラスコレクションは各層で使用でき、配置先は**内包する型の性質**によって決まる:
- ドメイン型のコレクション → `enterprise-business-rules`
- 技術的型のコレクション → `frameworks-and-drivers`

## 影響ドキュメント

このADRが変更された場合、以下のドキュメントも更新が必要：

- [toggle-rule-active/01-class-design.md](../design/pages/rule-list/features/toggle-rule-active/01-class-design.md) - ChromeTabsGateway の設計

## 関連ドキュメント

- [ADR-001: Clean Architecture with Presenter Pattern](./001-clean-architecture-with-presenter-pattern.md) - ドメインロジック配置原則
- [object-oriented-nine-rules.md](../coding-standards/src/object-oriented-nine-rules.md) - ファーストクラスコレクション
