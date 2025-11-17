# プロジェクト概要・方式設計書

## 1. プロジェクト基本情報

### プロジェクト名
**frog-frame-front** - Chrome拡張機能（DOM操作自動化ツール）

### 概要
ユーザーが定義したルールに基づいてWebページのDOM要素を自動的に書き換えるChrome拡張機能です。ページ読み込み時やコンテキストメニューからの手動実行により、テキストやHTML要素を置換できます。

### 開発期間
- 開始: 2025年10月
- バージョン: 0.1.1（開発中）

### 技術スタック

| 分類 | 技術 | バージョン | 採用理由 |
|------|------|-----------|---------|
| **フレームワーク** | WXT | 最新版 | Viteベース、HMR対応、TypeScript完全サポート、Chrome拡張開発の生産性向上 |
| **言語** | TypeScript | 5.6+ | 型安全性、IDE支援、保守性の向上 |
| **UIライブラリ** | React | 18.3+ | 宣言的UI、コンポーネント再利用性 |
| **アーキテクチャ** | Clean Architecture + DDD | - | ビジネスロジックとインフラの分離、テスタビリティ、保守性 |
| **DI Container** | tsyringe | 4.10+ | 依存性注入、インターフェース駆動設計 |
| **メタデータ** | reflect-metadata | 0.2+ | tsyringeのデコレータサポート |
| **ストレージ** | Dexie (IndexedDB) | 4.2+ | 大容量データ保存、トランザクション、型安全なAPI |
| **テスト** | Vitest + Playwright | 最新版 | 高速な単体テスト、信頼性の高いE2Eテスト |
| **コード品質** | ESLint + Knip | 最新版 | コード規約の統一、未使用コードの検出 |

---

## 2. 方式設計

### 2.1 アーキテクチャ方針

#### Clean Architectureの採用

**採用理由:**
1. Chrome拡張特有の制約（background/content分離）に対応しやすい
2. ビジネスロジックとChrome APIの依存を分離
3. テストが書きやすい（ユニットテスト容易性）
4. 技術スタック変更への対応力（将来的なFirefox対応も視野）
5. ドメイン駆動設計との親和性

**層構造:**

![Clean Architecture 層構造](../diagrams/exports/architecture-layers.svg)

**PlantUML ソース:** [architecture-layers.puml](../diagrams/architecture-layers.puml)

> **Note:** SVG画像はPlantUMLソースから生成されます。画像が表示されない場合は、PlantUMLサーバーを使用してソースから生成してください。

**依存関係ルール:**
- 外側の層は内側の層に依存できる
- 内側の層は外側の層に依存してはいけない
- Domain層は完全に独立（他の層に依存しない）
- Infrastructure層はポート（Interface）を通じてDomain/Application層と連携

**Domain層の独立性:**
- Chrome APIやDOMアクセスは禁止
- window, document等のブラウザAPIは使用不可
- 純粋なビジネスロジックのみを実装

---

### 2.2 Chrome拡張特有の方式設計

#### 2.2.1 実行コンテキストの分離

Chrome拡張は3つの実行コンテキストに分かれます:

| コンテキスト | DOMアクセス | Chrome API | 役割 |
|------------|------------|-----------|------|
| **Background** | ❌ 不可 | ✅ 全て利用可 | データ永続化、メッセージルーティング |
| **Content** | ✅ 可能 | △ 制限あり | DOM操作、ページ内処理 |
| **Popup/Options** | ✅ 可能 | ✅ 全て利用可 | ユーザー向けUI |

**設計方針:**
- Background: IndexedDBへのCRUD操作、メッセージハンドリング
- Content: DOM要素の検索・置換処理
- Popup/Edit: ユーザーからのルール入力受付

#### 2.2.2 entry points の薄層化方針

**課題:**
- `entrypoints/background.ts` や `entrypoints/content.ts` にロジックを詰め込むと肥大化
- 数百行のファイルになり保守性が低下
- 新機能追加時の影響範囲が拡大

**採用パターン: Handler分離 + UseCase呼び出し**

**構造:**
```
entrypoints/
├── background.ts          # エントリーポイント（薄く保つ）
├── content.ts             # エントリーポイント（薄く保つ）
├── popup/
│   └── App.tsx            # UseCaseを呼び出すだけ
└── edit/
    └── App.tsx            # UseCaseを呼び出すだけ
```

**エントリーポイントの役割:**
- DIコンテナの初期化
- ハンドラーの登録のみ
- ビジネスロジックは持たない

**実装例抜粋（background.ts）:**
```typescript
import { runtimeOnMessageReceived } from 'src/infrastructure/browser/background/runtime/onMessageReceived';
// ... 他のリスナーをインポート

export default defineBackground({
  // Set manifest options
  type: 'module',

  main() {
    // DI準備は container側で完了済み
    // 各イベントリスナーを登録（Composition Root）
    runtimeOnMessageReceived();
    // インポートした他のリスナーもここで登録
  },
});
```

**メリット:**
1. ✅ 1ファイル1責任の原則を守れる
2. ✅ 可読性の向上
3. ✅ 新機能追加・修正が容易

**ADR参照:** `docs/design/adr/001-use-wxt-framework.md`

---

#### 2.2.3 ストレージ戦略

**採用: Dexie (IndexedDB) + Repository Pattern**

| ストレージ | 用途 | 理由 | 本プロジェクトでの使用 |
|-----------|------|------|---------------------|
| **IndexedDB (Dexie)** | RewriteRuleの永続化 | 大容量、構造化データ、トランザクション | ✅ 使用中 |
| chrome.storage.local | 一時的なデータ保存 | contextMenuとpopup間でのデータ共有 | 今後廃止の可能性 |

**Dexie採用理由:**
- 今後RewriteRuleを発展させるため、テーブル構造が必要
- MySQLのようなリレーショナルDBに近い操作、マイグレーションが可能
- TypeScriptの型定義が充実
- トランザクション処理が簡潔に書ける

---

### 2.3 コンポーネント設計方針（Atomic Design）

**階層:**
```
components/
├── atoms/         # 最小単位（Button, Input, TextArea）
├── molecules/     # atoms の組み合わせ（LabeledInput, SaveButton）
├── organisms/     # molecules の組み合わせ（RewriteRuleForm）
└── pages/         # 画面全体（EditRulePage）
```

**原則:**
- コンポーネントは1つのUseCaseメソッドを呼び出すのが理想
- Chrome APIやwindowオブジェクトへの直接アクセス禁止
- ビジネスロジックはUseCaseに委譲

---

### 2.4 ディレクトリ構成

```
host-frontend-root/frontend-src-root/src/
├── entrypoints/            # WXT Entrypoints
│   ├── background.ts       # Background Script (薄く保つ)
│   ├── content.ts          # Content Script (薄く保つ)
│   ├── popup/              # Popup UI
│   ├── edit/               # Edit Rule UI
│   └── rules/              # Options UI
│
├── domain/                 # Domain層
│   ├── entities/
│   │   ├── (..種々のEntityファイル..)
│   │   └── RewriteRule/ # RewriteRule関連Entity
│   ├── value-objects/
│   ├── constants/
│   └── errors/
│
├── application/            # Application層
│   ├── usecases/
│   │   ├── contextmenu/ # contextmenu関連UseCase
│   │   ├── popup/ # popup関連UseCase
│   │   ├── rule/ # rule関連UseCase
│   │   ├── selection/ # 右クリック関連UseCase
│   │   └── window/ # window関連UseCase
│   ├── ports/             # infrastructure層を利用するためのInterface定義
│   └── types/
│
├── infrastructure/         # Infrastructure層
│   ├── persistence/
│   │   ├── indexeddb/
│   │   └── storage/
│   ├── browser/           # Chrome API ラッパー
│   │   ├── tabs/ # tabのRead / Writeサービス
│   │   ├── runtime/ # 主にメッセージング関連
│   │   ├── popup/ # popup関連
│   │   └── window/ # window関連
│   └── di/
│       └── container.ts    # DI Container設定
│
├── components/             # Presentationコンポーネント
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── pages/
│
└── utils/
```

---

## 3. 開発フロー

### 3.1 新機能開発の流れ

1. **要件定義**
   - Issueの作成（`docs/issue-nnn/ISSUE.md`）
   - User Storyの明確化

2. **基本設計**
   - 必要に応じて `docs/design/screens/` に画面仕様を作成
   - データフロー図の作成（PlantUML推奨）

3. **詳細設計**
   - 必要なら `docs/design/03-application-layer.md` にUseCaseを追加
   - 必要なら `docs/design/07-data-schema.md` にテーブルを追加

4. **実装順序**
   - Domain層（Entity, ValueObject）
   - Application層（UseCase, Port）
   - Infrastructure層（Repository実装）
   - Presentation層（Component）

5. **テスト**
   - Unit Test（Vitest）: `tests/unit/`
   - E2E Test（Playwright）: `tests/e2e/`
   - コマンド: `make testlint`（必須）

6. **レビュー & マージ**
   - Pull Request作成
   - develop ブランチへマージ

---

## 4. ブランチ戦略

### Git Flow（簡易版 + リリースブランチ）

```
main          ────●────────●──────●─────→ (プロダクション)
               ↗        ↗        ↗
0.1.1.1    ───●         │        │        (リリースブランチ)
             ↗          │        │
develop    ─●───●───●───●───●───●───●───→ (開発中)
             ↗   ↗   ↗   ↗   ↗   ↗
issue-nnn ─●   ●   ●   ●   ●   ●
```

**ブランチの役割:**

- `main`: 本番環境リリース用ブランチ
- `develop`: 開発中ブランチ（デフォルト、全Issue作業の起点）
- `issue-nnn-xxx`: Issue番号ベースの機能開発ブランチ
- `x.y.z.w` (例: `0.1.1.1`): リリース準備ブランチ
  - developから特定の機能群をリリースする際に作成
  - リリース前のバグフィックスやドキュメント整備を実施
  - リリース後の緊急修正もこのブランチで実施可能

---

## 5. AI支援開発の方針

### 5.1 ドキュメント参照ルール

Claude Code/Clineを使用する際、以下を必ず参照させる:

**新機能開発時:**
1. `docs/design/00-overview.md`（このファイル）
2. `docs/design/01-architecture.md`
3. `docs/design/screens/[画面]/[機能].md`

**既存修正時:**
1. `docs/design/00-overview.md`（このファイル）
2. 該当するlayer定義
   - `docs/design/02-domain-layer.md` - Domain層
   - `docs/design/03-application-layer.md` - Application層
3. `docs/design/08-constraints-matrix.md` - Chrome拡張の制約

### 5.2 プロンプトテンプレート

```
以下のドキュメントを読んでから、[機能名]を実装してください：
- docs/design/00-overview.md
- docs/design/01-architecture.md
- docs/design/screens/[画面]/[機能].md

制約：
- Clean Architectureの依存関係ルールを守る
- Domain層はChrome APIやDOM APIに依存しない
- entrypoints/ は薄く保ち、ビジネスロジックはUseCaseに実装
- DIコンテナ (tsyringe) を使用して依存性を注入
```

---

## 6. テスト戦略

### 6.1 テスト方針

| テスト種別 | 対象 | ツール | ファイル配置 |
|----------|------|-------|------------|
| **Unit Test** | Domain, Application, Infrastructure | Vitest + happy-dom | `tests/unit/` |
| **E2E Test** | 拡張機能全体の動作 | Playwright | `tests/e2e/` |

### 6.3 テストの命名規則
`frog-frame-front/.clinerules/03-test-coding-standards.md` を参照。

---

## 付録: ADR (Architecture Decision Record)

重要な技術判断は `docs/design/adr/` に記録します。

### ADR一覧
- [001-use-wxt-framework.md](adr/001-use-wxt-framework.md) - WXT採用理由
- [002-listener-separation-pattern.md](adr/002-listener-separation-pattern.md) - エントリーポイント薄層化パターン
- [003-use-dexie-for-indexeddb.md](adr/003-use-dexie-for-indexeddb.md) - Dexie採用理由（IndexedDBラッパー）

---

**作成日:** 2025-11-08
**最終更新日:** 2025-11-08
**バージョン:** 1.0
