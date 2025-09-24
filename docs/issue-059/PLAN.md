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
- [ ] `RewriteRules.ts` 作成・実装
- [ ] `RewriteRules.test.ts` 作成・ユニットテスト実装

### ステップ 2: インターフェース拡張
- [ ] `IRewriteRuleRepository.ts` に `getAll` メソッド追加

### ステップ 3: Repository実装修正
- [ ] `ChromeStorageRewriteRuleRepository.ts` の `save` メソッド修正
- [ ] `ChromeStorageRewriteRuleRepository.ts` に `getAll` メソッド実装

### ステップ 4: マイグレーション対応
- [ ] 既存データ形式の検出・変換ロジック実装
- [ ] マイグレーション処理のテスト実装

### ステップ 5: 既存テストの修正
- [ ] ChromeStorageRewriteRuleRepository関連テストファイルの修正
- [ ] 新しいストレージ構造に対応したテストケース更新

### ステップ 6: 統合テスト
- [ ] 全てのユニットテストが通ることを確認
- [ ] 既存機能に影響がないことを確認

## 受け入れ条件
- [ ] ストレージ構造が `{ RewriteRules: { [rule.id]: rule } }` 形式になっていること
- [ ] RewriteRulesファーストコレクションオブジェクトが実装されていること
- [ ] IRewriteRuleRepository.getAll() メソッドが追加されていること
- [ ] ChromeStorageRewriteRuleRepository.save() が RewriteRules オブジェクト全体を保存すること
- [ ] 既存のルールデータが新形式に正しく移行されること
- [ ] 全てのユニットテストがパスすること

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
