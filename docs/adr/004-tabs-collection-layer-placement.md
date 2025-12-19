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

## アンチパターン: 抽象化によるドメイン層への引き上げ

### 陥りがちな誤った設計

「インターフェースで抽象化すれば、タブをドメイン層に配置できるのではないか」という考え方がある:

```typescript
// ❌ アンチパターン: enterprise-business-rules層に配置

// 抽象化されたタブインターフェース
interface ITab {
  readonly url: string;
  readonly id: number;
}

// 抽象化されたタブコレクション
class Tabs {
  constructor(private readonly tabs: ITab[]) {}

  filterByRule(rule: RewriteRule): Tabs {
    const filtered = this.tabs.filter((tab) => rule.matchesUrl(tab.url));
    return new Tabs(filtered);
  }
}

// frameworks-and-drivers層でChrome実装を提供
class ChromeTab implements ITab {
  constructor(private readonly chromeTab: chrome.tabs.Tab) {}
  get url() { return this.chromeTab.url!; }
  get id() { return this.chromeTab.id!; }
}
```

### なぜこれがアンチパターンなのか

#### 1. ドメイン層への技術的概念の漏れ

**「タブ」という概念自体がブラウザ固有であり、ドメイン概念ではない。**

ADR-001 の原則:
> ドメインエンティティの値を用いた判定・計算・変換は、**その結果がビジネス上の意味を持つ場合**、`enterprise-business-rules` 層で実装する。

「タブ」はビジネス上の意味を持たない。これは「URLパターンにマッチするページをリロードする」という**技術的な副作用**を実現するための手段に過ぎない。

| 概念 | ビジネス上の意味 | 配置 |
|------|----------------|------|
| RewriteRule | ルールの定義（何を何に書き換えるか） | ドメイン層 |
| URLパターンマッチング | ルールがどのURLに適用されるか | ドメイン層 |
| タブ | ブラウザの表示単位 | **ドメイン概念ではない** |
| タブのリロード | 技術的な副作用 | インフラ層 |

#### 2. 抽象化の目的の誤解

Clean Architecture における抽象化（インターフェース）の目的:

| 目的 | 例 | 正当性 |
|------|-----|--------|
| **依存性逆転** | `IRewriteRuleRepository` | ✅ ドメインがインフラに依存しないため |
| **テスタビリティ** | `ITabsGateway` | ✅ ユースケースをモックでテスト可能にするため |
| **技術詳細の隠蔽のみ** | `ITab` | ❌ ドメインに技術概念を持ち込む言い訳になる |

`ITab` インターフェースは「技術詳細を隠す」だけであり、「タブ」という技術概念がドメイン層に存在すること自体が問題である。

#### 3. 過度な抽象化による複雑さの増加

```
❌ アンチパターンの層構造:
enterprise-business-rules/
  └── ITab, Tabs           ← 技術概念がドメイン層に侵入
frameworks-and-drivers/
  └── ChromeTab            ← 実装クラス

✅ 正しい層構造:
enterprise-business-rules/
  └── RewriteRule          ← 純粋なドメインロジックのみ
frameworks-and-drivers/
  └── Tabs, ChromeTabsGateway  ← 技術的詳細はここに閉じ込める
```

抽象化によるドメイン層への引き上げは:
- 不要なインターフェース（`ITab`）を生む
- ドメイン層のテストに技術概念のモックが必要になる
- 「ドメイン層は外部依存がない」という原則を形骸化させる

#### 4. ADR-001 の原則に反する

ADR-001 の明確な指針:

> **`frameworks-and-drivers` 層は、ドメインロジックの呼び出しと技術的な入出力のみを担当する。**

タブの操作は「技術的な入出力」であり、抽象化してもこの性質は変わらない。

### 正しいアプローチ

技術的概念は `frameworks-and-drivers` 層に留め、ドメインロジックのみをドメイン層に配置する:

```typescript
// ✅ 正しいアプローチ

// enterprise-business-rules層: ドメインロジックのみ
class RewriteRule {
  matchesUrl(url: string): boolean { /* ドメイン判定 */ }
}

// frameworks-and-drivers層: 技術的詳細
class Tabs {
  filterByRule(rule: RewriteRule): Tabs {
    // ドメインロジックを「呼び出す」だけ
    return new Tabs(this.tabs.filter(tab => rule.matchesUrl(tab.url)));
  }
}
```

**ポイント**: `Tabs.filterByRule()` はドメインロジック（`matchesUrl`）を**呼び出す**だけであり、ドメインロジック自体を**実装**しているわけではない。

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

## 解消すべき事項

### 現状の問題: ドメイン層に誤って配置された Tab 関連クラス

以下のファイルが `src/domain/value-objects/` に存在しているが、本 ADR の決定に基づき、これらは**誤った配置**である:

| ファイル | 現在の配置 | 問題点 |
|---------|-----------|--------|
| `Tab.ts` | `src/domain/value-objects/` | 技術概念がドメイン層に存在 |
| `Tabs.ts` | `src/domain/value-objects/` | 技術概念がドメイン層に存在 |
| `TabId.ts` | `src/domain/value-objects/` | chrome.tabs.Tab.id のラッパー |
| `TabUrl.ts` | `src/domain/value-objects/` | chrome.tabs.Tab.url のラッパー |

### 問題の本質

これらのクラスは「アンチパターン: 抽象化によるドメイン層への引き上げ」の典型例である:

1. **Tab, Tabs**: ブラウザ固有の「タブ」概念をドメイン層に持ち込んでいる
2. **TabId, TabUrl**: `chrome.tabs.Tab` のプロパティを Value Object としてラップしているが、これらはドメイン概念ではなく技術的詳細のラッパーに過ぎない

### 対応方針

| 対応 | 内容 |
|------|------|
| **削除対象** | `src/domain/value-objects/Tab.ts`, `Tabs.ts`, `TabId.ts`, `TabUrl.ts` |
| **代替** | `src/frameworks-and-drivers/browser/Tabs.ts`（本 ADR で新規作成済み） |
| **移行** | 既存の使用箇所を新しい `Tabs` クラスに置き換え |

### 注意事項

この対応は本ユーザーストーリー（user-story-001）のスコープ外とし、別途リファクタリングタスクとして実施する。

## 影響ドキュメント

このADRが変更された場合、以下のドキュメントも更新が必要：

- [toggle-rule-active/01-class-design.md](../design/pages/rule-list/features/toggle-rule-active/01-class-design.md) - ChromeTabsGateway の設計

## 関連ドキュメント

- [ADR-001: Clean Architecture with Presenter Pattern](./001-clean-architecture-with-presenter-pattern.md) - ドメインロジック配置原則
- [object-oriented-nine-rules.md](../coding-standards/src/object-oriented-nine-rules.md) - ファーストクラスコレクション
