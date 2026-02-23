# README.md ガイドライン

user-story ディレクトリ内の README.md 作成ルール。

## 必須セクション

| セクション | 必須 | 説明 |
|-----------|------|------|
| ストーリー | ○ | 引用形式でユーザーストーリーを記載 |
| 概要 | ○ | 機能の説明 |
| 設計ドキュメント | ○ | 関連する設計ドキュメントへのリンク |
| 現状分析 | ○ | 設計目標と現在の実装の差分分析 |
| 開発戦略 | ○ | 1PR単位のタスクチェックリスト |
| 受け入れ条件 | ○ | acceptance-criteria.mdへのリンク |

## 現状分析

設計ドキュメント（理論的設計）と現在の実装の差分を分析し、開発戦略の判断材料とする。

### 差分の分類

設計と実装の差分を以下の5分類で整理する:

| 分類 | 新規作成 | 既存 | 配置適切 | ロジック変更 | 対応方針 |
| ------|----------|------|----------|--------------|----------|
| A | ○ | - | - | - | 新規作成する |
| B | - | ○ | - | - | 機能開発後にリファクタリング的に配置変更(または対応しない) |
| C | - | ○ | - | ○ | 先に理論的配置へ移行 → 修正 |
| D | - | ○ | ○ | - | 対応不要 |
| E | - | ○ | ○ | ○ | 修正のみ行う |

#### ポイント

分類Cのファイルのみ前提タスクとして移行を行う

#### 分析手順

- **03-directory-structure.md（理論）と現在のディレクトリ構造を比較**
- 各ファイルを上記5分類に振り分ける
- 分類Cのファイルについて、影響ファイル数を調査
- 影響を受けるファイル・モジュールをClean Architectureの層ごとに列挙
- 新規作成ファイルは分析対象外（既存ファイルの変更のみ分析）

#### 注意

Clean Architecture遵守のためのディレクトリ移動は影響範囲が広くなるため、特に注意して分析する

## 開発戦略

### タスクセクション構成ルール

README.md の「開発戦略」セクションは、以下のいずれかの構成を採用できる:

- **Phase構成（推奨）**: Phase 0〜Phase 4 の段階的構成
- **3セクション構成**: 「前提タスク」「ユーザーストーリー達成タスク」「対応しない（分類B）」

新規作成時は、特に理由がない限りPhase構成を優先すること。

### 開発パターン: Parallel Change + Skeleton Pattern

Clean Architectureに従った機能追加では、既存コードを壊さずに新機能を追加するため、
**Parallel Change**パターンと**Skeleton**パターンを組み合わせて採用する。

#### Phase構成

| Phase | 内容 | 説明 | テスト |
|-------|------|------|--------|
| Phase 0 | 分類Cファイルのディレクトリ移動 | ロジック変更なし、配置のみ | - |
| Phase 1 | Skeleton作成 | ディレクトリ作成、既存インターフェース修正、新規スケルトンクラス（コンパイル通る最小実装） | 結合・E2Eテスト戦略書作成 |
| Phase 2 | 実装 | スケルトンにロジック追加 | 単体テスト戦略書作成・単体テスト実装 |
| Phase 3 | 統合 | 新旧並行稼働、UI統合 | 結合テスト・E2Eテスト実装 |
| Phase 4 | 旧コード削除 | 通常は別ユーザーストーリーで対応 | - |

#### 各層のPhase 1（Skeleton）記述ガイド

- 第1層 (enterprise-business-rules): エンティティにメソッドスケルトン追加
- 第2層 (application-business-rules): Input/Output Port、Gateway Interface、DTO、Interactorスケルトン
- 第3層 (interface-adapters): Controller、Presenter、Factory、Mapperスケルトン
- 第4層 (frameworks-and-drivers): UIコンポーネント、Gateway実装、MessagingService

#### Skeletonの定義

- コンパイルが通る最小実装
- 実際のロジックは空または `throw new Error('Not implemented')` で仮実装
- インターフェースは完全に定義する（メソッドシグネチャ、型定義）

#### Interface定義タスクの扱い

TypeScript `interface` の定義タスクは、以下のルールに従う:

1. **Phase 1（Skeleton）に含める**: interface定義は実装ロジックを持たないため、Phase 2（実装）ではなくPhase 1（Skeleton）のタスクとして扱う
2. **テスト戦略書・単体テストは不要**: interfaceはコンパイル時のみ存在し、ランタイムには残らないため、テストは不要
3. **タスク記載の簡略化**: Phase 2で個別タスクとして記載せず、Phase 1のスケルトン作成タスクに含める

**例:**

```markdown
#### Phase 1: Skeleton

- [x] IRewriteRuleRepository に delete() メソッドシグネチャを追加
- [x] RewriteRuleProxyService (IRewriteRuleProxyService) に deleteRule() スケルトン追加
- [x] DeleteRuleRequestDTO（メッセージング用DTO）← interfaceとして定義
```

**Phase 2でinterfaceを個別タスクとしない理由:**
- interfaceは型定義のみで実装ロジックがない
- TypeScriptコンパイラが型チェックを担当するため、ランタイムテストは無意味
- Phase 1で「シグネチャ追加」として完了すれば十分

##### ESLint未使用エラーの回避

スケルトン実装でインポートや引数が未使用になる場合、エラーメッセージ内で参照することでESLintエラーを回避する:

```typescript
// ✅ インポートと引数をエラーメッセージで使用
import { SomeOutputData } from 'src/application-business-rules/dto/output/SomeOutputData';

execute(input: SomeInputData): void {
  throw new Error(`Not implemented: ${SomeOutputData.name}, input: ${JSON.stringify(input)}`);
}

// ❌ 未使用のまま放置（ESLintエラー）
throw new Error('Not implemented');
```

#### DI登録のタイミング

- DI登録は原則としてPhase 3（統合）で行う
- Phase 1でDI登録が必要な場合はコンパイルエラー回避のためのみ（例: Skeleton実装が他モジュールから参照される場合）
- Phase 3で本実装のDI登録を行う際、Phase 1で暫定登録した場合は実装に合わせて更新する
- 例: `container.ts` での登録はPhase 3の実装完了時に行うのが基本（Phase 1での暫定登録は必要最小限に留める）

#### Mapperの責務（ADR-002, ADR-003準拠）

Mapperは以下の2つの責務を担当する:

- Entity ↔ DTO 変換
- IRewriteRuleMessagingPort経由の通信（依存性逆転によりPortを注入）

この設計はContent Script ↔ Background Script間のメッセージング通信において、Repositoryがメッセージング/DTOの詳細を意識しないための抽象化層として機能する。

### テスト戦略

各Phaseでのテスト関連タスク:

#### Phase 1: 結合・E2Eテスト戦略書の作成

Skeleton作成と並行して、以下のテスト戦略書を設計ドキュメントに追加する:

| 戦略書 | 配置先 | 参照ルール |
|-------|--------|-----------|
| 結合テスト戦略書 | `docs/design/pages/{page}/features/{feature}/integration-test-strategy.md` | [06-integration-test-strategy.md](../design/06-integration-test-strategy.md) |
| E2Eテスト戦略書 | `docs/design/pages/{page}/features/{feature}/e2e-test-strategy.md` | [07-e2e-test-strategy/format-guideline.md](../design/07-e2e-test-strategy/format-guideline.md) |

#### Phase 2: 実装・単体テスト戦略書・単体テスト

各タスクは「実装」と「テスト」を1行にまとめて記載する:

```markdown
- [ ] {コンポーネント名} の実装、テスト戦略書・単体テスト
```

- 実装とテストを分離せず、1タスク = 1コンポーネントの完成とする
- 単体テスト戦略書の配置先: `docs/design/src/{layer}/.../{methodName}.md`
- 参照: [05-test-strategy.md](../design/05-test-strategy.md)
- 各タスク完了後にテストがパスすることを確認
- セクション名はタスク内容を正確に反映すること
  - 異なる責務のタスクを1つのセクションにまとめない
  - 例: メッセージング基盤とRepository層は別セクションに分ける

#### Phase 3: UI統合

- 新規UIコンポーネントのレンダリング位置（どのViewコンポーネント内か）を明記すること
- 例: 「ConfirmDialog をRulesApp内でレンダリング（ページレベル）」

#### Phase 3: 結合テスト・E2Eテストの実装

- UI統合後、結合テスト戦略書に基づいてテストを実装
- E2Eテスト戦略書に基づいて実ブラウザでのテストを実装
- `make testcheck` がパスすることを確認

### タスク記載ルール

現状分析の結果とユーザーストーリー達成に必要なタスクを、1PR単位でチェックリスト形式で記載:

#### 開発タスクにおける実装詳細の記述

README.mdの開発タスクでは、状況に応じて実装詳細（変数名、クラス名、具体的な実装方法）を記述してよい:

- 開発タスクは「どう実装するか」を計画するものであり、具体的な実装方法の記述は有用
- ただし、acceptance-criteria.md では観察可能な振る舞いのみを記述すること（実装詳細は不可）

**README.md と acceptance-criteria.md の記述スタイル比較:**

| 要件 | README.md（開発タスク） | acceptance-criteria.md（受け入れ条件） |
|------|------------------------|---------------------------------------|
| 重複削除防止 | `deletingIds` による重複削除防止 | 削除処理中は同じルールの削除ボタンが無効化される |
| 非同期処理 | messaging経由でBackground Scriptに送信 | 削除処理中もブラウザや他タブの操作がブロックされない |
| アーキテクチャ | Controllerは Factory 経由で生成（ADR-005準拠） | Clean Architectureの層構造が遵守されている（コードレビューで検証） |
| コンポーネント配置 | ConfirmDialog をRulesApp内でレンダリング | 確認ダイアログが表示される |

- 各タスク = 1PR = 1チェックボックス（`- [ ]`）
- **分類Cのファイル移行**を前提タスクとして先に記載
  - ファイルのディレクトリ移動は、それだけで1ファイルにつき1PRとし、修正は別PRで行う
    - 修正を同時に行うと、影響範囲の特定が困難になるため
    - また関連するファイルだからといって、1PR内で複数ファイルを移動しないこと
    - 各PRごとに`make testcheck`が通ることを確認する。
- ユーザーストーリー達成に必要なタスクを後に記載
- タスクは依存関係順に並べる
- **分類Bのファイルは移行しない**（機能開発後のリファクタリング or 対応しない）
- PR番号は付けない
  - PRは実際の開発時に作成するため
  - また状況によりPRの増減、分割、統合が発生するため

### 完了条件

ユーザーストーリー完了時に、関連するファイル（分類A, C, E）はClean Architectureを遵守していること（分類Bのファイルは問わない）

### タスク網羅性チェック

開発戦略作成後、以下を確認すること:
1. 差分分類で「修正:必須」としたすべてのファイルに対応するタスクがあるか
2. 01-class-design.md で新規作成とした全クラスに対応するタスクがあるか
3. 分類Cファイルの移動タスク（前提タスク）と修正タスク（達成タスク）が両方あるか

### タスク進捗更新時のネットワーク図同期

README.mdのタスクチェックリストに進捗があった場合、`04-network-diagram.puml`も同時に更新すること。

#### 更新ルール

1. タスクを `- [ ]` から `- [x]` に変更した場合、対応するネットワーク図のノードも完了状態に更新する
2. ネットワーク図が存在する場合のみ適用（`04-network-diagram.puml` は必須ファイル）
3. 同一コミットまたは同一PRでREADME.mdとnetwork-diagram.pumlを更新する

#### 理由

- タスクの依存関係と進捗状況を視覚的に把握できる
- ドキュメント間の整合性を維持する
- プロジェクト全体の進捗を一目で確認できる

### 結合テスト・E2Eテスト実装時の戦略書リンク記載

結合テスト・E2Eテストを実装する際は、README.mdにチェックリストを直接記載するのではなく、該当するテスト戦略書へのリンクを記載すること。

#### 記載方法

```markdown
#### 結合テスト

- [ ] 結合テスト戦略書に基づくテスト実装完了
  - 詳細: [integration-test-strategy.md](../../design/pages/{page}/features/{feature}/integration-test-strategy.md)

#### E2Eテスト

- [x] E2Eテスト戦略書に基づくテスト実装完了
  - 詳細: [e2e-test-strategy.md](../../design/pages/{page}/features/{feature}/e2e-test-strategy.md)
```

#### 理由

- WET（Write Everything Twice）を避けられる
- テスト戦略書との整合性チェックが不要になる
- テストケースの管理が一元化される

## 完了時の更新

ユーザーストーリーを `completed/` ディレクトリに移動する際は、以下を更新すること:

### 1. 時制の過去形への変更

以下のセクションで現在形・未来形の記述を過去形に更新:

| セクション | 変更前の例 | 変更後の例 |
|-----------|-----------|-----------|
| ストーリー | 「〜を向上させる」 | 「〜を向上させた」 |
| 概要 | 「〜に移行する」 | 「〜に移行した」 |
| 現状分析 | 「現在の実装は〜を抱えている」 | 「移行前の実装は〜を抱えていた」 |
| 開発戦略 | 「〜で削除する」 | 「〜で削除した」 |

セクション見出しも適宜変更:
- 「現状分析」→「移行前の状態」
- 「現在のメッセージフロー」→「移行前のメッセージフロー」

### 2. タスクチェックリストの完了マーク

すべてのタスクを完了状態（`[x]`）に更新

### 3. 受け入れ条件の完了マーク

すべての受け入れ条件を完了状態（`[x]`）に更新
