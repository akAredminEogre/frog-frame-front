# 新機能開発フロー

## フロー

```text
00-overview.md(機能概要)           ← レビュー対象
    ↓
01-class-design.md(クラス設計)     ← 信頼して進める
02-sequence.puml(シーケンス図)     ← レビュー対象
03-directory-structure.md(理論的ディレクトリ構成)  ← 必須
04-arrow-diagram.md(依存関係・データフロー図)      ← 必須・信頼して進める
    ↓  ※01〜04は同時生成可
E2E 1 シナリオ実装                 ← レビュー対象(1パターン)
    ↓
ユニットテスト・不具合修正
```

## 設計方針

理論的設計(設計ドキュメント作成)を先行させ、E2E 1パターン実装に直結させる。設計成果物(03-directory-structure.md・04-arrow-diagram.md)は全機能で必須。

## 各ステップ

### 00-overview.md(必須)

機能概要を記載する。最初に作成し、以降のドキュメントの起点とする。

ルール: [docs-rules/design/00-overview.md](../../../docs-rules/design/00-overview.md)

### 01-class-design.md(必須)

Clean Architecture 4層に従った理論的設計を記載する。00-overview.md の後に作成する。

ルール: [docs-rules/design/01-class-design.md](../../../docs-rules/design/01-class-design.md)

### 02-sequence.puml(必須)

01-class-design.md を実現するシーケンス図を PlantUML 形式で記載する。

ルール: [docs-rules/design/02-sequence.md](../../../docs-rules/design/02-sequence.md)

### 03-directory-structure.md(必須)

全機能で作成すること。ディレクトリ構成を設計段階で明確化し、実装のばらつきを防ぐ。

ルール: [docs-rules/design/03-directory-structure.md](../../../docs-rules/design/03-directory-structure.md)

### 04-arrow-diagram.md(必須)

全機能で作成すること。コンポーネント間の依存関係・データフローを ASCII Art 形式で図示する。

ルール: [docs-rules/design/04-arrow-diagram.md](../../../docs-rules/design/04-arrow-diagram.md)

## E2E 1 シナリオ実装

### 目標

設計完了後、最初のE2Eシナリオが通る状態を最短距離で達成する。

### 手順

1. `02-sequence.puml` から最も重要な1つのE2Eシナリオを選択
2. そのシナリオを通すために必要な最小限の実装のみ作成
   - 不要なメソッドのスタブは作らない
   - 将来の拡張を見越したインターフェース定義は後回し
3. E2Eテストがパスしたら、ユニットテストを追加
4. 不具合修正・リファクタリング

## レビュー方針

| ドキュメント | レビュー | 説明 |
|-------------|---------|------|
| 00-overview.md | 必要 | 機能概要の正確性を確認 |
| 01-class-design.md | 信頼して進める | Clean Architecture原則に基づく設計を信頼 |
| 02-sequence.puml | 必要 | テストドキュメントとしての整合性を確認 |
| 03-directory-structure.md | 必要 | 実装との整合性を確認 |
| 04-arrow-diagram.md | 信頼して進める | 依存関係の可視化を信頼 |
| E2E 1パターン | 必要 | ハッピーパスシナリオの動作を確認 |

### 並行開発での適用

複数のサブエージェントに並行作業を割り当てる場合:

- ユニット単位(クラス/機能ごと)でブランチを切り、git worktreeで並行実装
- 詳細: [.AI/mas-parallel-development.md](../../../.AI/mas-parallel-development.md)

## テスト方針

ローカルでの全テスト実行は不要。CI/CDに委譲する。

| 場面 | 推奨 |
|------|------|
| 実装中(ローカル) | 変更した機能に関連するユニットテストのみ実行 |
| PR作成前 | Lint チェック(`make lint`)のみ実行 |
| CI/CD | 全テスト(ユニット + E2E)を自動実行 |
| Docker使用 | 実際の挙動確認が必要な場合のみ |

詳細: [.AI/testing-requirements.md](../../../.AI/testing-requirements.md)

## PR 運用方針

ユーザーストーリー境界に縛られず、作業中に気づいた改善を同一PRに含めてよい。

詳細: [.AI/pr-policy.md](../../../.AI/pr-policy.md)
