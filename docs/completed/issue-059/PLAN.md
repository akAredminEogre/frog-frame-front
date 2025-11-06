# issue-059 実装計画：ストレージの書き換えルール保存方法のリファクタリング

## 概要
現在の個別ルール保存方式から、RewriteRulesファーストコレクションオブジェクトを使用した構造化された保存方式への変更。

## 問題分析
- 現在の実装：`await chrome.storage.local.set({ [rule.id]: rule });` で個別ルールを保存
- 課題：ルールが chrome.storage.local の直下に散らばって保存される
- 改善点：RewriteRulesオブジェクトとして一元管理し、構造化された保存形式に変更

## 実装アプローチ

### 1. RewriteRulesファーストコレクションの作成
**対象ファイル**: `src/domain/value-objects/RewriteRules.ts`
- RewriteRuleの集合を管理するファーストコレクションオブジェクト
- ルールの追加、削除、検索機能を提供
- オブジェクト指向ルールに従い、プリミティブなコレクションをラップ

### 2. IRewriteRuleRepositoryインターフェースの拡張
**対象ファイル**: `src/application/ports/IRewriteRuleRepository.ts`
- `getAll(): Promise<RewriteRules>` メソッドの追加
- 既存の `save` メソッドの型定義はそのまま維持

### 3. ChromeStorageRewriteRuleRepositoryの修正
**対象ファイル**: `src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository.ts`
- `save` メソッドの修正：RewriteRulesオブジェクト全体を保存
- `getAll` メソッドの実装：RewriteRulesオブジェクトを取得
- ストレージ形式を `{ RewriteRules: { [rule.id]: rule } }` に変更

### 4. 既存テストファイルの修正
**対象ファイル**: 
- `tests/unit/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository/**/*.test.ts`
- 新しいストレージ構造に対応したテストケースに更新

## 詳細実装計画

### Phase 1: RewriteRulesファーストコレクションの作成
```typescript
// src/domain/value-objects/RewriteRules.ts
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';

export class RewriteRules {
  private readonly rules: Map<string, RewriteRule>;

  constructor(rulesObject: Record<string, RewriteRule> = {}) {
    this.rules = new Map(Object.entries(rulesObject));
  }

  add(rule: RewriteRule): RewriteRules {
    const newRules = new Map(this.rules);
    newRules.set(rule.id, rule);
    return new RewriteRules(Object.fromEntries(newRules));
  }

  remove(ruleId: string): RewriteRules {
    const newRules = new Map(this.rules);
    newRules.delete(ruleId);
    return new RewriteRules(Object.fromEntries(newRules));
  }

  findById(ruleId: string): RewriteRule | undefined {
    return this.rules.get(ruleId);
  }

  toArray(): RewriteRule[] {
    return Array.from(this.rules.values());
  }

  toObject(): Record<string, RewriteRule> {
    return Object.fromEntries(this.rules);
  }

  size(): number {
    return this.rules.size;
  }

  isEmpty(): boolean {
    return this.rules.size === 0;
  }
}
```

### Phase 2: IRewriteRuleRepositoryの拡張
```typescript
// src/application/ports/IRewriteRuleRepository.ts
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

export interface IRewriteRuleRepository {
  save(rule: RewriteRule): Promise<void>;
  getAll(): Promise<RewriteRules>;
}
```

### Phase 3: ChromeStorageRewriteRuleRepositoryの修正
```typescript
// src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository.ts
import { IRewriteRuleRepository } from 'src/application/ports/IRewriteRuleRepository';
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';

export class ChromeStorageRewriteRuleRepository implements IRewriteRuleRepository {
  private static readonly STORAGE_KEY = 'RewriteRules';

  async save(rule: RewriteRule): Promise<void> {
    // 既存のルール集合を取得
    const existingRules = await this.getAll();
    
    // 新しいルールを追加
    const updatedRules = existingRules.add(rule);
    
    // 全体を保存
    await chrome.storage.local.set({
      [ChromeStorageRewriteRuleRepository.STORAGE_KEY]: updatedRules.toObject()
    });
  }

  async getAll(): Promise<RewriteRules> {
    const result = await chrome.storage.local.get([ChromeStorageRewriteRuleRepository.STORAGE_KEY]);
    const rulesObject = result[ChromeStorageRewriteRuleRepository.STORAGE_KEY] || {};
    return new RewriteRules(rulesObject);
  }
}
```

### Phase 4: マイグレーション対応
- 既存の個別ルールキー形式からRewriteRulesオブジェクト形式への移行処理
- 初回読み込み時に古い形式のデータを検出し、新形式に変換

## 実装手順と現在の状況

### ステップ 1: RewriteRulesファーストコレクション作成
- [x] `RewriteRules.ts` 作成・実装
- [x] `RewriteRules.test.ts` 作成・ユニットテスト実装（規約に従いメソッド別に分割）
  - **注意**: PROGRESS-01-06のレビューコメントにより、追加のテストコーディング規約対応が必要

### ステップ 2: インターフェース拡張
- [x] `IRewriteRuleRepository.ts` に `getAll` メソッド追加

### ステップ 3: Repository実装修正
- [x] `ChromeStorageRewriteRuleRepository.ts` の `save` メソッド修正
- [x] `ChromeStorageRewriteRuleRepository.ts` に `getAll` メソッド実装

### ステップ 4: マイグレーション対応
- [x] ~~既存データ形式の検出・変換ロジック実装~~ (レビューコメント対応により削除)
- [x] ~~マイグレーション処理のテスト実装~~ (レビューコメント対応により削除)

### ステップ 5: 既存テストの修正
- [x] ChromeStorageRewriteRuleRepository関連テストファイルの修正
- [x] 新しいストレージ構造に対応したテストケース更新

### ステップ 6: 統合テスト
- [x] 全てのユニットテストが通ることを確認（53 passed, 219 tests）
- [x] 既存機能に影響がないことを確認（E2Eテスト 6 passed）

## 受け入れ条件
- [x] ストレージ構造が `{ RewriteRules: { [rule.id]: rule } }` 形式になっていること
- [x] RewriteRulesファーストコレクションオブジェクトが実装されていること
- [x] IRewriteRuleRepository.getAll() メソッドが追加されていること
- [x] ChromeStorageRewriteRuleRepository.save() が RewriteRules オブジェクト全体を保存すること
- [x] ~~既存のルールデータが新形式に正しく移行されること~~ (レビューコメント対応により削除)
- [x] 全てのユニットテストがパスすること

## 技術的制約・考慮事項
- オブジェクト指向ルール（ThoughtWorksアンソロジー）への準拠
- クリーンアーキテクチャの維持
- 既存機能への影響最小化
- Chrome Storage APIの制限（容量・同期処理）への配慮

## リスク・懸念事項
- 既存データの互換性問題
- マイグレーション処理のパフォーマンス
- ストレージ容量の使用量変化
- 複数タブでの同時アクセス時の競合状態

## 残タスク
- [x] ChromeStorageRewriteRuleRepositoryのユニットテスト追加 (完了 - スクラム02)
- [x] RewriteRule.fromPlainObjectメソッドのテスト実装 (完了 - 14テスト成功)
- [x] バリデーション機能の追加とテスト修正 (完了 - .toThrow()対応)
- [x] テストリファクタリング (完了 - 配列形式への変更)

## 追加実装内容（スクラム01で実施）
### RewriteRule.fromPlainObjectメソッドのテスト実装
- **正常系テスト**: 5つのテストケースで全パラメータ組み合わせをカバー
- **異常系テスト**: 1つのテストケース（部分的パラメータ不足）  
- **バリデーションエラーテスト**: 8つのテストケース（配列形式で実装）
- **バリデーション機能追加**: 不正な入力に対してエラーを投げる仕様に変更
- **テストファイル**: 
  - `normal-cases.test.ts` (正常系)
  - `error-cases.test.ts` (異常系)
  - `validation-error-cases.test.ts` (バリデーションエラー、it.each使用)
- **テストリファクタリング**: 配列形式でテストケースを管理し、可読性と保守性を向上

### 実装完了ステータス
すべての受け入れ条件を満たし、追加でRewriteRuleエンティティの堅牢性も強化されました。
