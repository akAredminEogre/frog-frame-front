# ISSUE-135 PULL REQUEST テンプレート

## タイトル
refactor: ElementSelector.test.tsをテストコーディング規約に準拠してリファクタリング

## 概要と理由
初期のコーディング規約が固まっていない頃に作られた `ElementSelector.test.ts` (506行) を、現在のテストコーディング規約 (`.clinerules/03-test-coding-standards.md`) に準拠してリファクタリングしました。

**リファクタリングの理由:**
- 1つのファイルに3つのメソッド（`getElementFromSelection`, `isTableElement`, `isWithinTable`）のテストが混在
- メソッド別分割がされておらず、テストコーディング規約違反
- 配列ベーステストの適用機会が存在（類似テストケースの冗長性）
- 異常系テストの分離不足（`Abend/`ディレクトリ構造なし）

## 主な変更点

### 1. テストファイル構造の改革
- **Before**: 単一ファイル（506行）に全メソッドのテストが混在
- **After**: メソッド別・用途別に7つのファイルに分割

### 2. 新しいディレクトリ構造
```
ElementSelector/
├── getElementFromSelection/
│   ├── normal-cases.test.ts (5テスト)
│   ├── table-element-cases.test.ts (3テスト)  
│   └── Abend/edge-cases.test.ts (5テスト)
├── isTableElement/
│   ├── table-elements-array.test.ts (7テスト - 配列ベース)
│   └── non-table-elements-array.test.ts (2テスト - 配列ベース)
└── isWithinTable/
    ├── nested-cases.test.ts (3テスト)
    └── Abend/boundary-cases.test.ts (1テスト)
```

### 3. 配列ベーステスト導入
- `isTableElement`メソッド: 9個の類似テストを2つの配列ベーステストに統合
- 保守性向上、テストケース追加の効率化

### 4. 異常系テスト分離
- `Abend/`ディレクトリでエッジケース・境界条件を明確分離
- 正常系と異常系の責務分離

## テスト方法
[動作確認の手順]
- `make testcheck` で回帰テスト通過を確認
  - 既存自動テストとlinterを同時に確認
- 全217テスト成功を確認済み
- 分割後の新しいテストファイル群の正常動作確認済み

## 補足
[追加の文脈や注意点]
- 元ファイルのバックアップ (`ElementSelector.test.ts.backup`) を作成済み
- 既存テストの動作を完全保持（回帰なし）
- テストコーディング規約完全準拠達成
- Clean Architecture + DDD パターンに沿ったテスト構造

## 本スコープの対象外となったタスク
- 他のテストファイルへの配列ベーステストパターン適用拡張
- privateメソッドテストの型安全性向上検討
- E2Eテストでの新構造確認

<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/02-submit-pull-request.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/04-pull-request/03-merge-pull-request.md -->