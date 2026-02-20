# 開発フロー（AI駆動開発版）

このドキュメントは frog-frame-front における AI 駆動開発の標準フローを定義する。

## 基本フロー

```text
00-overview.md
    ↓
01-class-design.md（クラス設計）
    ↓
02-sequence.puml（シーケンス図）
    ↓
E2E テスト 1 シナリオ実装（※スケルトン実装フェーズは廃止）
    ↓
ユニットテスト戦略・不具合修正
```

## 廃止: スケルトン実装フェーズ

**旧フロー（廃止）**:
```text
02-sequence.puml → 03-directory-structure.md → ADR準拠スケルトン実装 → ...
```

**理由**: スケルトン実装は価値を生まない中間成果物であり、AI駆動開発のスピードを阻害する。
設計の意図は 01-class-design.md と 02-sequence.puml で十分に表現できる。

**`03-directory-structure.md` の扱い**:
- オプション扱いに変更
- クラス設計・シーケンス図からディレクトリ構成が自明でない複雑な機能にのみ作成
- 参照: [docs-rules/design.md](../docs-rules/design.md)

## E2E 1 シナリオ実装の進め方

### 目標

設計完了後、最初のE2Eシナリオが通る状態を最短距離で達成する。

### 手順

1. `02-sequence.puml` から最も重要な1つのE2Eシナリオを選択
2. そのシナリオを通すために必要な最小限の実装のみ作成
   - 不要なメソッドのスタブは作らない
   - 将来の拡張を見越したインターフェース定義も後回し
3. E2Eテストがパスしたら、ユニットテストを追加
4. 不具合修正・リファクタリング

### MAS並行開発での適用

複数の足軽（ashigaru）に並行作業を割り当てる場合:
- ユニット単位（クラス/機能ごと）でブランチを切り、git worktreeで並行実装
- 詳細: [.AI/mas-parallel-development.md](./mas-parallel-development.md)

## テスト方針

**ローカルでの全テスト実行は不要**。CI/CDに委譲する。

| 場面 | 推奨 |
|------|------|
| 実装中（ローカル） | 変更した機能に関連するユニットテストのみ実行 |
| PR作成前 | Lint チェック（`make lint`）のみ実行 |
| CI/CD | 全テスト（ユニット + E2E）を自動実行 |
| Docker使用 | E2E確認など実際の挙動確認が必要な場合のみ |

詳細: [.AI/testing-requirements.md](./testing-requirements.md)

## PR 運用方針

ユーザーストーリー境界に縛られず、作業中に気づいた改善を同一PRに含めてよい。

詳細: [.AI/pr-policy.md](./pr-policy.md)
