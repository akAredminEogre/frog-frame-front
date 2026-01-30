# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=02
実装が完了したらPROGRESS-kk.mdを追記してコードレビューを依頼してください
## スクラム-02(07回目) の進捗

PROGRESS-02-06.md のコードレビューフィードバックに対応しました。

### 対応内容

Clean ArchitectureとDDDの観点から、Infrastructure層がDomain層のエンティティを返す設計について説明を記録します。

#### レビューコメント

> Clean ArchitectureやDDDの観点からは、データ永続層から取り出した値は、まずアプリケーション層に返されることになりますが、その時スキーマエンティティで渡すのと、ドメインエンティティで渡すのと、どちらが適切でしょうか？今回のようにドメインエンティティで返す場合、インフラ層がドメイン層に依存することになりますが、その点についてもコメントをお願いします。

#### 回答: 現在の実装（ドメインエンティティで返す）が適切

##### 1. Clean Architectureにおける依存関係ルール

**許容される依存の方向:**
```
Domain (最内層) ← Application ← Infrastructure (最外層)
```

Infrastructure層がDomain層に依存することは、**内側への依存であり、Clean Architectureのルールに従っています**。

現在の実装:
```typescript
// Infrastructure層
import { RewriteRule } from 'src/domain/entities/RewriteRule/RewriteRule';
import { RewriteRules } from 'src/domain/value-objects/RewriteRules';
```

この依存関係は**完全に適切**です。

##### 2. Repositoryパターンの責務（DDDの観点）

Eric EvansのDomain-Driven Designによれば、Repositoryの責務は:

1. **ドメインオブジェクトの永続化と復元**
2. **永続化メカニズムの実装詳細を隠蔽**
3. **ドメインオブジェクトのコレクションのように振る舞う**

つまり、**Repositoryはドメインエンティティで返すべき**です。

##### 3. スキーマエンティティで返す場合の問題点

もしスキーマエンティティ（`RewriteRuleSchema`）で返すと:

```typescript
// ❌ 良くない設計
interface IRewriteRuleRepository {
  getAll(): Promise<RewriteRuleSchema[]>; // スキーマを返す
}

// Application層で変換が必要に
class SomeUseCase {
  async execute() {
    const schemas = await this.repository.getAll();
    // Application層がInfrastructure層の詳細を知る必要がある
    const rules = schemas.map(s => this.convertToRule(s));
  }
}
```

以下の問題があります:

1. **Infrastructure層の実装詳細がApplication層に漏れる**
   - データベーススキーマの変更がApplication層に影響
   - テストでもスキーマを意識する必要がある

2. **Repositoryの抽象化が破綻**
   - Repositoryインターフェースが永続化メカニズムに依存
   - ChromeStorage実装とIndexedDB実装で異なるスキーマを返す可能性

3. **変換ロジックの重複**
   - 各UseCaseで同じ変換処理を書く必要がある

##### 4. 現在の設計が優れている理由

**依存性逆転の原則（DIP）を守っている:**
```typescript
// Application層にインターフェースを配置
export interface IRewriteRuleRepository {
  set(rule: RewriteRule): Promise<void>;
  getAll(): Promise<RewriteRules>;
  getById(id: string): Promise<RewriteRule>;
}

// Infrastructure層が実装
export class DexieRewriteRuleRepository implements IRewriteRuleRepository {
  // ...
}
```

- Application層はインターフェースに依存
- Infrastructure層がインターフェースを実装
- Application層はInfrastructure層の実装詳細を知らない

**永続化メカニズムの透過性:**
```typescript
// UseCaseはRepositoryの実装を知らない
class LoadRewriteRuleForEditUseCase {
  async execute(ruleId: string): Promise<RewriteRule> {
    // ChromeStorageでもIndexedDBでも同じコード
    return await this.rewriteRuleRepository.getById(ruleId);
  }
}
```

- スキーマの詳細が完全に隠蔽されている
- データベースを変更してもUseCaseに影響なし

**変換ロジックのカプセル化:**
```typescript
// Infrastructure層内で変換処理を完結
private convertSchemaToRule(schema: RewriteRuleSchema): RewriteRule {
  return new RewriteRule(
    schema.id,
    schema.oldString,
    schema.newString,
    schema.urlPattern,
    schema.isRegex
  );
}
```

- 変換ロジックがRepository内に閉じている
- Application層は変換を意識しない

##### 5. 結論

Infrastructure層がDomain層のエンティティを返すことは:

- ✅ Clean Architectureの依存関係ルールに準拠（内側への依存は許容）
- ✅ Repositoryパターンの責務に合致（ドメインオブジェクトの復元）
- ✅ DDDの原則に従っている（永続化の詳細を隠蔽）
- ✅ テスタビリティが高い（Application層がスキーマを知らない）
- ✅ 保守性が高い（変更の影響範囲が限定的）

スキーマエンティティで返すアプローチは、Infrastructure層の実装詳細をApplication層に漏らすことになり、Clean ArchitectureとDDDの原則に反します。

### 修正したファイル

なし（設計の説明のみ）

### 次回以降のスクラムに先送りする課題

なし

### 本issueの対象外とする課題

なし

### スクラム-02(07回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow:daily-scrum-pass-review.md -->
ありがとうございます。完成に近づいてきました。
最後にprimary keyについて確認させてください。
今回IndexedDBを導入することによって、primary keyの管理をDB側に任せることが可能になったと思います。
現在の実装では、application層でIDを生成してからDBに保存していますが、DB側で自動採番する形に変更したいです。
現状の実装で、それは可能でしょうか。
またprimary keyの型については、string型とnumber型のどちらが適切でしょうか？
---
