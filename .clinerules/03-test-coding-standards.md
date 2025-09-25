# テストコーディング規約

このドキュメントは、SelectedPageTextServiceのテスト作成・修正経験から得られたテストコーディングのベストプラクティスを定義します。

## テストルール

### テストファイル構造
- **テストファイルは必ず対応する実装ファイルと同じディレクトリ構造を持つこと**
- **単体テストは、1メソッドごとに1ファイル以上にすること**
  - クラス単位でまとめない
  - 1メソッドでもあっても、ケースの内容や量によっては、適切に複数ファイルに分割すること

### 実装時の必須チェック
- **追加、変更があったメソッドには必ず単体テストを追加**
- **PRレビュー前に必ずテストを実行して通ることを確認**

# 共通ルール

全ての層のテストに適用される共通の規約です。

## 1. テストケースの統合と効率化

### 1.1 冗長なテストの統合原則
入力値パターンが同じで済むものについては、まずは1つのテストにまとめる：

```typescript
// ❌ 悪い例：冗長な個別テスト
it('should call chrome.storage API correctly', () => { /* ... */ });
it('should resolve successfully', () => { /* ... */ });
it('should return Promise type', () => { /* ... */ });

// ✅ 良い例：統合されたテスト
it('should correctly call chrome.storage API, resolve successfully, and return Promise', async () => {
  // Promise型確認、API呼び出し確認、結果確認を統合
});
```


## 2. JSDocと実装の一致性

### 2.1 JSDocの更新義務
テスト内容を変更した場合、JSDocコメントも必ず更新：

```typescript
/**
 * Chrome Storage APIの正しい呼び出し、正常解決、Promise型確認を統合的にテスト
 */
describe('SelectedPageTextService.setSelectedPageText - 正常系', () => {
  // 実装がJSDocの説明と一致していること
});
```

### 2.2 JSDoc記述原則
- 1ケースにつき1行でまとめる
- テストの実際の動作を正確に説明
  - 入出力値とそこから考えられるテストの目的
- 抽象的な表現を避け、具体的な検証内容を記述

#### 例
```typescript
/**
 * 1. 空文字列の保存処理
 * 2. 特殊文字・Unicodeの保存処理
 * 3. 長文テキストの保存処理  
 * 4. 改行・制御文字の保存処理
 */
describe('SelectedPageTextService.setSelectedPageText - エッジケース', () => {
  // 各ケースの実装
});
```

## 3. モックとテストセットアップ

### 3.1 beforeEach/afterEach の使用
```typescript
beforeEach(() => {
  service = new SelectedPageTextService();
  vi.clearAllMocks();  // 呼び出し履歴をクリア
});

afterEach(() => {
  vi.resetAllMocks();  // モックの実装をリセット
});
```

### 3.2 モック設定の原則
- グローバルなモックは統一的に設定
- テスト間でモック状態が漏れないよう適切にクリーンアップ
- モックの役割を明確にコメントで記述

## 4. バリデーションテスト

- サブクラスでバリデーションを実装している場合、そのバリデーションの返り値のパターン(異常値含む)だけ網羅できれば良い
  - 言い換えると、バリデーションの詳細なロジックはサブクラスのテストで網羅されているため、親クラスではバリデーションの結果に基づく動作のみをテストすれば良い



# Clean Architecture用ルール

Clean Architectureの各層に特化したテスト規約です。

## infrastructure層固有の規約

### 1. テストファイル構造とディレクトリ構成

#### 1.1 ディレクトリ構造の原則
```
tests/unit/infrastructure/[category]/[service-name]/
├── [method-name]/
│   ├── normal-cases.test.ts         # 正常系テスト
│   ├── edge-cases.test.ts           # エッジケーステスト
│   ├── multiple-calls.test.ts       # 複数回呼び出しテスト
│   └── Abend/                       # 異常系テスト専用ディレクトリ
│       ├── error-cases.test.ts      # エラーケース
│       ├── null-undefined-validation.test.ts  # null/undefinedバリデーション
│       └── [external-api]-undefined-cases.test.ts  # 外部API未定義ケース
```

**例**: `tests/unit/infrastructure/persistance/storage/SelectedPageTextService/`

#### 1.2 ファイル命名規則
- **正常系**: `normal-cases.test.ts`
- **エッジケース**: `edge-cases.test.ts`
- **複数回呼び出し**: `multiple-calls.test.ts`
- **エラーケース**: `Abend/error-cases.test.ts`
- **特定の異常系**: `Abend/[specific-case].test.ts`

#### 1.3 異常系テストの分離原則
- `Abend/` ディレクトリに異常系テストを分離
- 外部システム依存の異常ケースを重点的にテスト
- 正常系と異常系の明確な区分
- 異常系内でもケース別にファイルを分割

### 2. 外部依存システムのテスト

#### 2.1 Chrome拡張機能API
一旦この考慮は対象外とする

#### 2.2 その他の外部API
- ブラウザAPI（DOM、fetch、localStorage等）
- サードパーティライブラリAPI
- 各APIの未定義・エラー状態を網羅的にテスト

### 3. Infrastructure層特有のパターン

#### 3.1 リポジトリパターンのテスト
- データソースの接続エラー
- データの整合性チェック
- トランザクション処理のテスト

#### 3.2 アダプターパターンのテスト
- 外部システムとの互換性テスト
- データ変換の正確性テスト
- エラーハンドリングの適切性テスト

### 4. Infrastructure層でのモック戦略

#### 4.1 外部依存の完全モック化
- 全ての外部システムをモック化
- 外部システムの各種エラー状態を再現
- ネットワーク遅延・タイムアウトのシミュレーション

#### 4.2 境界値テスト
- 外部システムの制限値でのテスト
- リソース枯渇状態でのテスト
- 非同期処理の競合状態テスト
