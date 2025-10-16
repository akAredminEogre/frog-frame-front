# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=05
実装が完了したらPROGRESS-05-02.mdを追記してコードレビューを依頼してください
## スクラム-05(02回目) の進捗

### 実施内容

#### 1. レビューコメントへの対応: add()とupdate()メソッドの統合

**レビューコメント内容:**
> add(rule: RewriteRule)とupdate(rule: RewriteRule)がありますが、中身は同一のロジックです。どちらかに統合を検討してください
> 基準としては
> - DDD、CleanArchitecture、SOLIDの原則、オブジェクト指向、SRPの基準に従っているかどうか
> - 拡張、保守、変更、テストに強いかどうか

**分析結果:**
- `add()`と`update()`の実装が完全に同一
- どちらも内部的には`Map.set()`で「追加または上書き」の動作
- リポジトリの`save()`メソッドで`add()`を使用、`update()`メソッドで`update()`を使用
- テストに「同じIDのルールを追加すると上書きされる」というケースが存在

**設計判断: set()メソッドに統合**

理由:
1. **DRY原則**: 同一ロジックの重複を排除
2. **単一責任原則(SRP)**: 「要素を設定する」という単一の責任に集約
3. **拡張性**: 将来的に追加のみ/更新のみのメソッドを別途実装する余地を残す
4. **明確性**: Mapのような動作をする場合、`set`が最も明確な命名
5. **保守性**: 1つのメソッドに集約することで、変更箇所が減り保守が容易に

#### 2. 実装の修正

**RewriteRules.ts:**
- `add()`と`update()`メソッドを削除
- `set()`メソッドを新規追加
  ```typescript
  /**
   * ルールを設定した新しいRewriteRulesオブジェクトを返す（Immutable）
   * 既存のIDがある場合は上書き、ない場合は新規追加
   * @param rule 設定するRewriteRule
   * @returns ルールが設定されたRewriteRulesオブジェクト
   */
  set(rule: RewriteRule): RewriteRules {
    const newRules = new Map(this.rules);
    newRules.set(rule.id, rule);
    return new RewriteRules(Object.fromEntries(newRules));
  }
  ```

**ChromeStorageRewriteRuleRepository.ts:**
- `save()`メソッド: `existingRules.add(rule)` → `existingRules.set(rule)`に変更
- `update()`メソッド: `existingRules.update(rule)` → `existingRules.set(rule)`に変更

#### 3. テストコードの修正

**テストファイルの更新:**
- `tests/unit/domain/value-objects/RewriteRules/add/normal-cases.test.ts` を `set/normal-cases.test.ts` に移動
- テストケースを更新:
  - `describe('RewriteRules.add - 正常系')` → `describe('RewriteRules.set - 正常系')`
  - テストケース名を「追加」から「設定」に変更
  - メソッド呼び出しを`.add()`から`.set()`に変更

#### 4. テスト実行結果

**RewriteRulesのテスト:**
```
Test Files  6 passed (6)
      Tests  13 passed (13)
```

**ChromeStorageRewriteRuleRepositoryのテスト:**
```
Test Files  5 passed (5)
      Tests  14 passed (14)
```

全てのテストが成功し、リグレッションが発生していないことを確認しました。

### 修正したファイル

#### 実装ファイル
- `host-frontend-root/frontend-src-root/src/domain/value-objects/RewriteRules.ts`
- `host-frontend-root/frontend-src-root/src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository.ts`

#### テストファイル
- `host-frontend-root/frontend-src-root/tests/unit/domain/value-objects/RewriteRules/add/normal-cases.test.ts` → `set/normal-cases.test.ts`に移動・更新

### 次回以降のスクラムに先送りする課題

特になし

### 本issueの対象外とする課題

特になし

### スクラム-05(02回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド .clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド workflow:daily-scrum-pass-review-scrum -->
修正については問題ありません。ただ
frog-frame-front/host-frontend-root/frontend-src-root/src/infrastructure/persistance/storage/ChromeStorageRewriteRuleRepository.ts
についてもsave,updateメソッドが同一のロジックです。setに統合を検討してください
