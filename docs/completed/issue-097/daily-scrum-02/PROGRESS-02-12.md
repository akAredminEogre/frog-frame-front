# 進捗

このファイルは作業の記録を残すためのものです。追記のみ行い、内容の修正や削除は行わないでください。

kk=02
実装が完了したらPROGRESS-kk.mdを追記してコードレビューを依頼してください
## スクラム-02(12回目) の進捗

PROGRESS-02-11.md のコードレビューにて、LaravelやDjangoのマイグレーションに相当する仕組みについてご質問いただきました。Dexie.jsのバージョニング・マイグレーション機能について調査し、実装例を含めて説明いたします。

### 対応内容

#### Dexie.jsのマイグレーション機能

Dexie.jsには、LaravelやDjangoのマイグレーションシステムに相当する**データベースバージョニング機能**が組み込まれています。

#### 基本的な考え方

**1. バージョン管理の方式**

Dexie.jsは宣言的なスキーマ管理を採用しており、以下の特徴があります：

- **バージョン番号によるスキーマ管理**: `.version(n)` でバージョンを定義
- **自動的なスキーマ適用**: データベースが存在しない場合は最新バージョンで作成、既存の場合は必要なバージョンアップを自動実行
- **宣言的な記述**: 「データベースを作成すべきか」をチェックする必要なし

**2. バージョンアップのルール（Dexie 3.0以降）**

- **スキーマ変更のみの場合**: 古いバージョン定義を残す必要なし。スキーマを編集してバージョン番号を上げるだけ
- **データ移行が必要な場合**: 古いバージョン定義を残し、新しいバージョンに`.upgrade()`関数を追加

#### 実装例

現在のプロジェクトの `DexieDatabase.ts` は以下のようになっています:

```typescript
export class DexieDatabase extends Dexie {
  rewriteRules!: Table<RewriteRuleSchema, number>;

  constructor() {
    super('FrogFrameFrontDatabase');

    // バージョン1: 初期スキーマ定義
    this.version(1).stores({
      rewriteRules: '++id, urlPattern'
    });
  }
}
```

**ケース1: スキーマ変更のみ（データ移行不要）**

例: インデックスを追加する場合

```typescript
export class DexieDatabase extends Dexie {
  rewriteRules!: Table<RewriteRuleSchema, number>;

  constructor() {
    super('FrogFrameFrontDatabase');

    // バージョン2: urlPatternに加えてisRegexにもインデックスを追加
    this.version(2).stores({
      rewriteRules: '++id, urlPattern, isRegex'
    });
  }
}
```

この場合、バージョン1の定義は削除してOKです（Dexie 3.0以降）。

**ケース2: テーブル追加**

例: 新しいテーブルを追加する場合

```typescript
export class DexieDatabase extends Dexie {
  rewriteRules!: Table<RewriteRuleSchema, number>;
  settings!: Table<SettingsSchema, string>;

  constructor() {
    super('FrogFrameFrontDatabase');

    // バージョン2: settingsテーブルを追加
    this.version(2).stores({
      rewriteRules: '++id, urlPattern',
      settings: 'key'  // 新しいテーブル
    });
  }
}
```

**ケース3: データ移行が必要な場合**

例: スキーマ構造を変更し、既存データの変換が必要な場合

```typescript
export interface RewriteRuleSchemaV2 {
  id?: number;
  oldString: string;
  newString: string;
  urlPattern: string;
  isRegex: boolean;
  enabled: boolean;  // 新しいフィールド
}

export class DexieDatabase extends Dexie {
  rewriteRules!: Table<RewriteRuleSchemaV2, number>;

  constructor() {
    super('FrogFrameFrontDatabase');

    // バージョン1: 初期スキーマ（履歴として保持）
    this.version(1).stores({
      rewriteRules: '++id, urlPattern'
    });

    // バージョン2: enabledフィールドを追加し、既存データにデフォルト値をセット
    this.version(2).stores({
      rewriteRules: '++id, urlPattern, enabled'
    }).upgrade(trans => {
      // 既存の全レコードにenabled=trueをセット
      return trans.table('rewriteRules').toCollection().modify(rule => {
        rule.enabled = true;
      });
    });
  }
}
```

**ケース4: フィールド名の変更とデータ変換**

例: oldString → pattern に名前を変更し、データを変換

```typescript
export class DexieDatabase extends Dexie {
  rewriteRules!: Table<RewriteRuleSchemaV3, number>;

  constructor() {
    super('FrogFrameFrontDatabase');

    // バージョン1: 初期スキーマ
    this.version(1).stores({
      rewriteRules: '++id, urlPattern'
    });

    // バージョン2: oldString → pattern に名前変更
    this.version(2).stores({
      rewriteRules: '++id, urlPattern'
    }).upgrade(trans => {
      return trans.table('rewriteRules').toCollection().modify(rule => {
        // フィールド名を変更
        rule.pattern = rule.oldString;
        delete rule.oldString;
      });
    });
  }
}
```

**ケース5: 新しいテーブルに初期データを投入**

```typescript
export class DexieDatabase extends Dexie {
  rewriteRules!: Table<RewriteRuleSchema, number>;
  categories!: Table<CategorySchema, number>;

  constructor() {
    super('FrogFrameFrontDatabase');

    // バージョン1
    this.version(1).stores({
      rewriteRules: '++id, urlPattern'
    });

    // バージョン2: categoriesテーブルを追加し、初期データを投入
    this.version(2).stores({
      rewriteRules: '++id, urlPattern',
      categories: '++id, name'
    }).upgrade(trans => {
      // 初期カテゴリを作成
      return trans.table('categories').bulkAdd([
        { name: 'General' },
        { name: 'Work' },
        { name: 'Personal' }
      ]);
    });
  }
}
```

#### LaravelやDjangoとの違い

**Laravel/Djangoのマイグレーション:**
- マイグレーションファイルを個別に作成
- `php artisan migrate` や `python manage.py migrate` で実行
- ロールバック機能あり

**Dexie.jsのマイグレーション:**
- `DexieDatabase` クラス内に全バージョンを定義
- ブラウザでアプリを開いた時に自動実行
- ロールバック機能なし（バージョンは常に上がる一方）

#### ベストプラクティス

1. **スキーマ変更時は必ずバージョン番号を上げる**
2. **データ移行が不要な場合は、古いバージョン定義を削除してOK**（Dexie 3.0以降）
3. **データ移行が必要な場合は、古いバージョンを保持し `.upgrade()` を追加**
4. **複雑な移行ロジックは、テストコードで検証する**
5. **本番環境にリリース済みのバージョンは削除しない**（ユーザーがまだ古いバージョンを使っている可能性）

#### 参考資料

- [Dexie.js - Database Versioning](https://dexie.org/docs/Dexie/Dexie.version())
- [Dexie.js - Version.upgrade()](https://dexie.org/docs/Version/Version.upgrade())
- [Dexie.js - Understanding the basics](https://dexie.org/docs/Tutorial/Understanding-the-basics)

### 修正したファイル

今回は説明のみで、実装の変更はありません。

### 次回以降のスクラムに先送りする課題

なし

### 本issueの対象外とする課題

なし

### スクラム-02(12回目) のレビューコメント

<!-- ここはユーザが書くので空欄にしておいてください。 -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/02-daily-scrum-starts/workflow:see-and-commit-review-comment-then-code-again.md -->
<!-- ユーザーが使うコマンド frog-frame-front/.clinerules/02-workflow-automation/03-daily-scrum-finishes/workflow:daily-scrum-pass-review.md -->
createの単体テストの異常系で、既存のidを指定した場合にエラーになることを確認するテストケースを追加してください
---
