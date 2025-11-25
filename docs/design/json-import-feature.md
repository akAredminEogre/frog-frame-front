# JSON インポート機能 基本設計書

## 1. 機能概要

### 1.1 目的
ユーザーが作成したRewriteRuleをJSON形式でインポートできる機能を提供し、以下を実現する：
- ルールのバックアップからの復元
- 異なるデバイス間でのルール共有
- ルールセットの受け取りと適用

### 1.2 機能範囲
- **インポート機能**: JSONファイルから複数のルールを一括インポート
- **バリデーション**: インポート時のデータ検証とエラーハンドリング

## 2. 要件定義

### 2.1 機能要件

#### FR-1: インポート機能
- **FR-1.1**: ユーザーはJSONファイルを選択してルールをインポートできる
- **FR-1.2**: インポートされたルールは既存ルールに追加される（重複許可）
- **FR-1.3**: インポート成功時、ルール一覧を再読み込みして最新状態を表示する
- **FR-1.4**: インポート実行後、成功/失敗メッセージを表示する

#### FR-2: データバリデーション
- **FR-2.1**: JSON構文の妥当性を検証する
- **FR-2.2**: 必須フィールドの存在を検証する
  - ルートレベル: `version`, `rules`
  - ルールレベル: `oldString`, `newString`, `urlPattern`, `isRegex`, `isActive`
- **FR-2.3**: 各フィールドの型を検証する
  - 文字列フィールド: `oldString`, `newString`, `urlPattern`
  - 真偽値フィールド: `isRegex`, `isActive`
- **FR-2.4**: バリデーションエラー時、具体的なエラー内容をユーザーに通知する

### 2.2 非機能要件

#### NFR-1: パフォーマンス
- **NFR-1.1**: インポート処理は100件のルールを3秒以内に完了する

#### NFR-2: ユーザビリティ
- **NFR-2.1**: ボタン配置は直感的で、操作手順が明確である
- **NFR-2.2**: エラーメッセージは日本語で分かりやすく表示する

#### NFR-3: 保守性
- **NFR-3.1**: Clean Architecture + DDDに準拠した設計とする
- **NFR-3.2**: 各層の責務を明確に分離する

## 3. アーキテクチャ設計

### 3.1 レイヤー構成

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (UI)             │
│  - RulesApp.tsx (インポートボタン)          │
│  - style.css (UIスタイル)                   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Application Layer                   │
│  - ImportRulesFromJsonUseCase               │
│  - ExportedRewriteRules (型定義)            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Domain Layer                      │
│  - RewriteRule (エンティティ)               │
│  - InvalidImportDataError                   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│       Infrastructure Layer                  │
│  - DexieRewriteRuleRepository               │
│  - DIContainer (tsyringe)                   │
└─────────────────────────────────────────────┘
```

### 3.2 責務分担

| レイヤー | 責務 |
|---------|------|
| **Presentation** | ユーザー操作の受付、ファイルアップロード、メッセージ表示 |
| **Application** | ビジネスロジックの調整、JSON変換、バリデーション |
| **Domain** | ルールエンティティの定義、ドメインエラー |
| **Infrastructure** | データ永続化、DI管理 |

## 4. データ構造設計

### 4.1 JSON形式定義

```typescript
interface ExportedRewriteRules {
  version: string;        // フォーマットバージョン（"1.0"）
  exportDate: string;     // エクスポート日時（ISO 8601形式）
  rules: ExportedRewriteRule[];
}

interface ExportedRewriteRule {
  oldString: string;      // 置換前テキスト/正規表現
  newString: string;      // 置換後テキスト
  urlPattern: string;     // 適用URLパターン
  isRegex: boolean;       // 正規表現フラグ
  isActive: boolean;      // 有効/無効フラグ
}
```

### 4.2 JSONサンプル

```json
{
  "version": "1.0",
  "exportDate": "2025-11-24T12:00:00.000Z",
  "rules": [
    {
      "oldString": "example",
      "newString": "sample",
      "urlPattern": "https://example.com",
      "isRegex": false,
      "isActive": true
    },
    {
      "oldString": "\\d{4}-\\d{13}",
      "newString": "<a href=\"https://example.com/$1\">$1</a>",
      "urlPattern": "https://example.com",
      "isRegex": true,
      "isActive": true
    }
  ]
}
```

### 4.3 ID設計
- **インポート時**: ID=0でRewriteRuleを生成し、Repository.createが自動採番

## 5. クラス設計

### 5.1 ImportRulesFromJsonUseCase

```typescript
@injectable()
class ImportRulesFromJsonUseCase {
  constructor(
    @inject('IRewriteRuleRepository')
    private readonly rewriteRuleRepository: IRewriteRuleRepository
  )

  // JSON文字列からルールをインポート
  async execute(jsonString: string): Promise<void>

  // JSONパースとバリデーション
  private parseAndValidate(jsonString: string): ExportedRewriteRules

  // 個別ルールのバリデーション
  private validateRule(rule: unknown, index: number): void
}
```

**責務:**
- JSON文字列のパースとバリデーション
- 各ルールのバリデーション（必須フィールド、型チェック）
- バリデーション済みルールをリポジトリに保存
- エラー時にInvalidImportDataErrorをthrow

**処理フロー:**
1. `parseAndValidate()` でJSONパースとバリデーション
   - JSON.parse実行（try-catch）
   - version, rulesフィールドの存在確認
   - rulesが配列であることを確認
   - 各ルールに対して `validateRule()` を実行
2. バリデーション成功後、各ルールをループ処理
   - ID=0でRewriteRuleインスタンスを生成
   - `rewriteRuleRepository.create()` で保存
3. 全ルール保存完了

**バリデーション詳細:**

| 検証項目 | 検証内容 | エラーメッセージ |
|---------|---------|----------------|
| JSON構文 | JSON.parse成功 | "Invalid JSON format" |
| ルートオブジェクト | typeofがobject、nullでない | "JSON must be an object" |
| versionフィールド | 存在確認 | "Missing required field: version" |
| rulesフィールド | 存在確認 | "Missing required field: rules" |
| rules型 | Array.isArray | "Field \"rules\" must be an array" |
| ルールオブジェクト | typeofがobject、nullでない | "Rule at index N must be an object" |
| oldString | 存在と型(string) | "Rule at index N: Missing required field \"oldString\"" / "Field \"oldString\" must be a string" |
| newString | 存在と型(string) | "Rule at index N: Missing required field \"newString\"" / "Field \"newString\" must be a string" |
| urlPattern | 存在と型(string) | "Rule at index N: Missing required field \"urlPattern\"" / "Field \"urlPattern\" must be a string" |
| isRegex | 存在と型(boolean) | "Rule at index N: Missing required field \"isRegex\"" / "Field \"isRegex\" must be a boolean" |
| isActive | 存在と型(boolean) | "Rule at index N: Missing required field \"isActive\"" / "Field \"isActive\" must be a boolean" |

### 5.2 InvalidImportDataError

```typescript
class InvalidImportDataError extends Error {
  constructor(message: string) {
    super(`Invalid import data: ${message}`)
    this.name = 'InvalidImportDataError'
  }
}
```

**責務:**
- インポートデータのバリデーションエラーを表現
- エラーメッセージに "Invalid import data: " プレフィックスを付与

## 6. UI設計

### 6.1 画面構成（Rules Page - インポート部分）

```
┌────────────────────────────────────────────┐
│      保存されたルール一覧                   │
├────────────────────────────────────────────┤
│  [エクスポート]  [インポート]              │
├────────────────────────────────────────────┤
│  ✓ ルールをインポートしました               │ ← 成功メッセージ
│  または                                    │
│  ✗ インポートエラー: Invalid JSON format  │ ← エラーメッセージ
├────────────────────────────────────────────┤
│  (ルール一覧テーブル)                      │
└────────────────────────────────────────────┘
```

### 6.2 UI要素

| 要素 | 種類 | 説明 |
|-----|------|-----|
| インポートボタン | button.import-button | JSONファイル選択ダイアログを開く |
| ファイル入力 | input[type=file] | 非表示、accept=".json" |
| 成功メッセージ | div.success-message | 緑背景、インポート成功時表示 |
| エラーメッセージ | div.error-message | 赤背景、エラー発生時表示 |

### 6.3 状態管理

```typescript
const [successMessage, setSuccessMessage] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);
const fileInputRef = React.useRef<HTMLInputElement>(null);
```

### 6.4 イベントハンドラ

#### handleImportClick()

```typescript
const handleImportClick = () => {
  setError(null);
  setSuccessMessage(null);
  if (fileInputRef.current) {
    fileInputRef.current.click();
  }
};
```

**処理ステップ:**
1. エラー/成功メッセージをクリア
2. ファイル入力要素をプログラマティックにクリック

#### handleFileChange(event)

```typescript
const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const fileContent = await file.text();
    const importUseCase = container.resolve(ImportRulesFromJsonUseCase);
    await importUseCase.execute(fileContent);

    const repository = container.resolve<IRewriteRuleRepository>('IRewriteRuleRepository');
    const getAllRulesUseCase = new GetAllRewriteRulesUseCase(repository);
    const loadedRules = await getAllRulesUseCase.execute();
    setRules(loadedRules);

    setSuccessMessage('ルールをインポートしました');
  } catch (err) {
    if (err instanceof InvalidImportDataError) {
      setError('インポートエラー: ' + err.message);
    } else {
      setError('インポートに失敗しました: ' + (err instanceof Error ? err.message : String(err)));
    }
  } finally {
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
};
```

**処理ステップ:**
1. ファイルが選択されているか確認
2. エラー/成功メッセージをクリア、ローディング開始
3. file.text()でファイル内容を読み込み
4. ImportRulesFromJsonUseCaseを実行
5. ルール一覧を再読み込み（GetAllRewriteRulesUseCase）
6. 成功メッセージ表示
7. エラー時、InvalidImportDataErrorは専用メッセージ、その他は汎用メッセージ
8. finally: ローディング終了、ファイル入力をクリア

## 7. シーケンス設計

### 7.1 インポート処理（正常系）

```
User → RulesApp: インポートボタンクリック
RulesApp → Browser: ファイル選択ダイアログ表示
User → Browser: ファイル選択
Browser → RulesApp: ファイルオブジェクト
RulesApp → File: text()
File → RulesApp: JSON文字列
RulesApp → ImportRulesFromJsonUseCase: execute(jsonString)
ImportRulesFromJsonUseCase → ImportRulesFromJsonUseCase: parseAndValidate()
ImportRulesFromJsonUseCase → ImportRulesFromJsonUseCase: validateRule() (各ルール)
ImportRulesFromJsonUseCase → IRewriteRuleRepository: create(rule) (各ルール)
IRewriteRuleRepository → ImportRulesFromJsonUseCase: void
ImportRulesFromJsonUseCase → RulesApp: void
RulesApp → GetAllRewriteRulesUseCase: execute()
GetAllRewriteRulesUseCase → RulesApp: RewriteRule[]
RulesApp → User: ルール一覧更新、成功メッセージ表示
```

### 7.2 インポート処理（異常系）

```
User → RulesApp: インポートボタンクリック、ファイル選択
RulesApp → ImportRulesFromJsonUseCase: execute(jsonString)
ImportRulesFromJsonUseCase → ImportRulesFromJsonUseCase: parseAndValidate()
ImportRulesFromJsonUseCase → ImportRulesFromJsonUseCase: バリデーション失敗
ImportRulesFromJsonUseCase -x RulesApp: throw InvalidImportDataError
RulesApp → User: エラーメッセージ表示
```

## 8. エラーハンドリング設計

### 8.1 エラー分類

| エラー種別 | 発生箇所 | ハンドリング方法 |
|-----------|---------|----------------|
| JSON構文エラー | ImportRulesFromJsonUseCase.parseAndValidate() | InvalidImportDataError("Invalid JSON format") |
| 必須フィールド欠如 | ImportRulesFromJsonUseCase.parseAndValidate() | InvalidImportDataError("Missing required field: XXX") |
| 型不正 | ImportRulesFromJsonUseCase.validateRule() | InvalidImportDataError("Field XXX must be a YYY") |
| リポジトリエラー | IRewriteRuleRepository.create() | 上位にthrow（汎用エラーメッセージ） |
| ファイル読み込みエラー | file.text() | 上位にthrow（汎用エラーメッセージ） |

### 8.2 エラーメッセージ表示ルール

```typescript
try {
  // インポート処理
} catch (err) {
  if (err instanceof InvalidImportDataError) {
    // バリデーションエラー: 詳細メッセージ表示
    setError('インポートエラー: ' + err.message);
  } else {
    // その他のエラー: 汎用メッセージ表示
    setError('インポートに失敗しました: ' + (err instanceof Error ? err.message : String(err)));
  }
}
```

## 9. テスト設計

### 9.1 テスト戦略

- **単体テスト**: Vitest
- **テストカバレッジ**: ImportRulesFromJsonUseCaseの全メソッド
- **モック**: IRewriteRuleRepositoryをモック化

### 9.2 テストケース

#### 正常系

| テストケース | 入力 | 期待結果 |
|-------------|------|---------|
| 単一ルールインポート | 1件のルール | repository.create 1回呼び出し |
| 複数ルールインポート | 3件のルール | repository.create 3回呼び出し |
| 正規表現ルール | isRegex=true | 正しくRewriteRule生成 |
| 無効ルール | isActive=false | isActive=falseでRewriteRule生成 |

**検証項目:**
- repository.createの呼び出し回数
- 引数のRewriteRuleインスタンスのフィールド値
- ID=0で生成されること

#### 異常系（JSON構造エラー）

| テストケース | 入力 | 期待エラー |
|-------------|------|-----------|
| 不正なJSON | `"invalid json {"` | InvalidImportDataError("Invalid JSON format") |
| versionフィールド欠如 | version未定義 | InvalidImportDataError("Missing required field: version") |
| rulesフィールド欠如 | rules未定義 | InvalidImportDataError("Missing required field: rules") |
| rules型不正 | rules="not array" | InvalidImportDataError("Field \"rules\" must be an array") |
| ルートがオブジェクトでない | `"just a string"` | InvalidImportDataError("JSON must be an object") |
| ルートがnull | `null` | InvalidImportDataError("JSON must be an object") |

#### 異常系（ルールフィールド欠如）

| テストケース | 入力 | 期待エラー |
|-------------|------|-----------|
| oldString欠如 | oldString未定義 | InvalidImportDataError("Rule at index 0: Missing required field \"oldString\"") |
| newString欠如 | newString未定義 | InvalidImportDataError("Rule at index 0: Missing required field \"newString\"") |
| urlPattern欠如 | urlPattern未定義 | InvalidImportDataError("Rule at index 0: Missing required field \"urlPattern\"") |
| isRegex欠如 | isRegex未定義 | InvalidImportDataError("Rule at index 0: Missing required field \"isRegex\"") |
| isActive欠如 | isActive未定義 | InvalidImportDataError("Rule at index 0: Missing required field \"isActive\"") |
| ルールがオブジェクトでない | "not an object" | InvalidImportDataError("Rule at index 0 must be an object") |
| ルールがnull | null | InvalidImportDataError("Rule at index 0 must be an object") |

#### 異常系（フィールド型不正）

| テストケース | 入力 | 期待エラー |
|-------------|------|-----------|
| oldString型不正 | oldString=123 | InvalidImportDataError("Rule at index 0: Field \"oldString\" must be a string") |
| newString型不正 | newString=456 | InvalidImportDataError("Rule at index 0: Field \"newString\" must be a string") |
| urlPattern型不正 | urlPattern=789 | InvalidImportDataError("Rule at index 0: Field \"urlPattern\" must be a string") |
| isRegex型不正 | isRegex="true" | InvalidImportDataError("Rule at index 0: Field \"isRegex\" must be a boolean") |
| isActive型不正 | isActive="true" | InvalidImportDataError("Rule at index 0: Field \"isActive\" must be a boolean") |

**検証項目:**
- InvalidImportDataErrorがthrowされること
- エラーメッセージが期待値と一致
- repository.createが呼び出されないこと

### 9.3 テストファイル構成

```
tests/unit/application/usecases/rule/
└── ImportRulesFromJsonUseCase/
    └── execute/
        ├── normal-cases.test.ts (4テスト)
        └── Abend/
            ├── error-cases.test.ts (6テスト)
            ├── missing-fields.test.ts (7テスト)
            └── invalid-types.test.ts (5テスト)
```

**テスト総数**: 22テストケース

## 10. 依存関係管理

### 10.1 DIコンテナ登録

```typescript
// src/infrastructure/di/container.ts

container.register(ImportRulesFromJsonUseCase, {
  useClass: ImportRulesFromJsonUseCase
});
```

### 10.2 依存解決

```typescript
// UI層での使用例
const importUseCase = container.resolve(ImportRulesFromJsonUseCase);
await importUseCase.execute(jsonString);
```

## 11. マイグレーション・互換性

### 11.1 バージョン管理
- **現在バージョン**: "1.0"
- **将来の拡張**: versionフィールドでフォーマット変更に対応

### 11.2 後方互換性
- バージョン1.0のみサポート
- 将来のバージョンアップ時、ImportRulesFromJsonUseCaseでバージョン分岐

## 12. セキュリティ考慮事項

### 12.1 入力検証
- JSON.parseのエラーハンドリング
- 全フィールドの型検証
- 不正なJavaScriptコード実行を防止（evalは使用しない）

### 12.2 データサニタイゼーション
- インポートされたデータはRewriteRuleエンティティ経由でのみ保存
- ドメインレイヤーでのバリデーションを信頼

## 13. パフォーマンス最適化

### 13.1 インポート処理
- ルールのバリデーションは逐次実行（最初のエラーで中断）
- repository.createは個別に実行（トランザクション非対応のため）
- 非同期処理でUIブロッキングを防止

## 14. 今後の拡張性

### 14.1 想定される拡張
- **マージインポート**: 既存ルールとの重複チェック、スキップ/上書きオプション
- **バッチインポート**: 大量ルールの効率的な一括登録
- **進捗表示**: 大量ルールインポート時のプログレスバー

### 14.2 アーキテクチャ上の拡張ポイント
- Use Caseにオプションパラメータ追加（例: マージモード）
- バリデーションルールの抽象化（Strategy パターン）

## 15. 実装完了チェックリスト

- [x] ImportRulesFromJsonUseCase実装
- [x] InvalidImportDataError実装
- [x] ExportedRewriteRules型定義
- [x] DIコンテナ登録
- [x] RulesApp UIコンポーネント更新（インポートボタン）
- [x] CSSスタイル追加
- [x] 単体テスト実装（22テストケース）
- [x] TypeScriptコンパイル確認
- [x] ESLint確認
- [x] 全テスト成功確認

## 関連ドキュメント

- [JSON エクスポート機能 基本設計書](./json-export-feature.md)

---

**文書バージョン**: 1.0
**作成日**: 2025-11-24
**最終更新**: 2025-11-24
