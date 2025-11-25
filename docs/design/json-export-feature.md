# JSON エクスポート機能 基本設計書

## 1. 機能概要

### 1.1 目的
ユーザーが作成したRewriteRuleをJSON形式でエクスポートできる機能を提供し、以下を実現する：
- ルールのバックアップ
- 異なるデバイス間でのルール共有準備
- ルールセットの配布

### 1.2 機能範囲
- **エクスポート機能**: 保存済みの全ルールをJSON形式でダウンロード

## 2. 要件定義

### 2.1 機能要件

#### FR-1: エクスポート機能
- **FR-1.1**: ユーザーはルール一覧ページから全ルールをエクスポートできる
- **FR-1.2**: エクスポートされるファイル名は `rewrite-rules-{timestamp}.json` 形式とする
- **FR-1.3**: エクスポートデータにはIDフィールドを含めない（インポート時に自動採番）
- **FR-1.4**: エクスポート実行後、成功メッセージを表示する

### 2.2 非機能要件

#### NFR-1: パフォーマンス
- **NFR-1.1**: エクスポート処理は1000件のルールを1秒以内に完了する

#### NFR-2: ユーザビリティ
- **NFR-2.1**: ボタン配置は直感的で、操作手順が明確である
- **NFR-2.2**: 成功メッセージは日本語で分かりやすく表示する

#### NFR-3: 保守性
- **NFR-3.1**: Clean Architecture + DDDに準拠した設計とする
- **NFR-3.2**: 各層の責務を明確に分離する

## 3. アーキテクチャ設計

### 3.1 レイヤー構成

```
┌─────────────────────────────────────────────┐
│         Presentation Layer (UI)             │
│  - RulesApp.tsx (エクスポートボタン)        │
│  - style.css (UIスタイル)                   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Application Layer                   │
│  - ExportRulesToJsonUseCase                 │
│  - ExportedRewriteRules (型定義)            │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Domain Layer                      │
│  - RewriteRule (エンティティ)               │
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
| **Presentation** | ユーザー操作の受付、ファイルダウンロード、メッセージ表示 |
| **Application** | ビジネスロジックの調整、JSON変換 |
| **Domain** | ルールエンティティの定義 |
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
- **エクスポート時**: IDフィールドを除外（インポート先で再採番されるため）

## 5. クラス設計

### 5.1 ExportRulesToJsonUseCase

```typescript
@injectable()
class ExportRulesToJsonUseCase {
  constructor(
    @inject('IRewriteRuleRepository')
    private readonly rewriteRuleRepository: IRewriteRuleRepository
  )

  // 全ルールをJSON文字列に変換してエクスポート
  async execute(): Promise<string>
}
```

**責務:**
- リポジトリから全ルールを取得
- IDフィールドを除外してExportedRewriteRule形式に変換
- バージョン、エクスポート日時を付与
- JSON文字列として返却（整形済み、インデント2スペース）

**処理フロー:**
1. `rewriteRuleRepository.getAll()` でルール取得
2. 各ルールからIDを除外し、ExportedRewriteRule配列を生成
3. ExportedRewriteRules構造を構築（version: "1.0", exportDate, rules）
4. `JSON.stringify(data, null, 2)` で整形済みJSON文字列を生成
5. JSON文字列を返却

### 5.2 ExportedRewriteRules型定義

```typescript
// src/application/types/ExportedRewriteRules.ts

export interface ExportedRewriteRule {
  oldString: string;
  newString: string;
  urlPattern: string;
  isRegex: boolean;
  isActive: boolean;
}

export interface ExportedRewriteRules {
  version: string;
  exportDate: string;
  rules: ExportedRewriteRule[];
}
```

## 6. UI設計

### 6.1 画面構成（Rules Page - エクスポート部分）

```
┌────────────────────────────────────────────┐
│      保存されたルール一覧                   │
├────────────────────────────────────────────┤
│  [エクスポート]  [インポート]              │
├────────────────────────────────────────────┤
│  ✓ ルールをエクスポートしました             │ ← 成功メッセージ
├────────────────────────────────────────────┤
│  (ルール一覧テーブル)                      │
└────────────────────────────────────────────┘
```

### 6.2 UI要素

| 要素 | 種類 | 説明 |
|-----|------|-----|
| エクスポートボタン | button.export-button | 全ルールをJSON形式でダウンロード |
| 成功メッセージ | div.success-message | 緑背景、エクスポート成功時表示 |
| エラーメッセージ | div.error-message | 赤背景、エラー発生時表示 |

### 6.3 状態管理

```typescript
const [successMessage, setSuccessMessage] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);
```

### 6.4 イベントハンドラ

#### handleExport()

```typescript
const handleExport = async () => {
  try {
    setError(null);
    setSuccessMessage(null);

    // Use Caseを実行
    const exportUseCase = container.resolve(ExportRulesToJsonUseCase);
    const jsonString = await exportUseCase.execute();

    // Blobを作成してダウンロード
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    link.href = url;
    link.download = `rewrite-rules-${timestamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setSuccessMessage('ルールをエクスポートしました');
  } catch (err) {
    setError('エクスポートに失敗しました: ' + (err instanceof Error ? err.message : String(err)));
  }
};
```

**処理ステップ:**
1. エラー/成功メッセージをクリア
2. ExportRulesToJsonUseCaseを実行してJSON文字列取得
3. Blobオブジェクト作成（type: application/json）
4. URLオブジェクト作成、ダウンロードリンク生成
5. ファイル名設定: `rewrite-rules-${timestamp}.json`
6. リンククリックでダウンロード実行
7. クリーンアップ（link削除、URL解放）
8. 成功メッセージ表示

## 7. シーケンス設計

### 7.1 エクスポート処理

```
User → RulesApp: エクスポートボタンクリック
RulesApp → ExportRulesToJsonUseCase: execute()
ExportRulesToJsonUseCase → IRewriteRuleRepository: getAll()
IRewriteRuleRepository → ExportRulesToJsonUseCase: RewriteRules
ExportRulesToJsonUseCase → ExportRulesToJsonUseCase: ルール変換（ID除外）
ExportRulesToJsonUseCase → ExportRulesToJsonUseCase: JSON文字列生成
ExportRulesToJsonUseCase → RulesApp: JSON文字列
RulesApp → Browser: Blob作成、ダウンロード実行
RulesApp → User: 成功メッセージ表示
```

## 8. エラーハンドリング設計

### 8.1 エラー分類

| エラー種別 | 発生箇所 | ハンドリング方法 |
|-----------|---------|----------------|
| リポジトリエラー | IRewriteRuleRepository.getAll() | 上位にthrow（汎用エラーメッセージ） |
| JSON生成エラー | JSON.stringify() | 上位にthrow（汎用エラーメッセージ） |

### 8.2 エラーメッセージ表示

```typescript
try {
  // エクスポート処理
} catch (err) {
  setError('エクスポートに失敗しました: ' + (err instanceof Error ? err.message : String(err)));
}
```

## 9. テスト設計

### 9.1 テスト戦略

- **単体テスト**: Vitest
- **テストカバレッジ**: ExportRulesToJsonUseCase.execute()メソッド
- **モック**: IRewriteRuleRepositoryをモック化

### 9.2 テストケース

| テストケース | 入力 | 期待結果 |
|-------------|------|---------|
| 空のルールリスト | rules=[] | version="1.0", exportDate存在, rules=[] |
| 単一ルール | rules=[1件] | 正しくJSON変換、IDなし |
| 複数ルール | rules=[3件] | 全ルールがJSON配列に含まれる |
| 正規表現ルール | isRegex=true | isRegex=trueで出力 |
| 無効ルール | isActive=false | isActive=falseで出力 |

**検証項目:**
- JSON.parseで再パース可能
- versionが"1.0"
- exportDateがISO 8601形式
- rulesが配列
- 各ルールにidフィールドが含まれない
- 各フィールドが元のルールと一致

### 9.3 テストファイル構成

```
tests/unit/application/usecases/rule/
└── ExportRulesToJsonUseCase/
    └── execute/
        └── normal-cases.test.ts (5テスト)
```

## 10. 依存関係管理

### 10.1 DIコンテナ登録

```typescript
// src/infrastructure/di/container.ts

container.register(ExportRulesToJsonUseCase, {
  useClass: ExportRulesToJsonUseCase
});
```

### 10.2 依存解決

```typescript
// UI層での使用例
const exportUseCase = container.resolve(ExportRulesToJsonUseCase);
const jsonString = await exportUseCase.execute();
```

## 11. マイグレーション・互換性

### 11.1 バージョン管理
- **現在バージョン**: "1.0"
- **将来の拡張**: versionフィールドでフォーマット変更に対応

## 12. セキュリティ考慮事項

### 12.1 データ出力
- JSON.stringifyは安全（JavaScriptコードの実行なし）
- ユーザーがダウンロードしたファイルは完全にローカル

## 13. パフォーマンス最適化

### 13.1 エクスポート処理
- ルール数が多い場合でもブロッキングしない（非同期処理）
- JSON.stringifyは十分高速（1000件で1秒以内）
- メモリ効率：Blob APIを使用して大きなJSONも効率的に処理

## 14. 今後の拡張性

### 14.1 想定される拡張
- **選択的エクスポート**: 特定ルールのみエクスポート
- **フォーマット変更**: version 2.0でメタデータ追加
- **圧縮**: 大量ルール時のファイルサイズ削減

### 14.2 アーキテクチャ上の拡張ポイント
- Use Caseにオプションパラメータ追加（例: 選択ルールのID配列）
- ExportedRewriteRules型の拡張（後方互換性維持）

## 15. 実装完了チェックリスト

- [x] ExportRulesToJsonUseCase実装
- [x] ExportedRewriteRules型定義
- [x] DIコンテナ登録
- [x] RulesApp UIコンポーネント更新（エクスポートボタン）
- [x] CSSスタイル追加
- [x] 単体テスト実装（5テストケース）
- [x] TypeScriptコンパイル確認
- [x] ESLint確認
- [x] 全テスト成功確認

## 関連ドキュメント

- [JSON インポート機能 基本設計書](./json-import-feature.md)

---

**文書バージョン**: 1.0
**作成日**: 2025-11-24
**最終更新**: 2025-11-24
