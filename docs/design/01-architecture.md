# アーキテクチャ設計書

このドキュメントでは、frog-frame-frontプロジェクトのClean Architecture実装の詳細を記述します。

**関連ドキュメント:**
- [プロジェクト概要](00-overview.md) - 全体像と方式設計
- [制約マトリックス](08-constraints-matrix.md) - Chrome拡張特有の制約

---

## 1. Clean Architecture 層別詳細

### 1.1 Domain層

**責務:**
- ビジネスルールの定義
- Entityの定義
- Value Objectの定義
- ドメイン固有エラーの定義
- ドメイン定数の定義

**依存:**
- なし（完全に独立）

**重要原則:**
- **外部依存の完全排除**: Chrome API, DOM API, window, document等のブラウザAPIは一切使用不可
- **純粋性**: 副作用のない純粋なビジネスロジックのみを実装
- **テスタビリティ**: 外部依存がないため、ユニットテストが容易

**ファイル配置:**
```
src/domain/
├── entities/                              # ビジネスロジックを持つエンティティ
│   ├── RewriteRule/                       # 例：書き換えルール（Strategy Pattern使用）
│   │   ├── RewriteRule.ts                 # メインエンティティ
│   │   ├── PatternProcessingStrategyFactory.ts
│   │   └── ...（Strategy実装クラス）
│   ├── DomDiffer.ts                       # 例：DOM差分検出ロジック
│   └── ...（その他のエンティティ：要素セレクタ、パース戦略等）
├── value-objects/                         # 値オブジェクト（イミュータブル）
│   ├── RewriteRules.ts                    # 例：ルール集合
│   ├── Tab.ts                             # 例：タブ情報
│   └── ...（その他のVO：選択テキスト、URL等）
├── constants/                             # ドメイン定数
│   └── RegexConstants.ts
└── errors/                                # ドメイン固有エラー
    └── RewriteRuleNotFoundError.ts
```

**設計ガイドライン:**

1. **Entityの設計:**
   - イミュータブル（不変）を基本とする
   - ビジネスルールをメソッドとして実装
   - 状態変更は新しいインスタンスを返す

2. **Value Objectの設計:**
   - 値の等価性で比較
   - イミュータブル
   - バリデーションロジックを含む

3. **Strategy Patternの活用:**
   - RewriteRuleでは、正規表現パターン/文字列パターンの処理をStrategy Patternで実装
   - PatternProcessingStrategyFactoryで適切なStrategyを生成

---

### 1.2 Application層

**責務:**
- ユースケースの実装
- Repository Interfaceの定義（ポート）
- ビジネスロジックのオーケストレーション
- Domain層とInfrastructure層の橋渡し

**依存:**
- Domain層のみ（EntityやValue Objectを利用）

**ファイル配置:**
```
src/application/
├── usecases/                              # ユースケース実装（機能別ディレクトリ）
│   ├── rule/                              # 例：書き換えルール関連
│   │   ├── SaveRewriteRuleAndApplyToCurrentTabUseCase.ts
│   │   ├── GetAllRewriteRulesUseCase.ts
│   │   └── ...（その他のルール操作UseCase）
│   ├── contextmenu/                       # 例：コンテキストメニュー関連
│   │   └── ...（メニュー設定、選択処理）
│   └── ...（その他のカテゴリ：popup、selection、window等）
├── ports/                                 # Infrastructure層へのインターフェース定義
│   ├── IRewriteRuleRepository.ts          # 例：ルールリポジトリ
│   ├── IChromeTabsService.ts              # 例：タブ操作サービス
│   └── ...（その他のポート：Storage、Runtime等）
└── types/                                 # アプリケーション層の型定義
    └── RewriteRuleParams.ts
```

**設計ガイドライン:**

1. **UseCaseの責務:**
   - 1つのユーザーアクションに対応
   - Repository（ポート）を通じてデータを取得/永続化
   - Entityのビジネスロジックを呼び出す
   - エラーハンドリング

2. **ポート（Interface）の設計:**
   - Infrastructure層の具象実装に依存しない
   - テスト時にMockに差し替え可能
   - 命名規則: `I` + サービス名 (例: `IRewriteRuleRepository`)

3. **依存性注入:**
   - コンストラクタでポートを受け取る
   - tsyringeの`@inject()`デコレータを使用

**実装例:**
```typescript
// application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase.ts
import { inject, injectable } from 'tsyringe';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { ICurrentTabService } from 'src/application/ports/ICurrentTabService';

@injectable()
export class SaveRewriteRuleAndApplyToCurrentTabUseCase {
  constructor(
    @inject('IRewriteRuleRepository')
    private ruleRepository: IRewriteRuleRepository,
    @inject('ICurrentTabService')
    private currentTabService: ICurrentTabService
  ) {}

  async execute(params: RewriteRuleParams): Promise<void> {
    // 1. Entityを生成
    const rule = new RewriteRule(/* ... */);

    // 2. 永続化
    await this.ruleRepository.save(rule);

    // 3. 現在のタブに適用
    const tab = await this.currentTabService.getCurrentTab();
    // ...
  }
}
```

---

### 1.3 Infrastructure層

**責務:**
- Repository実装（ポートの具象化）
- IndexedDB操作（Dexie）
- Chrome API呼び出し
- ブラウザAPIラッパー
- DIコンテナ設定

**依存:**
- Domain層、Application層

**ファイル配置:**
```
src/infrastructure/
├── persistence/                           # データ永続化実装
│   ├── indexeddb/                         # IndexedDB（Dexie使用）
│   │   ├── DexieDatabase.ts               # データベース定義
│   │   └── DexieRewriteRuleRepository.ts  # 例：リポジトリ実装
│   └── storage/                           # Chrome Storage API
│       └── ...（chrome.storage実装）
├── browser/                               # Chrome API ラッパー
│   ├── background/                        # Backgroundイベントリスナー
│   │   ├── contextMenus/
│   │   │   └── onClicked.ts               # 例：メニュークリック
│   │   ├── runtime/
│   │   │   └── ...（インストール、メッセージ受信）
│   │   └── tabs/
│   │       └── ...（タブ更新イベント）
│   ├── content/                           # Content Scriptリスナー
│   │   └── ...（メッセージ受信）
│   ├── tabs/                              # タブ操作サービス
│   │   ├── ChromeTabsService.ts
│   │   └── ...（その他のタブサービス）
│   └── ...（その他のサービス：runtime、popup、window等）
├── windows/                               # ウィンドウ関連サービス
│   └── getSelectionService.ts
└── di/                                    # 依存性注入設定
    └── container.ts                       # DIコンテナ（tsyringe）
```

**設計ガイドライン:**

1. **Repository実装:**
   - Application層のポート（Interface）を実装
   - Dexieを使用してIndexedDB操作
   - Domain Entityとストレージモデルの変換

2. **Chrome APIラッパー:**
   - Chrome APIを直接呼び出さず、サービスクラスでラップ
   - エラーハンドリングを統一
   - テスト可能性の向上

3. **イベントリスナーの分離:**
   - background/content の各イベントは別ファイルに分離
   - リスナー登録関数をエクスポート
   - entrypoints/ から呼び出す

**実装例（Reposito<br>ry）:**
```typescript
// infrastructure/persistence/indexeddb/DexieRewriteRuleRepository.ts
import { injectable } from 'tsyringe';
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { db } from './DexieDatabase';

@injectable()
export class DexieRewriteRuleRepository implements IRewriteRuleRepository {
  async save(rule: RewriteRule): Promise<void> {
    await db.rewriteRules.put({
      id: rule.getId(),
      urlPattern: rule.getUrlPattern(),
      oldString: rule.getOldString(),
      newString: rule.getNewString(),
      isRegex: rule.getIsRegex(),
    });
  }

  async findAll(): Promise<RewriteRule[]> {
    const records = await db.rewriteRules.toArray();
    return records.map(r => new RewriteRule(
      r.id, r.urlPattern, r.oldString, r.newString, r.isRegex
    ));
  }
}
```

**実装例（Chrome APIラッパー）:**
```typescript
// infrastructure/browser/tabs/ChromeTabsService.ts
import { injectable } from 'tsyringe';
import { IChromeTabsService } from 'src/application/ports/IChromeTabsService';
import { Tab } from 'src/domain/value-objects/Tab';

@injectable()
export class ChromeTabsService implements IChromeTabsService {
  async query(queryInfo: chrome.tabs.QueryInfo): Promise<Tab[]> {
    const tabs = await chrome.tabs.query(queryInfo);
    return tabs.map(t => new Tab(t.id!, t.url!));
  }
}
```

---

### 1.4 Presentation層

**責務:**
- UI表示（React コンポーネント）
- ユーザー入力の受付
- UseCaseの呼び出し
- エントリーポイントの定義

**依存:**
- Application層（UseCaseのみ）

**ファイル配置:**
```
src/
├── components/                            # Reactコンポーネント（Atomic Design）
│   ├── atoms/                             # 最小単位のUI要素
│   │   ├── Button.tsx                     # 例：ボタンコンポーネント
│   │   ├── Input.tsx                      # 例：入力フィールド
│   │   └── ...（その他のatoms：TextArea、Checkbox等）
│   ├── molecules/                         # atomsの組み合わせ
│   │   ├── LabeledInput.tsx               # 例：ラベル付き入力
│   │   └── ...（その他のmolecules）
│   ├── organisms/                         # moleculesの組み合わせ
│   │   ├── RewriteRuleForm.tsx            # 例：ルール編集フォーム
│   │   └── ...（その他のorganisms）
│   └── pages/                             # 画面全体
│       └── ...（ページコンポーネント）
└── entrypoints/                           # WXT エントリーポイント
    ├── background.ts                      # Background Service Worker
    ├── content.ts                         # Content Script
    ├── popup/                             # Popup画面
    │   ├── App.tsx
    │   └── main.tsx
    ├── edit/                              # 編集画面
    │   └── ...（App.tsx、main.tsx）
    └── rules/                             # ルール一覧画面
        └── ...（App.tsx、main.tsx）
```

**設計ガイドライン:**

1. **Atomic Designの適用:**
   - atoms: 最小単位のUIコンポーネント（Button, Input等）
   - molecules: atomsの組み合わせ（LabeledInput等）
   - organisms: moleculesの組み合わせ（Form等）
   - pages: 画面全体

2. **コンポーネントの責務:**
   - **1コンポーネント = 1UseCase呼び出し** を基本とする
   - Chrome APIやwindowオブジェクトに直接アクセスしない
   - ビジネスロジックはUseCaseに委譲

3. **エントリーポイントの設計:**
   - **薄く保つ**: ビジネスロジックを持たない
   - **Composition Root**: DIコンテナの初期化とイベントリスナー登録のみ
   - **リスナー分離**: イベントハンドラーは別ファイルに分離

**実装例（エントリーポイント）:**
```typescript
// entrypoints/background.ts
import { contextMenusOnClicked } from 'src/infrastructure/browser/background/contextMenus/onClicked';
import { runtimeOnExtensionInstalled } from 'src/infrastructure/browser/background/runtime/onExtensionInstalled';
import { runtimeOnMessageReceived } from 'src/infrastructure/browser/background/runtime/onMessageReceived';
import { tabsOnUpdated } from 'src/infrastructure/browser/background/tabs/onUpdated';

export default defineBackground({
  type: 'module',
  main() {
    // DI準備は container側で完了済み
    // 各イベントリスナーを登録（Composition Root）
    tabsOnUpdated();
    runtimeOnExtensionInstalled();
    runtimeOnMessageReceived();
    contextMenusOnClicked();
  },
});
```

**実装例（Reactコンポーネント）:**
```typescript
// components/pages/EditRulePage.tsx
import { container } from 'src/infrastructure/di/container';
import { SaveRewriteRuleAndApplyToCurrentTabUseCase } from 'src/application/usecases/rule/SaveRewriteRuleAndApplyToCurrentTabUseCase';

export const EditRulePage: React.FC = () => {
  const handleSave = async (formData: FormData) => {
    // UseCaseをDIコンテナから取得
    const useCase = container.resolve(SaveRewriteRuleAndApplyToCurrentTabUseCase);

    // UseCaseを実行
    await useCase.execute({
      urlPattern: formData.get('urlPattern'),
      oldString: formData.get('oldString'),
      newString: formData.get('newString'),
      isRegex: formData.get('isRegex') === 'true',
    });
  };

  return <RewriteRuleForm onSave={handleSave} />;
};
```

---

## 2. 依存関係ルール

### 2.1 基本原則

```
依存の方向: Presentation → Application → Domain ← Infrastructure
```

1. **外側の層は内側の層に依存できる**
   - Presentation → Application
   - Application → Domain
   - Infrastructure → Domain, Application

2. **内側の層は外側の層に依存してはいけない**
   - Domain層は他のどの層にも依存しない
   - Application層はInfrastructure層に直接依存しない（ポート経由）

3. **Infrastructure層はポート（Interface）を実装**
   - Application層でInterface定義
   - Infrastructure層で具象クラス実装
   - DIコンテナでバインディング

### 2.2 禁止事項

| 層 | 禁止事項 |
|----|---------|
| **Domain** | Chrome API, DOM API, window, document, Infrastructure層への依存 |
| **Application** | Chrome API, DOM API, Infrastructure層の具象クラスへの直接依存 |
| **Infrastructure** | 特になし（ただし責務範囲を守る） |
| **Presentation** | Chrome API直接呼び出し、ビジネスロジックの実装 |

---

## 3. メッセージング戦略

### 3.1 コンテキスト間通信

Chrome拡張では、Background/Content/Popup間でメッセージングが必要です。

**現状の実装:**
- `chrome.runtime.sendMessage()` / `chrome.runtime.onMessage.addListener()` を直接使用
- メッセージハンドラーは `infrastructure/browser/` 配下に分離

**将来の改善案（ADR参照）:**
- `@webext-core/messaging` の導入検討
- 型安全なメッセージング
- if文連鎖の排除

### 3.2 メッセージフロー

```
Popup (UI)
  ↓ sendMessage
Background (ハンドラー)
  ↓ UseCase実行
  ↓ Repository経由でデータ取得
  ↓ sendMessage
Content Script
  ↓ DOM操作実行
```

---

## 4. テスト戦略

### 4.1 層別テスト方針

| 層 | テスト種別 | テストツール | モック対象 |
|----|----------|------------|----------|
| **Domain** | Unit Test | Vitest | なし（純粋関数） |
| **Application** | Unit Test | Vitest | Repository（ポート） |
| **Infrastructure** | Unit Test（一部） | Vitest | Chrome API, IndexedDB |
| **Presentation** | E2E Test | Playwright | - |

### 4.2 テスト実装場所

```
tests/
├── unit/
│   ├── domain/          # Domain層のテスト
│   ├── application/     # Application層のテスト
│   └── infrastructure/  # Infrastructure層のテスト（di/, persistence/のみ）
└── e2e/                 # E2Eテスト
```

---

## 5. 設計原則の適用

### 5.1 SOLID原則

1. **Single Responsibility Principle (SRP)**
   - 1クラス1責務
   - UseCaseは1ユーザーアクションに対応

2. **Open/Closed Principle (OCP)**
   - Strategy Patternの活用（PatternProcessingStrategy）

3. **Liskov Substitution Principle (LSP)**
   - ポート（Interface）による抽象化

4. **Interface Segregation Principle (ISP)**
   - 必要最小限のInterface定義

5. **Dependency Inversion Principle (DIP)**
   - ポート＆アダプターパターン
   - DIコンテナによる依存性注入

### 5.2 ThoughtWorks Anthology 9原則

プロジェクト全体で以下の9原則を適用しています（詳細は `.clinerules/01-coding-standards.md` 参照）:

1. 1メソッド1インデントレベル
2. else句を使わない
3. プリミティブ型・文字列のラップ
4. 1行1ドット（例外: Chrome API）
5. 名前を省略しない
6. すべてのエンティティを小さく保つ
7. 1クラス2インスタンス変数まで
8. ファーストクラスコレクション
9. getter/setter/property禁止

---

**作成日:** 2025-11-08
**最終更新日:** 2025-11-08
**バージョン:** 1.0
